import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Friend } from 'src/app/_models/friend';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { FriendsService } from 'src/app/_services/Friends.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() friend: Friend | undefined 

  uploader: FileUploader | undefined
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined

  constructor(private accountService: AccountService, private friendsService: FriendsService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) 
        {
        this.user = user}
      }
    });
  }
  ngOnInit(): void {
  this.initializeUploader();
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo){

    this.friendsService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.friend){
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.friend.photoUrl = photo.url;
          this.friend.photos.forEach(p=>{
            if (p.isMain) p.isMain = false;
            if (p.id == photo.id) p.isMain = true;
          })
        }
      }
    })
  }
  
  deletePhoto(photoId: number){
  this.friendsService.deletePhoto(photoId).subscribe({
    next: () => {
      if (this.friend)
      {
        this.friend.photos = this.friend.photos.filter(z => z.id != photoId);
      }
    }
  })
  
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType:['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 

    });

    this.uploader.onAfterAddingFile = (file)=> {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response)
      {
        const photo = JSON.parse(response);

        this.friend?.photos.push(photo);

        if (photo.isMain && this.user && this.friend)        {
          this.user.photoUrl = photo.url;
          this.friend.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);

        }
      }
    }
  }

}
