import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Friend } from 'src/app/_models/friend';
import { Pagination } from 'src/app/_models/pagination';
import { FriendsService } from 'src/app/_services/Friends.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  // friends$: Observable<Friend[]> | undefined;
  friends$: Friend[] = [];
  pagination: Pagination | undefined;
  pageNumber = 1;
  pageSize = 5;

  constructor(private friendsService: FriendsService) {}

  ngOnInit(): void {
    // this.friends$ = this.friendsService.getFriends();
    this.loadFriends();
  }

  loadFriends(){
    this.friendsService.getFriends(this.pageNumber, this.pageSize).subscribe({
      next: response => {
        if (response.result && response.pagination){
          this.friends$ = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }

  pageChanged(event: any){
    if (this.pageNumber !== event.page){}
    this.pageNumber = event.page;
    this.loadFriends();
  }
}
