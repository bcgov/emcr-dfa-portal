import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Profile, ProfileDataConflict } from '../../core/api/models';
import { ProfileService as Service } from '../../core/api/services/profile.service';
import { ProfileMappingService } from './profile-mapping.service';
import * as globalConst from '../../core/services/globalConstants';
import { AlertService } from 'src/app/core/services/alert.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(
    private profileService: Service,
    private profileMapping: ProfileMappingService,
    private alertService: AlertService
  ) {}

  public profileExists(): Observable<boolean> {
    return this.profileService.profileGetDoesUserExists();
  }

  public getLoginProfile(): void {
    this.profileService.profileGetProfile().subscribe({
      next: (loginProfile) => {
        this.profileMapping.mapLoginProfile(loginProfile);
      },
      error: (error) => {
        console.error('Error fetching login profile:', error);
        // document.location.href = 'https://dfa.gov.bc.ca/error.html';
        
      }
    });
  }

  public getProfile(): void {
    this.profileService.profileGetProfile().subscribe({
      next: (profile) => {
        this.profileMapping.mapProfile(profile);
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        // document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  public getConflicts(): Observable<ProfileDataConflict[]> {
    return this.profileService.profileGetProfileConflicts();
  }

  public upsertProfile(updatedProfile: Profile): Observable<string> {
    return this.profileService.profileAddContact({ body: updatedProfile });
    //  .pipe(
    //  mergeMap((id) => this.profileService.profileGetProfile()),
    //  map((profile) => {
    //    //this.profileMapping.mapProfile(profile);
    //    return profile.id;
    //  })
    //);
  }
}
