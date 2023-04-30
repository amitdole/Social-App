import { Component, OnInit } from '@angular/core';
import { Friend } from '../_models/friend';
import { FriendsService } from '../_services/Friends.service';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  friends: Friend[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;

  constructor(private friendService: FriendsService) {}
  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.friendService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        console.log(response);
        this.friends = response.result;
        this.pagination = response.pagination;
      }
    })
  }

  pageChanged(event: any){
    if (this.pageNumber !== event.page){
    this.pageNumber = event.page;
    this.loadLikes();
    }
  }
}
