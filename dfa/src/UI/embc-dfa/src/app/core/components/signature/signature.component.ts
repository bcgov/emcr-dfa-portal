import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { SignatureBlock } from 'src/app/core/api/models';

@Component({
  selector: 'app-signature',
  standalone: false,
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})

export class SignatureComponent implements AfterViewInit, OnChanges {

  @ViewChild('canvas', {static: false}) public canvas: ElementRef;

  @Input() isRequired: boolean;
  @Input() whoseSignature: string;
  @Input() initialSignedName: string;
  @Input() initialDateSigned: string;

  @Input()
  set isReadOnly(value: boolean | string) {
    this._isReadOnly = value === true || value === 'true';
  }
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }
  private _isReadOnly: boolean = false;

  @Input() initialSignature: string;
  @Input() signatureFormGroup: FormGroup;
  @Output() public signature: EventEmitter<SignatureBlock> = new EventEmitter<SignatureBlock>();

  private canvasEl: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  public signatureBlock: SignatureBlock;

  constructor() {
    this.signatureBlock = { signedName: null, dateSigned: null, signature: null};
  }

  ngOnInit() {
    this.signatureFormGroup.get('signedName').valueChanges.subscribe(() => {
      this.updateSignatureBlock();
    });
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.canvasEl = canvasEl;
    this.context = canvasEl.getContext('2d');
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 1;
    this.captureEvents(canvasEl);
  }

  ngOnChanges(event: SimpleChanges): void {
    if (!this.signatureFormGroup) return;

    const signedNameCtrl = this.signatureFormGroup.get('signedName');
    const dateSignedCtrl = this.signatureFormGroup.get('dateSigned');
    const signatureCtrl = this.signatureFormGroup.get('signature');

    // Disable controls if isReadOnly is true
    if (this.isReadOnly) {
      signedNameCtrl?.disable({ emitEvent: false });
      dateSignedCtrl?.disable({ emitEvent: false });
      signatureCtrl?.disable({ emitEvent: false });
    } else {
      signedNameCtrl?.enable({ emitEvent: false });
      dateSignedCtrl?.enable({ emitEvent: false });
      signatureCtrl?.enable({ emitEvent: false });
    }

    // Set initial values if provided and not already set
    if (this.initialSignedName && !signedNameCtrl?.value) {
      signedNameCtrl?.setValue(this.initialSignedName, { emitEvent: false });
    }

    if (this.initialDateSigned && !dateSignedCtrl?.value) {
      const parsedDate = new Date(this.initialDateSigned);
      dateSignedCtrl?.setValue(
        isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
        { emitEvent: false }
      );
    } else if (!dateSignedCtrl?.value) {
      dateSignedCtrl?.setValue(new Date(), { emitEvent: false });
    }

    if (this.initialSignature && !signatureCtrl?.value) {
      signatureCtrl?.setValue(this.initialSignature, { emitEvent: false });
      this.signatureBlock.signature = this.initialSignature;

      // Draw signature
      const canvasEl: HTMLCanvasElement = this.canvas?.nativeElement;
      const ctxt = canvasEl?.getContext("2d");
      const background = new Image();
      background.src = this.initialSignature;
      background.onload = () => {
        ctxt?.drawImage(background, 0, 0, canvasEl?.width, canvasEl?.height);
      };
    }
  }


  private isCanvasBlank(canvas: HTMLCanvasElement): boolean {
    const context = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
    return !pixelBuffer.some(color => color !== 0);
  }

  // store in signature block to emit
  updateCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    if (this.isCanvasBlank(canvasEl)) {
      this.signatureBlock.signature = null;
      this.signatureFormGroup.get('signature')?.setValue(null);
    } else {
      this.signatureBlock.signature = canvasEl.toDataURL();
      this.signatureFormGroup.get('signature')?.setValue(this.signatureBlock.signature);
    }
    this.updateSignatureBlock();
  }

  // emit changes to parent component directly from the form group
  updateSignatureBlock() {
    this.signature.emit({
      signedName: this.signatureFormGroup.get('signedName')?.value,
      dateSigned: this.signatureFormGroup.get('dateSigned')?.value,
      signature: this.signatureBlock.signature
    });
  }

  // For touch drawing prevent scrolling of page with mouse button down within canvas
  public preventDefault(e: Event) {
    e.preventDefault();
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: canvasEl.width * (res[0].clientX - rect.left) / rect.width,  // scale to canvas size
          y: canvasEl.height * (res[0].clientY - rect.top) / rect.height
        };

        const currentPos = {
          x: canvasEl.width * (res[1].clientX - rect.left) / rect.width,
          y: canvasEl.height * (res[1].clientY - rect.top) / rect.height
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });

      fromEvent(canvasEl, 'touchstart')
      .pipe(
        switchMap((e) => {
          // after a touch start, we'll record all touch moves
          return fromEvent(canvasEl, 'touchmove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the touch
              // this will trigger a 'touchend' event
              takeUntil(fromEvent(canvasEl, 'touchend')),
              // we'll also stop (and unsubscribe) once the touch leaves the canvas (touchcancel event)
              takeUntil(fromEvent(canvasEl, 'touchcancel')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            )
        })
      )
      .subscribe((res: [TouchEvent, TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: canvasEl.width * (res[0].touches[0].clientX - rect.left) / rect.width,
          y: canvasEl.height * (res[0].touches[0].clientY - rect.top) / rect.height
        };

        const currentPos = {
          x: canvasEl.width * (res[1].touches[0].clientX - rect.left) / rect.width,
          y: canvasEl.height * (res[1].touches[0].clientY - rect.top) / rect.height
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(
    prevPos: { x: number, y: number },
    currentPos: { x: number, y: number }
  ) {
    // incase the context is not set
    if (!this.context) { return; }

    // start our drawing path
    this.context.beginPath();

    // we're drawing lines so we need a previous position
    if (prevPos) {
      // sets the start point
      this.context.moveTo(prevPos.x, prevPos.y); // from

      // draws a line from the start pos until the current position
      this.context.lineTo(currentPos.x, currentPos.y);

      // strokes the current path with the styles we set earlier
      this.context.stroke();
    }
  }

  public clearCanvas() {
      this.context
          .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.signatureBlock.signature = null;
      this.updateSignatureBlock();
  }
}

new SignatureComponent();
