import { Component, OnInit } from '@angular/core';
import { EnvironmentBannerService, EnvironmentInformation } from '../../services/environment.service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-outage-banner',
  imports: [DatePipe, MatIconModule],
  templateUrl: './outage-banner.component.html',
  styleUrl: './outage-banner.component.scss',
  standalone: true
})
export class OutageBannerComponent implements OnInit {

  
  public environment?: EnvironmentInformation;

  public starttime = "";
   public endtime = "";

  constructor(private environmentBannerService: EnvironmentBannerService) { }

  ngOnInit(): void {
    this.environmentBannerService.getEnvironment().subscribe(environment => {
      this.environment = environment;
      if (this.environment?.outageStart) {
        const outageDate = new Date(this.environment.outageStart);
        const hours = outageDate.getHours();
        this.starttime = hours >= 12 ? 'p.m.' : 'a.m.';
      }
      if (this.environment?.outageEnd) {
        const outageDate = new Date(this.environment.outageEnd);
        const hours = outageDate.getHours();
        this.endtime = hours >= 12 ? 'p.m.' : 'a.m.';
    }
  });
  }

}
