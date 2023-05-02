import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { FriendsService } from '../_services/Friends.service';
import { Friend } from '../_models/friend';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Friend> {

  constructor(private friendsService: FriendsService) {
    
  }
  resolve(route: ActivatedRouteSnapshot): Observable<Friend> {
    return this.friendsService.getFriend(route.paramMap.get('userName')!)
  }
}
