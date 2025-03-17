import { Component, OnInit } from '@angular/core';
import { EnvironmentBannerService, EnvironmentInformation } from '../../services/environment.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-outage-banner',
  imports: [DatePipe],
  templateUrl: './outage-banner.component.html',
  styleUrl: './outage-banner.component.scss',
  standalone: true
})
export class OutageBannerComponent implements OnInit {

  
  public environment?: EnvironmentInformation;

  constructor(private environmentBannerService: EnvironmentBannerService) { }

  ngOnInit(): void {
    this.environmentBannerService.getEnvironment().subscribe(environment => {
      this.environment = environment;
    });
  }

}
