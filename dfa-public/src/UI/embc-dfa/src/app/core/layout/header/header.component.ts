import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormCreationService } from '../../services/formCreation.service';
import { CacheService } from '../../services/cache.service';
import { ContactService } from 'src/app/core/api/services';
import { LoginService } from '../../../core/services/login.service';
import { first, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showLoginMatMenu: boolean;

  firstName: string = "";
  lastName: string = "";

  constructor(
    public formCreationService: FormCreationService,
    private router: Router,
    private cacheService: CacheService,
    private contactService: ContactService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {

    this.showLoginMatMenu = false;

    // console.debug('[DFA] header.component about to call middle-tier API.');

    // 2024-08-12 EMCRI-487 waynezen; use new ContactService to get Business Name from Keycloak access token
    this.loginService
      .isAuthenticated$
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          // console.debug("[DFA] header.component: is authenticated");
          this.contactService.contactGetDashboardContactInfo()
            .subscribe(loginInfo => {
              // console.debug("[DFA] header.component: got names");
              this.showLoginMatMenu = true;
              this.lastName = loginInfo?.individualSurname;
              this.firstName = loginInfo?.individualFirstname;    
            })
        }
        else {
          this.firstName = "<unknown>";
        }
      });
  }

  homeButton(): void { }

  public async signOut(): Promise<void> {
    // 2024-06-05 EMCRI-217 waynezen: use new BCeID async Auth
    this.loginService.logOff();
    this.router.navigate(['/registration-method']);
  }
}
