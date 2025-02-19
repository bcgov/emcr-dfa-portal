import { Component, Input, OnInit } from '@angular/core';
import { EnvironmentInformation } from '../../model/environment-information.model';
import { EnvironmentBannerService } from './environment-banner.service';
import { MarkdownComponent } from 'ngx-markdown';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss']
})
export class EnvironmentBannerComponent implements OnInit {
  @Input() environment: EnvironmentInformation;

  constructor() {}

  ngOnInit(): void {
  }

}
