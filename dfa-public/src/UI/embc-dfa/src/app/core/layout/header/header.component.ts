import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FormCreationService } from '../../services/formCreation.service';
import { CacheService } from '../../services/cache.service';
import { ContactService } from 'src/app/core/api/services';
import { LoginService } from '../../../core/services/login.service';
import { first, map, mergeMap } from 'rxjs';
import { DFAApplicationMainDataService } from '../../../feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAClaimMainDataService } from '../../../feature-components/dfa-claim-main/dfa-claim-main-data.service';
import { DFAProjectMainDataService } from '../../../feature-components/dfa-project-main/dfa-project-main-data.service';
import { forEachChild } from 'typescript';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showLoginMatMenu: boolean;
  showBreadcrumb: boolean = true;

  firstName: string = "";
  lastName: string = "";
  appId = null;
  projId = null;
  claimId = null;

  appviewedit = null;
  projviewedit = null;
  claimviewedit = null;

  menuHeader: any = [];
  appitems = [
    {
      label: 'Login',
      link: '',
      icon: 'pan_tool',
      path: '/registration-method',
      level: 0,
      excluded: true,
      islink: false
    },
    {
      label: 'Create Application',
      link: '',
      icon: 'pan_tool',
      path: 'dfa-application-main',
      level: 2,
      excluded: true,
      islink: true
    },
    {
      label: 'View Application',
      link: 'dfa-application-main/appid',
      icon: 'pan_tool',
      path: 'dfa-application-main/',
      level: 2,
      excluded: false,
      islink: true
    },
    {
      label: 'Project Dashboard',
      link: 'dfa-application/appid/projects',
      icon: 'pan_tool',
      path: '/projects',
      level: 3,
      excluded: false,
      islink: true
    },
    {
      label: 'Create Project',
      link: 'dfa-project-main/prjid',
      icon: 'pan_tool',
      path: '/dfa-project-main/',
      level: 4,
      excluded: true,
      islink: true
    },
    {
      label: 'View Project',
      link: 'dfa-project-view/prjid',
      icon: 'pan_tool',
      path: '/dfa-project-view/',
      level: 4,
      excluded: false,
      islink: true
    },
        {
      label: 'Amendment Dashboard',
      link: 'dfa-project-main/prjid/project-amendments',
      icon: 'pan_tool',
      path: '/project-amendments',
      level: 4,
      excluded: false,
      islink: true
    },
    {
      label: 'View Amendment',
      link: 'dfa-project-amendment/prjid',
      icon: 'pan_tool',
      path: '/dfa-project-amendment/',
      level: 5,
      excluded: true,
      islink: true
    },
    {
      label: 'Claim Dashboard',
      link: 'dfa-project/prjid/claims',
      icon: 'pan_tool',
      path: '/claims',
      level: 5,
      excluded: false,
      islink: true
    },
    {
      label: 'Claim Create',
      link: 'dfa-claim-main/clid',
      icon: 'pan_tool',
      path: '/dfa-claim-main/',
      level: 6,
      excluded: true,
      islink: true
    },
    {
      label: 'View Claim',
      link: 'dfa-claim-main/clid',
      icon: 'pan_tool',
      path: '/dfa-claim-main/',
      level: 6,
      excluded: true,
      islink: true
    },
    {
      label: 'Claim Decision',
      link: 'app-claim-decision/clid',
      icon: 'pan_tool',
      path: '/app-claim-decision/',
      level: 6,
      excluded: true,
      islink: true
    },
    
  ];

  constructor(
    public formCreationService: FormCreationService,
    private router: Router,
    private cacheService: CacheService,
    private contactService: ContactService,
    private loginService: LoginService,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dfaProjectMainDataService: DFAProjectMainDataService,
    private dfaClaimMainDataService: DFAClaimMainDataService,
    private route: ActivatedRoute
  ) {
    router.events.subscribe(event => {
      
      if (event instanceof NavigationStart) {
        var currentItem = null;

        this.appitems.forEach(obj => {
          if (event.url.indexOf(obj.path) > -1) {
            currentItem = obj;
            //item.link = 
          }
        });
        
        if (currentItem) {
          this.showBreadcrumb = true;
          this.menuHeader = [];
          this.appitems.filter(m => m.level < currentItem.level && m.excluded == false).forEach(obj => {
            this.menuHeader.push(obj);
          });

          const curItem = JSON.parse(JSON.stringify(currentItem)); ;
          curItem.islink = false;
          this.menuHeader.push(curItem);
        }
        else {
          this.menuHeader = [];
          this.showBreadcrumb = false;
        }
      }

      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('/dfa-dashboard') > -1) {
          this.menuHeader = [];
          this.showBreadcrumb = true;
        }
      }

    });
  }

  ngOnInit(): void {

    this.showLoginMatMenu = false;
    this.appId = this.dfaApplicationMainDataService.getApplicationId();
    this.projId = this.dfaProjectMainDataService.getProjectId();
    this.claimId = this.dfaClaimMainDataService.getClaimId();

    this.dfaApplicationMainDataService.changeAppId.subscribe((appId) => {
      this.appId = appId;
    });

    this.dfaProjectMainDataService.changeProjectId.subscribe((projId) => {
      this.projId = projId;
    })

    this.dfaClaimMainDataService.changeClaimId.subscribe((claimId) => {
      this.claimId = claimId;
    });

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((appviewedit) => {
      this.appviewedit = appviewedit == 'add' || appviewedit == 'edit' || appviewedit == 'update' ? true : false;
    });

    this.dfaProjectMainDataService.changeViewOrEdit.subscribe((projviewedit) => {
      this.projviewedit = projviewedit == 'add' || projviewedit == 'edit' || projviewedit == 'update' ? true : false;
    })

    this.dfaClaimMainDataService.changeViewOrEdit.subscribe((claimviewedit) => {
      this.claimviewedit = claimviewedit == 'add' || claimviewedit == 'edit' || claimviewedit == 'update' ? true : false;
    });
    
    // console.debug('[DFA] header.component about to call middle-tier API.');

    // 2024-08-12 EMCRI-487 waynezen; use new ContactService to get Business Name from Keycloak access token
    this.loginService
      .isAuthenticated$
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          // EMCRI-939 waynezen; angular-auth-oidc-client says we're logged in
          //console.debug("[DFA] header.component: is authenticated");
          this.contactService.contactGetDashboardContactInfo()
            .pipe(first())
            .subscribe(loginInfo => {
              //console.debug("[DFA] header.component: got names");
              this.showLoginMatMenu = true;
              this.lastName = loginInfo?.individualSurname;
              this.firstName = loginInfo?.individualFirstname;
            })
        }
        else {
          // EMCRI-939 waynezen; angular-auth-oidc-client not authenticated yet.. check middle-tier API for auth status
          this.contactService.contactGetAuthenticatedStatus()
            .pipe(first())
            .subscribe(isAuthenticated => {
              //console.debug("[DFA] header.component: angular client is NOT authenticated; server isAuthenticatedStatus: " + isAuthenticated);

              if (isAuthenticated) {
                // EMCRI-939 waynezen; middle-tier API says we're authenticated - get logged in user info
                this.contactService.contactGetDashboardContactInfo()
                  .pipe(first())
                  .subscribe(loginInfo => {
                    // console.debug("[DFA] header.component: got names(2), firstname: " + loginInfo?.individualFirstname);
                    if (loginInfo?.individualFirstname) {
                      this.showLoginMatMenu = true;
                      this.lastName = loginInfo?.individualSurname;
                      this.firstName = loginInfo?.individualFirstname;

                      // EMCRI-939 waynezen; correct angular-auth-oidc-client bad state
                      // console.debug("[DFA] header.component: force authenticated");
                      this.loginService.forceAuthenticated();
                    }
                    else {
                      this.showLoginMatMenu = false;
                    }
                  })
              }
              // else {
              //   // EMCRI-939 waynezen; both angular-auth-oidc-client AND middle-tier API say we're not logged in - force a relogin
              //   console.debug('[DFA] forcing a re-login');
              //   this.router.navigate(['/registration-method']);
              // }
            })
        }
      });

  }

  breadCrumbMain() {
    this.menuHeader = [];
    this.router.navigate(['dfa-dashboard']);
  }

  appitemsTravel;

  breadCrumb(menuItem, c) {
    var path = '';

    if (menuItem) {
      if (menuItem.link.indexOf('appid') > -1) {
        path = menuItem.link.replace("appid", this.appId);
      }

      if (menuItem.link.indexOf('prjid') > -1) {
        path = menuItem.link.replace("prjid", this.projId);
      }

      if (menuItem.link.indexOf('clid') > -1) {
        path = menuItem.link.replace("clid", this.claimId);
      }
    }

    this.router.navigate([path]);
  }

  menuChange(menuChange) {

    if (menuChange.items) {

      this.appitemsTravel = menuChange.items;
      this.menuHeader.push({ label: menuChange.label, icon: 'keyboard_arrow_right', items: menuChange.items });
      // this.menuHeader.push(menuChange);

      //console.log('hasMultiMenuLabel');
    }
  }

  homeButton(): void { }

  public async signOut(): Promise<void> {
    // 2024-06-05 EMCRI-217 waynezen: use new BCeID async Auth
    this.showLoginMatMenu = false;
    this.loginService.logOff();
    this.router.navigate(['/registration-method']);
  }
}
