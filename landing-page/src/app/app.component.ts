import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatCard, MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EnvironmentBannerComponent } from './components/environment-banner/environment-banner.component';
import { OutageBannerComponent } from './components/outage-banner/outage-banner.component';
import { EnvironmentBannerService, EnvironmentInformation } from './services/environment.service';


@Component({
  selector: 'app-root',
  imports: [
  RouterOutlet,
  MatCardModule, 
  MatCard,
  MatIconModule,
  MatButtonModule,
  EnvironmentBannerComponent,
  OutageBannerComponent
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

  constructor(private environmentBannerService: EnvironmentBannerService) { }

  ngOnInit(): void {
    this.environmentBannerService.getEnvironment().subscribe(environment => {
      this.environment = environment;
      if (environment.startDisplayOutageBanner) {
        this.startDisplayOutageBanner = new Date(environment.startDisplayOutageBanner).getTime();
      }
      
      if(environment.outageEnd){
        this.outageEnd = new Date(environment.outageEnd).getTime();

      }

      });
    }

  // public privatePortal = this.environment?.dfaPrivateUrl;
  // public publicPortal = this.environment?.dfaPublicUrl;

  
  naviagteToPublicDFA(){

      const publicUrl = this.environment?.dfaPublicUrl;
      if (publicUrl) {
        window.open(publicUrl, '_blank');
      } else {
        console.error('Public portal URL is not defined');
      }
    }
  

  naviagteToPrivateDFA(){
    const privateUrl = this.environment?.dfaPrivateUrl;
    if (privateUrl) {
      window.open(privateUrl, '_blank');
    } else {
      console.error('Private portal URL is not defined');
    }
  }
}

