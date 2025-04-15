import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileDataService } from '../profile/profile-data.service';
import { EligibilityService } from 'src/app/core/api/services';

@Component({
  selector: 'app-nextstepsprofile',
  standalone: false,
  templateUrl: './nextstepsprofile.component.html',
  styleUrls: ['./nextstepsprofile.component.scss']
})
export class NextstepsprofileComponent implements OnInit {
  profileId: string;
  eventsCount: number = 0;

  constructor(
    private router: Router,
    profileDataService: ProfileDataService,
    private eligibilityService: EligibilityService
  ) {
    var profileId = profileDataService.getProfileId();
   }

  ngOnInit(): void {
    this.eligibilityService.eligibilityGetEvents().subscribe(eventsCount => {
      this.eventsCount = eventsCount;
    })
  }

  navigateToDFAPrescreening(): void {
    this.router.navigate(['/dfa-prescreening']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dfa-dashboard']);
  }

}
