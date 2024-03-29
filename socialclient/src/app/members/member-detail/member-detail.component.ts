import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';

import { Friend } from 'src/app/_models/friend';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { FriendsService } from 'src/app/_services/Friends.service';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  @ViewChild('memberTabs',{static: true}) membertabs?: TabsetComponent;
  friend: Friend = {} as Friend;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab?: TabDirective;
  messages: Message[] = []
  user?: User

  constructor(private accountService: AccountService, 
    private route: ActivatedRoute,
    private messageService: MessageService,
    public presenceService: PresenceService,
    private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    
    this.route.data.subscribe({
      next: data => this.friend = data['friend']
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]

    this.galleryImages= this.getImages();
  }

  getImages(){
    if (!this.friend) return[];

    const imageUrls = [];

    for(const photo of this.friend.photos){
      imageUrls.push({
        small: photo.url,
        medium:  photo.url,
        big:  photo.url
      })
    }

    return imageUrls;
  }
  
  loadMessages(){
    if (this.friend)
    {
      this.messageService.getMessageThread(this.friend.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.user){
      this.messageService.createHubConnection(this.user,this.friend.userName)
    }else{
      this.messageService.stopHubConnection();
    }
  }

  selectTab(heading: string){
    if (this.membertabs){
      this.membertabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }
}
