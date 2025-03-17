import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EnvironmentInformation } from '../../services/environment.service';
import { EnvironmentBannerService } from '../../services/environment.service';



@Component({
  selector: 'app-environment-banner',
  imports: [NgStyle],
  templateUrl: './environment-banner.component.html',
  styleUrl: './environment-banner.component.scss',
  standalone: true
})
export class EnvironmentBannerComponent implements OnInit {

  public environment?: EnvironmentInformation;

  constructor(private environmentBannerService: EnvironmentBannerService) { 

  }

  ngOnInit(): void {
    this.environmentBannerService.getEnvironment().subscribe(environment => {
      this.environment = environment;
    });
  }
  
}