import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';

@Directive({
  selector: '[featureEnabled]',
  standalone: true
})
export class FeatureEnabledDirective implements OnInit {
  @Input('featureEnabled') featureName: string;
  @Input('featureEnabledIf') featureEnabledIf: boolean = true;

  constructor(private el: ElementRef, private configService: ConfigService) {
    console.log('featureEnabledDirective initialized');
 }

  ngOnInit() {
    console.log(`Checking feature flag: ${this.featureName}, expected: ${this.featureEnabledIf}`);
    console.log(`Feature flag value: ${this.configService.configuration.featureFlags.useAppeals}`);
    //if (this.featureFlagService.feature(this.featureName) == true) {
    if (this.configService.configuration.featureFlags.useAppeals !== this.featureEnabledIf) {
      this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
    }
  }
}
