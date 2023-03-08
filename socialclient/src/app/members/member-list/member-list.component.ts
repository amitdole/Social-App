import { Component, OnInit } from '@angular/core';
import { Friend } from 'src/app/_models/friend';
import { FriendsService } from 'src/app/_services/Friends.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  friends: Friend[] = [];

  constructor(private friendsService: FriendsService) {}

  ngOnInit(): void {
    this.loadFreinds();
  }

  loadFreinds(){
    this.friendsService.getFriends().subscribe({
      next: friends => this.friends = friends
    })
  }
}
