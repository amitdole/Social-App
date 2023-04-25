import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Friend } from '../_models/friend';
import {map, of} from 'rxjs';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  baseUrl = environment.apiUrl

  friends: Friend[] = [];
  paginatedResult: PaginatedResult<Friend[]> = new PaginatedResult<Friend[]>;

  constructor(private http:HttpClient) { }

  getFriends(page?: number, itemsPerPage?: number){

    let params = new HttpParams();

    if (page && itemsPerPage){
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    // if (this.friends.length > 0){
    //   return of(this.friends);
    // }
    // return this.http.get<Friend[]>(this.baseUrl + 'users', this.getHttpOptions())
    return this.http.get<Friend[]>(this.baseUrl + 'users', {observe: "response", params}).pipe(
      // map((friends: Friend[]) => {
      //   this.friends = friends;
      //   return friends;
      // })

      map(response => {
        if (response.body){
          this.paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');

        if (pagination){
          this.paginatedResult.pagination = JSON.parse(pagination);
        }

        return this.paginatedResult;
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

  setMainPhoto(photoId: number){

    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId,{});

  }

  deletePhoto(photoId: number){
  return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
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
