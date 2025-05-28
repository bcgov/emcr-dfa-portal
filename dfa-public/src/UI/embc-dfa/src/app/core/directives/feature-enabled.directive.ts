import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';

@Directive({
  selector: '[featureEnabled]',
  standalone: true
})
export class FeatureEnabledDirective implements OnInit {
  @Input('featureEnabled') featureName: string;
  @Input('featureEnabledIf') featureEnabledIf: boolean = true;

  constructor(private el: ElementRef, private configService: ConfigService) { }

  ngOnInit() {
    if (this.configService.configuration.featureFlags[this.featureName] !== this.featureEnabledIf) {
      this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
    }
  }
}
