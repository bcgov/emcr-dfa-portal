import { Component, OnInit, Input, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { from } from 'rxjs';
import { UntypedFormBuilder } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DocumentViewingComponent } from 'shared-ui';
import { ReviewComponent } from 'src/app/feature-components/review/review.component';

@Component({
  selector: 'app-component-wrapper',
  standalone: false,
  templateUrl: './component-wrapper.component.html',
  styleUrls: ['./component-wrapper.component.scss']
})
export class ComponentWrapperComponent implements OnInit, OnChanges {
  @Input() componentName: string;
  @Input() folderPath: string;
  @Input() key: string; 
  loadedComponent: any;
  serviceInjector: Injector;

  private sharedComponentMap = {
    'document-viewing': DocumentViewingComponent,
    'review': ReviewComponent
  }

  constructor(
    private injector: Injector,
    private formBuilder: UntypedFormBuilder,
    private formCreationService: FormCreationService
  ) {}

  /**
   * Initializes the services and loads the component to
   * the view
   */
  ngOnInit(): void {
    this.setupServiceInjector();
    this.loadAndRenderComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['componentName'] && !changes['componentName'].firstChange) {
      this.loadAndRenderComponent();
    }
  }

  private setupServiceInjector(): void {
    this.serviceInjector = Injector.create({
      providers: [
        {
          provide: 'formBuilder',
          useValue: this.formBuilder
        },
        {
          provide: 'formCreationService',
          useValue: this.formCreationService
        }
      ],
      parent: this.injector
    });
  }

  private loadAndRenderComponent(): void {
    if (this.sharedComponentMap[this.componentName]) {
      this.loadedComponent = this.sharedComponentMap[this.componentName];
    } else {
      from(this.loadComponent()).subscribe((module) => {
        this.loadedComponent = module.default;
      });
    }
  }

  /**
   * Imports the component
   */
  loadComponent(): Promise<any> {
    return Promise.resolve(
      import(
        `../../forms/${this.folderPath}/${this.componentName}/${this.componentName}.component`
      )
    );
  }
}
