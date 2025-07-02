import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { ApiModule } from './core/api/api.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
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
import { SharedUiModule } from 'shared-ui';

@NgModule({
    declarations: [AppComponent, OutageBannerComponent, OutageDialogComponent],
    exports: [
        MatIconModule
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        MatDatepickerModule,
        AppRoutingModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        CoreModule,
        ApiModule.forRoot({ rootUrl: '.' }),
        NgIdleKeepaliveModule.forRoot(),
        OAuthModule.forRoot({
            resourceServer: {
                sendAccessToken: true,
                customUrlValidation: (url) => url.toLowerCase().includes('/api/') &&
                    !url.toLowerCase().endsWith('/configuration')
            }
        }),
        LayoutModule,
        ButtonsModule,
        MatIconModule,
        MatAutocompleteModule,
        SharedUiModule,
    ],
    providers: [
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
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule { }
export class MaterialModule { }
