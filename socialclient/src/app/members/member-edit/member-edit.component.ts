import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Friend } from 'src/app/_models/friend';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { FriendsService } from 'src/app/_services/Friends.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm | undefined
  @HostListener('window:beforeunload',['$event']) unloadNotification($event:any){
    if(this.editForm?.dirty)
    {
      $event.returnValue = true;
    }
  }

  friend: Friend | undefined;
  user: User | null = null;
  
  constructor(private accountService: AccountService, 
    private friendsService: FriendsService, 
    private toastr: ToastrService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user 
    })
  }

  ngOnInit(): void {
    this.loadFriend();
  }

  loadFriend(){
    if (!this.user) return;

    this.friendsService.getFriend(this.user.userName).subscribe({
      next: friend => this.friend = friend
    })
  }

  updateFriend(){
    this.friendsService.updateFriend(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success("Profile updated sucessfully");
        this.editForm?.reset(this.friend)
      }
    })
  }
}
