import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Friend } from '../_models/friend';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  baseUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  getFriends(){
    // return this.http.get<Friend[]>(this.baseUrl + 'users', this.getHttpOptions())
    return this.http.get<Friend[]>(this.baseUrl + 'users')
  }

  getFriend(userName: string){
    return this.http.get<Friend>(this.baseUrl + 'users/' + userName)
    // return this.http.get<Friend>(this.baseUrl + 'users/' + userName, this.getHttpOptions())
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
