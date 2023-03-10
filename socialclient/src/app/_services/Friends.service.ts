import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Friend } from '../_models/friend';
import {map, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  baseUrl = environment.apiUrl

  friends: Friend[] = [];

  constructor(private http:HttpClient) { }

  getFriends(){
    if (this.friends.length > 0){
      return of(this.friends);
    }
    // return this.http.get<Friend[]>(this.baseUrl + 'users', this.getHttpOptions())
    return this.http.get<Friend[]>(this.baseUrl + 'users').pipe(
      map((friends: Friend[]) => {
        this.friends = friends;
        return friends;
      })
    )
  }

  getFriend(userName: string){
    const friend = this.friends.find(x=> x.userName = userName);
    if (friend)return of(friend);
      return this.http.get<Friend>(this.baseUrl + 'users/' + userName)
    // return this.http.get<Friend>(this.baseUrl + 'users/' + userName, this.getHttpOptions())
  }

  updateFriend(friend: Friend){
    return this.http.put(this.baseUrl + 'users',friend).pipe(
      map(() => {
        const index = this.friends.indexOf(friend);

        this.friends[index] = {...this.friends[index], ...friend}
      })
    )

  }

  // getHttpOptions(){
  //   const userString = localStorage.getItem('user');

  //   if (!userString) return;

  //   const user = JSON.parse(userString);

  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.token
  //     })
      
  //   }
  // }
}
