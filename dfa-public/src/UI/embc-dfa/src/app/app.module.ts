import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { ApiModule } from './core/api/api.module';
import { CommonModule, APP_BASE_HREF, PlatformLocation } from '@angular/common';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { OutageBannerComponent } from './sharedModules/outage-components/outage-banner/outage-banner.component';
import { OutageDialogComponent } from './sharedModules/outage-components/outage-dialog/outage-dialog.component';
import { LayoutModule } from "@progress/kendo-angular-layout";
//import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
//import { LabelModule } from "@progress/kendo-angular-label";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { ICON_SETTINGS } from "@progress/kendo-angular-icons";
import { MatIconModule } from '@angular/material/icon';
import { ScriptService } from "./core/services/scriptServices";
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoginService } from './core/services/login.service';
import { map } from 'rxjs';
import { AuthConfigModule } from './auth/auth-config.module';
import { CreateApplication1Module } from '../app/sharedModules/forms/dfa-application-main-forms/create-application1/create-application1.module';
import { BceidAuthInterceptor } from './core/interceptors/bceid-auth.interceptor'
import { environment } from '../environments/environment';

@NgModule({ declarations: [AppComponent, OutageBannerComponent, OutageDialogComponent],
    exports: [
        MatIconModule,
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        CommonModule,
        MatDatepickerModule,
        AppRoutingModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        CoreModule,
        // 2024-08-14 EMCRI-216 waynezen; upgrade to Angular 18
        ApiModule.forRoot({ rootUrl: environment.apiBaseUrl }),
        NgIdleKeepaliveModule.forRoot(),
        LayoutModule,
        ButtonsModule,
        MatIconModule,
        MatAutocompleteModule,
        CreateApplication1Module,
        AuthConfigModule], providers: [
        {
            provide: APP_BASE_HREF,
            useFactory: (s: PlatformLocation) => {
                let result = s.getBaseHrefFromDOM();
                if (result[result.length - 1] === '/') {
                    result = result.substring(0, result.length - 1);
                }
                return result;
            },
            deps: [PlatformLocation]
        },
        {
            provide: ICON_SETTINGS,
            useValue: { type: "font" },
        },
        ScriptService,
        // 2024-07-04 EMCRI-217 waynezen: send BCeID Access_token along with API calls
        // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 
        { provide: HTTP_INTERCEPTORS, useClass: BceidAuthInterceptor, multi: true },
        provideHttpClient(withFetch()),
    ] })


export class AppModule { }
export class MaterialModule { }


