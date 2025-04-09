import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DisasterEvent, EffectedRegionCommunity } from 'src/app/core/api/models';
import { EligibilityService } from 'src/app/core/api/services';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { ProfileDataService } from 'src/app/feature-components/profile/profile-data.service';

@Component({
  selector: 'app-dfa-events',
  standalone: false,
  templateUrl: './dfa-events.component.html',
  styleUrls: ['./dfa-events.component.scss']
})
export class DfaEventsComponent implements OnInit {
  openDisasterEvents: DisasterEvent[] = [];
  effectedRegionCommunities: EffectedRegionCommunity[] = [];
  effectedRegionCommunitiesColumnsToDisplay = ['communityName', 'regionName'];
  effectedRegionCommunitiesDataSource = new MatTableDataSource();

  constructor (
     public eligibilityService: EligibilityService,
     private router: Router,
     private profileDataService: ProfileDataService,
     private dfaApplicationMainDataService: DFAApplicationMainDataService,
    )
    { }

  ngOnInit(): void {
    this.getOpenDisasterEvents();
    this.getEffectedRegionCommunities();
  }

  getOpenDisasterEvents() {
    this.eligibilityService.eligibilityGetOpenEvents().subscribe((openDisasterEvents: DisasterEvent[]) => {
      this.openDisasterEvents = openDisasterEvents;
    });
  }

  getRemainingDays(event: DisasterEvent): string {
    const remainingDays = Number(event.remainingDays) + 1; // Account for today
    if (remainingDays === 1) {
      return "Apply by midnight tonight";
    }
    return `${remainingDays} days remaining to apply`;
  }

  getEffectedRegionCommunities() {
    this.eligibilityService.eligibilityGetRegionCommunties().subscribe((effectedRegionCommunities: EffectedRegionCommunity[]) => {
      this.effectedRegionCommunities = effectedRegionCommunities;
      this.effectedRegionCommunitiesDataSource.data = effectedRegionCommunities;
    })
  }

  getEffectedRegionCommuntiesForEvent(eventId: string): EffectedRegionCommunity[] {
    return this.effectedRegionCommunities.filter(x => x.eventId == eventId);
  }

  checkEligibility() {
    this.dfaApplicationMainDataService.setViewOrEdit('add');
    var profileId = this.profileDataService.getProfileId();
    this.router.navigate(['/dfa-prescreening']);
  }
}
