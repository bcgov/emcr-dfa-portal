import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-claim-appeal',
  standalone: true,
  imports: [
    
  ],
  templateUrl: './claim-appeal.component.html',
  styleUrl: './claim-appeal.component.scss'
})

export class ClaimAppealComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const claimId = this.route.snapshot.paramMap.get('claimId');
    console.log('Claim ID in appeal screen:', claimId);
  }
}
