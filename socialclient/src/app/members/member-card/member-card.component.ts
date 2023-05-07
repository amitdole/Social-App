import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Friend } from 'src/app/_models/friend';
import { FriendsService } from 'src/app/_services/Friends.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberCardComponent implements OnInit {

  @Input() friend: Friend | undefined

  constructor(private friendService: FriendsService, 
    private toastr: ToastrService,
    public presenceService: PresenceService) {}

  ngOnInit(): void {
    
  }

  addLike(friend: Friend){
    this.friendService.addLike(friend.userName).subscribe({
      next: () => this.toastr.success('You have liked ' + friend.alias)
    })
  }

}
