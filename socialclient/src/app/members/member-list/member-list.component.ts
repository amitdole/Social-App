import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Friend } from 'src/app/_models/friend';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userparams';
import { FriendsService } from 'src/app/_services/Friends.service';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  // friends$: Observable<Friend[]> | undefined;
  friends$: Friend[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams| undefined;
  
  genderList = [{value: 'male', display:'Males'},{value: 'female', display:'Females'}]

  constructor(private friendsService: FriendsService) {
    this.userParams = this.friendsService.getUserParams();
  }

  ngOnInit(): void {
    // this.friends$ = this.friendsService.getFriends();
    this.loadFriends();
  }

  loadFriends(){
    if (this.userParams){
      this.friendsService.setUserParams(this.userParams);
      this.friendsService.getFriends(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination){
            this.friends$ = response.result;
            this.pagination = response.pagination;
          }
        }
      })
    }
  }

  resetFilters()
  {
    this.userParams = this.friendsService.resetUserParams();
      this.loadFriends()
  }

  pageChanged(event: any){
    if (this.userParams && this.userParams.pageNumber !== event.page){
    this.userParams.pageNumber = event.page;
    this.friendsService.setUserParams(this.userParams);
    this.loadFriends();
    }
  }
}
