import { EventEmitter, Injectable } from '@angular/core';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class AppSessionService {
  private editParentPageVal: string;
  public currentApplicationsCount: EventEmitter<number> = new EventEmitter<number>();
  public pastApplicationsCount: EventEmitter<number> = new EventEmitter<number>();
  public currentProjectsCount: EventEmitter<number> = new EventEmitter<number>();
  public pastProjectsCount: EventEmitter<number> = new EventEmitter<number>();
  public openClaimsCount: EventEmitter<number> = new EventEmitter<number>();
  public closedClaimsCount: EventEmitter<number> = new EventEmitter<number>();
  public openAmendmentsCount: EventEmitter<number> = new EventEmitter<number>();
  public closedAmendmentsCount: EventEmitter<number> = new EventEmitter<number>();

  constructor(private cacheService: CacheService) {}

  public get editParentPage(): string {
    return this.editParentPageVal
      ? this.editParentPageVal
      : this.cacheService.get('editParentPage');
  }
  public set editParentPage(value: string) {
    this.editParentPageVal = value;
    this.cacheService.set('editParentPage', value);
  }

}
