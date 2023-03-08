import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

import { Friend } from 'src/app/_models/friend';
import { FriendsService } from 'src/app/_services/Friends.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  friend: Friend | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(private friendsService: FriendsService, 
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadFriend();
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
  loadFriend(){
    const userName = this.route.snapshot.paramMap.get('userName');

    if (!userName) return;
    this.friendsService.getFriend(userName).subscribe({
      next: friend => {
        this.friend = friend;
        this.galleryImages= this.getImages();
      }
    });
  }
}
