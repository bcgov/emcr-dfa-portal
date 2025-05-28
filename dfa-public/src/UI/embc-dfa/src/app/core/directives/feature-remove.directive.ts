import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';

@Directive({
  selector: '[featureRemove]',
  standalone: true
})
export class FeatureRemoveDirective implements OnInit {
  @Input('featureRemove') featureName: string;
  //@Input('featureRemoveIf') featureRemoveIf: boolean = true;

  constructor(private el: ElementRef, private configService: ConfigService) {
    console.log('FeatureRemoveDirective initialized');
 }

  ngOnInit() {
    //console.log(`Checking feature flag: ${this.featureName}, expected: ${this.featureRemoveIf}`);
    console.log(`Checking feature flag: ${this.featureName}`);
    console.log(`Feature flag value: ${this.configService.configuration.featureFlags.useAppeals}`);
    //if (this.featureFlagService.feature(this.featureName) == true) {
    if (!this.configService.configuration.featureFlags.useAppeals) {
      this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
    }
  }
}
