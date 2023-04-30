import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Friend } from '../_models/friend';
import {map, of, take} from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userparams';
import { AccountService } from './account.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  baseUrl = environment.apiUrl

  friends: Friend[] = [];
  friendCache = new Map();
  userParams: UserParams| undefined;
  user: User| undefined;
 
  constructor(private http:HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user)
        {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })
   }

  getUserParams()
  {
    return this.userParams;
  } 

  setUserParams(params: UserParams)
  {
      this.userParams = params;
  } 

  resetUserParams()
  {
    if (this.user){
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  } 

  getFriends(userParams: UserParams){

    const response = this.friendCache.get(Object.values(userParams).join('-'));

    if (response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber,userParams.pageSize);
    
    params = params.append('minAge',userParams.minAge);
    params = params.append('maxAge',userParams.maxAge);
    params = params.append('gender',userParams.gender);
    params = params.append('orderBy',userParams.orderBy);
    
    return this.getPaginatedResults<Friend[]>(this.baseUrl + 'users',params).pipe(
      map(response => {
        this.friendCache.set(Object.values(userParams).join('-'),response);
        return response;
      })
    )
  }

  getFriend(userName: string){
    const friend = [...this.friendCache.values()]
    .reduce((arr, elem) => arr.concat(elem.result),[])
    .find((friend: Friend) => friend.userName === userName);

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

  addLike(username: string){
    return this.http.post(this.baseUrl + 'likes/' + username,{});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number){
    let params = this.getPaginationHeaders(pageNumber,pageSize);
    
    params = params.append('predicate', predicate);

    return this.getPaginatedResults<Friend[]>(this.baseUrl + 'likes', params);  
  }

  private getPaginatedResults<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;

    return this.http.get<T>(url, { observe: "response", params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');

        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }

        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return params;
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
