import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface EnvironmentInformation {
    envName?: null | string;
    bannerTitle?: null | string;
    bannerSubTitle?: null | string;
    bannerColor?: null | string;
    startDisplayOutageBanner?: null| string;
    outageStart?: null| string;
    outageEnd?: null| string;
    dfaPublicUrl?: null| string;
    dfaPrivateUrl?: null| string;

  }

@Injectable({
    providedIn: 'root'
  })

export class EnvironmentBannerService{

    public configurationGetEnvironmentInfoPath = 'env/info.json';


    constructor(
        private http: HttpClient
    ){
        
    }


    public getEnvironment(): Observable<EnvironmentInformation> {

        const envUrl = this.configurationGetEnvironmentInfoPath;
        return this.http.get(envUrl);
      }

    
}