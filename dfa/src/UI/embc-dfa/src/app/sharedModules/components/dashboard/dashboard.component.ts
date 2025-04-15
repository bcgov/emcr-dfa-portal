import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { TabModel } from 'src/app/core/model/tab.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import * as globalConst from '../../../core/services/globalConstants';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentFlow: string;
  activeFiles: number;
  emptyRegistrationResult: string = null;

  tabs: TabModel[] = [
    //{
    //  label: 'Current Events',
    //  route: 'current',
    //  activeImage: '/assets/images/curr-evac-active.svg',
    //  inactiveImage: '/assets/images/curr-evac.svg'
    //},
    //{
    //  label: 'Past Events',
    //  route: 'past',
    //  activeImage: '/assets/images/past-evac-active.svg',
    //  inactiveImage: '/assets/images/past-evac.svg'
    //},
    {
      label: 'Profile',
      route: 'profile',
      activeImage: '/assets/images/profile-active.svg',
      inactiveImage: '/assets/images/profile.svg'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    public formCreationService: FormCreationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;

    setTimeout(() => {
    }, 500);
  }

    startAssessment(): void {
    this.router.navigate(['/verified-registration/confirm-restriction']);
  }
}
