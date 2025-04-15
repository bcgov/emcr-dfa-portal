import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationService as Service } from '../../../core/api/services/application.service';
import { AppSessionService } from 'src/app/core/services/appSession.service';

@Component({
  selector: 'app-dfa-profile',
  standalone: false,
  templateUrl: './dfa-profile.component.html',
  styleUrls: ['./dfa-profile.component.scss']
})
export class DfaProfileComponent implements OnInit {
  type = 'profile';
  profileHeading: string;
  parentPageName = 'dfa-dashboard';
  currentFlow: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: Service,
    private appSessionService: AppSessionService,
  ) {
  }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
  }
}
