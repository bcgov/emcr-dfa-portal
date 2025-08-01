import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/core/services/alert.service';
import { TimeoutService } from 'src/app/core/services/timeout.service';
import { ProfileService } from '../profile/profile.service';
import * as globalConst from '../../core/services/globalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { ConflictManagementService } from 'src/app/sharedModules/components/conflict-management/conflict-management.service';
import { ProfileDataConflict } from 'src/app/core/api/models';
import { ProfileMappingService } from '../profile/profile-mapping.service';
import { EmailInviteService } from '../../core/services/emailInvite.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-verified-registration',
  standalone: false,
  templateUrl: './verified-registration.component.html',
  styleUrls: ['./verified-registration.component.scss']
})
export class VerifiedRegistrationComponent implements OnInit {
  constructor(
    private timeOutService: TimeoutService,
    private profileService: ProfileService,
    private alertService: AlertService,
    private conflictService: ConflictManagementService,
    private mappingService: ProfileMappingService,
    private router: Router,
    private route: ActivatedRoute,
    private emailService: EmailInviteService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParamMap;
    const inviteId: string = queryParams.get('inviteId') ?? undefined;


    if (inviteId !== undefined) {
      this.emailService.validateInvite(inviteId).subscribe({
        next: () => {
          // this.router.navigate(['/verified-registration']);
          this.loadExistingProfileWorkflow();
        },
        error: () => {
          this.router.navigate(['/invite-error']);
        }
      });
    } else {
      //this.loadNewProfileWorkflow();
      this.profileService.profileExists().subscribe({
        next: (exists: boolean) => {
          if (!exists) {
            this.loadNewProfileWorkflow();
          } else {
            this.loadExistingProfileWorkflow();
          }
        },
        error: (error) => {
           // document.location.href = 'https://dfa.gov.bc.ca/error.html';
          this._snackBar.open(
            'Unable to check profile existence. Please try again later.',
            'Close',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      });
    }
    
    this.timeOutService.init(
      this.timeOutService.timeOutInfo?.sessionTimeoutInMinutes ? this.timeOutService.timeOutInfo?.sessionTimeoutInMinutes : 10,
      this.timeOutService.timeOutInfo?.warningMessageDuration ? this.timeOutService.timeOutInfo?.warningMessageDuration : 6
    );
  }

  loadNewProfileWorkflow(): void {
    this.profileService.getLoginProfile();
    this.router.navigate(['/verified-registration/collection-notice']);
  }

  loadExistingProfileWorkflow() {
    this.router.navigate(['/dfa-dashboard']);
    //this.profileService.getProfile();
    //if (this.conflictService.getCount() === 0) {
    //  this.router.navigate(['/verified-registration/dashboard']);
    //} else if (
    //  !this.conflictService.getHasVisitedConflictPage() ||
    //  this.router.url === '/verified-registration/conflicts' ||
    //  this.router.url === '/verified-registration' ||
    //  this.conflictService.getCount() === null
    //) {
    //  this.loadProfileConflicts();
    //}
  }

  loadProfileConflicts() {
    this.profileService.getConflicts().subscribe({
      next: (conflicts: ProfileDataConflict[]) => {
        this.mappingService.mapConflicts(conflicts);
        if (conflicts.length !== 0) {
          this.router.navigate(['/verified-registration/conflicts']);
        } else {
          this.router.navigate(['/verified-registration/dashboard']);
        }
      },
      error: (error) => {
        // document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }
}
