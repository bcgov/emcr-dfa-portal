import { OnInit, Renderer2 } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from './core/services/alert.service';
import * as globalConst from './core/services/globalConstants';
import { BootstrapService } from './core/services/bootstrap.service';
import { LoginService } from './core/services/login.service';
import { ConfigService } from './core/services/config.service';
import { EnvironmentInformation } from './core/model/environment-information.model';
import { OutageService } from './feature-components/outage/outage.service';
import { ScriptService } from "./core/services/scriptServices";

const SCRIPT_PATH = 'http://ws1.postescanada-canadapost.ca/js/addresscomplete-2.30.min.js?key=ea53-hg74-kb59-ym41';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading = true;
  public color = '#169BD5';
  public environment: EnvironmentInformation = {};
  public gapi: any;

  constructor(
    public outageService: OutageService,
    public router: Router,
    private alertService: AlertService,
    private bootstrapService: BootstrapService,
    private loginService: LoginService,
    private configService: ConfigService,
    private renderer: Renderer2,
    private scriptService: ScriptService,
  ) {}

  public async ngOnInit(): Promise<void> {
    try {
      //this.environment = await this.configService.loadEnvironmentBanner();
      this.environment = null;
      await this.bootstrapService.init();
      // await this.loginService.tryLogin();
    } catch (error) {
      this.isLoading = false;
      if (error.status === 400 || error.status === 404) {
        this.environment = null;
      } else {
        this.isLoading = false;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    } finally {
      this.isLoading = false;
    }

    //const scriptElement = this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH);
    //scriptElement.onload = (obj) => {
    //  console.log('Canada post script loaded');
    //  console.log(JSON.stringify(obj));

    //  // Load the JavaScript client library.
    //  // (the init() method has been omitted for brevity)
    //  //this.gapi.load('client', init);
    //}
    //scriptElement.onerror = () => {
    //  console.log('Could not load the Google API Script!');
    //}
    
    //this.outageService.outagePolling();
    //this.outageService.startOutageInterval();
  }

  public closeOutageBanner($event: boolean): void {
    this.outageService.setShowOutageBanner($event);
    this.outageService.closeBannerbyUser = !$event;
  }
}
