import {Injectable} from '@angular/core';
import {Observable, Observer} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "../model/User";
import {UserPost} from "../model/UserPost";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  logIn(user: User): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/users?email=` + user.email);
  }

  getUsersPosts(): Observable<any> {
    return this.http.get<any>(`${this.host}/posts?`);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.host}/users?`);
  }

  setUserInfoLocalStorage(user: User[]) {
    localStorage.setItem("user", JSON.stringify(user))
  }

  setUsersPostsLocalStorage(users: any) {
    localStorage.setItem('usersPosts', JSON.stringify(users));
  }

  setUserLocalStorage(users: any) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUsersPostsFromLocalStorage() {
    return JSON.parse(<string>localStorage.getItem('usersPosts'));
  }

  removeUsersPostFromLocalStorage() {
    localStorage.removeItem("usersPosts");
  }

  removeUserFromLocalStorage() {
    localStorage.removeItem("user");
  }

  saveUserPostToLocalStorage(post: UserPost): Observable<UserPost> {

    return new Observable((observer: Observer<UserPost>) => {
      let posts = this.getUsersPostsFromLocalStorage();
      this.removeUsersPostFromLocalStorage();
      posts.unshift(post);
      this.setUsersPostsLocalStorage(posts);
      observer.next(posts);
    });
  }

  isLoggedIn() {

    let user = localStorage.getItem("user");
    if (user) {
      return true
    }

    return false;
  }

  logOut() {
    this.removeUserFromLocalStorage();
  }
}
