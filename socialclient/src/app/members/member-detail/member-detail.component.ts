import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

import { Friend } from 'src/app/_models/friend';
import { Message } from 'src/app/_models/message';
import { FriendsService } from 'src/app/_services/Friends.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  @ViewChild('memberTabs',{static: true}) membertabs?: TabsetComponent;
  friend: Friend = {} as Friend;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab?: TabDirective;
  messages: Message[] = []

  constructor(private friendsService: FriendsService, 
    private route: ActivatedRoute,
    private messageService: MessageService) {}

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

    if (this.activeTab.heading === 'Messages'){
      this.loadMessages();
    }
  }

  selectTab(heading: string){
    console.log(heading);
    if (this.membertabs){
      this.membertabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }
}
