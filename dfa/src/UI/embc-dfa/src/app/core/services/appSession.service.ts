import { EventEmitter, Injectable } from '@angular/core';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class AppSessionService {
  private editParentPageVal: string;
  private appNumberVal: string;
  public currentApplicationsCount: EventEmitter<number> = new EventEmitter<number>();

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

  public get appNumber(): string {
    return this.appNumberVal;
      //? this.appNumberVal
      //: this.cacheService.get('appNumber');
  }
  public set appNumber(value: string) {
    this.appNumberVal = value;
    //this.cacheService.set('appNumber', value);
  }
}
