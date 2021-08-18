import { Component, OnInit } from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddPostDialogComponent} from "../add-post-dialog/add-post-dialog.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  background: ThemePalette = undefined;

  user: any;
  users: any;
  usersPosts: any;
  activeInk:number = 0;
  loading: boolean = true;

  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  constructor(private userService: UserService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {

    // check if the user is on localstorage
    if (this.userService.isLoggedIn()){

      if (this.loading){

        // Retrieve info from localstorage
        this.user = JSON.parse(<string>localStorage.getItem('user'))[0];
        this.users = JSON.parse(<string>localStorage.getItem('users'));
        this.usersPosts = JSON.parse(<string>localStorage.getItem('usersPosts'));

        // Call api in case users posts are not on storage
        if (!this.usersPosts){
          this.userService.getUsersPosts().subscribe((response) => {

            this.usersPosts = response;
            this.userService.setUsersPostsLocalStorage(response);
            return response;
          })
        }

        if (!this.users){
          this.userService.getUsers().subscribe((response) => {

            this.users = response;
            this.userService.setUserLocalStorage(response);
            return response;
          });
        }
      }
    }else{
      this.router.navigateByUrl("/login");
    }
  }

  tabClicked(index: number){
    this.activeInk = index
  }

  addPostDialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {userId: this.user.id, id: this.usersPosts[this.usersPosts.length -1].id + 1}
    dialogConfig.disableClose = true;
    dialogConfig.panelClass  = "post-dialog";

    const dialogRef = this.dialog.open(AddPostDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(post => {
      if (post){
        this.userService.saveUserPostToLocalStorage(post).subscribe(posts => {
          this.usersPosts = posts;
        });
      }
    });
  }

  getUserName(userId: number) {
    return this.users.find((user: { id: number; }) => user.id == userId).username;
  }
}
