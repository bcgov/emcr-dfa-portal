import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EnvironmentBannerComponent } from './components/environment-banner/environment-banner.component';
import { OutageBannerComponent } from './components/outage-banner/outage-banner.component';
import { EnvironmentBannerService, EnvironmentInformation } from './services/environment.service';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
  MatCardModule,
  MatCard,
  MatIconModule,
  MatButtonModule,
  EnvironmentBannerComponent,
  OutageBannerComponent,
  MatTooltipModule,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'landing-page';
  public environment?: EnvironmentInformation;
  public currentDate = Date.now();
  startDisplayOutageBanner?: number;
  outageEnd?: number;
  privateButtonDisabled: boolean = true;
  publicButtonDisabled: boolean = true;
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  constructor(private environmentBannerService: EnvironmentBannerService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.environmentBannerService.getEnvironment().subscribe(environment => {
      this.environment = environment;
      if (environment.startDisplayOutageBanner) {
        this.startDisplayOutageBanner = new Date(environment.startDisplayOutageBanner).getTime();
      }

      if (environment.outageEnd){
        this.outageEnd = new Date(environment.outageEnd).getTime();
      }

      // only check for events if public and private URLs are not disabled
      if ((!environment?.disablePublicUrl || !environment?.disablePrivateUrl) && !environment?.newApplicationNotAccepted) {
        this.httpClient.get(environment.apiEndpoint as string).subscribe((response: any) => {
          let hasActiveEventResponse = response as HasActiveEventResponse;
          console.info("Has Active Event Response", hasActiveEventResponse);
          if (hasActiveEventResponse) {
            if (!environment?.disablePrivateUrl && hasActiveEventResponse.hasActivePrivateEvent)
              this.privateButtonDisabled = false;

            if (!environment?.disablePublicUrl && hasActiveEventResponse.hasActivePublicEvent)
              this.publicButtonDisabled = false;
          }
        });
      }
    });
  }

  getPublicButtonDisabled(): boolean {
    return this.publicButtonDisabled || !!this.environment?.newApplicationNotAccepted || !!this.environment?.disablePublicUrl;
  }

  getPublicButtonTitle(): string {
    return this.getPublicButtonDisabled()
      ? "New applications are not currently being accepted"
      : "";
  }

  getPrivateButtonDisabled(): boolean {
    return this.privateButtonDisabled || !!this.environment?.newApplicationNotAccepted ||!!this.environment?.disablePrivateUrl;
  }

  getPrivateButtonTitle(): string {
    return this.getPrivateButtonDisabled()
      ? "New applications are not currently being accepted"
      : "";
  }

  navigateToPublicDFA(){
    const publicUrl = this.environment?.dfaPublicUrl;
    if (publicUrl) {
      window.open(publicUrl, '_blank');
    } else {
      console.error('Public portal URL is not defined');
    }
  }

  navigateToPrivateDFA(){
    const privateUrl = this.environment?.dfaPrivateUrl;
    if (privateUrl) {
      window.open(privateUrl, '_blank');
    } else {
      console.error('Private portal URL is not defined');
    }
  }
}

class HasActiveEventResponse
{
  hasActivePrivateEvent: boolean = false;
  hasActivePublicEvent: boolean = false;
}
