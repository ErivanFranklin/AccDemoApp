import {Component, OnInit} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddPostDialogComponent} from "../add-post-dialog/add-post-dialog.component";
import {Subscription} from "rxjs";
import {NotificationService} from "../services/notification.service";
import {NotificationType} from "../enum/notification-type";

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
  activeInk: number = 0;
  loading: boolean = true;
  private subscriptions: Subscription[] = [];

  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  constructor(private userService: UserService, private router: Router, private dialog: MatDialog, private notificationService: NotificationService) {
  }

  ngOnInit(): void {

    // It checks if the user is logged in first, otherwise go to the login page
    if (this.userService.isLoggedIn()) {

      if (this.loading) {

        // Retrieve info from localstorage
        this.user = JSON.parse(<string>localStorage.getItem('user'))[0];
        this.users = JSON.parse(<string>localStorage.getItem('users'));
        this.usersPosts = JSON.parse(<string>localStorage.getItem('usersPosts'));

        // Call api in case users posts are not on storage
        if (!this.usersPosts) {
          this.subscriptions.push(
            this.userService.getUsersPosts().subscribe((response) => {

              this.usersPosts = response;
              this.userService.setUsersPostsLocalStorage(response);
              return response;
            })
          )
        }

        // Users data to make username on card
        if (!this.users) {
          this.subscriptions.push(
            this.userService.getUsers().subscribe((response) => {

              this.users = response;
              this.userService.setUserLocalStorage(response);
              return response;
            })
          );
        }
      }
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  tabClicked(index: number) {
    this.activeInk = index
  }

  addPostDialog() {

    // Create post dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {userId: this.user.id, id: this.usersPosts[this.usersPosts.length - 1].id + 1}
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = "post-dialog";

    const dialogRef = this.dialog.open(AddPostDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(post => {

      //Check if there is a post valid otherwise do nothing
      if (post) {
        this.subscriptions.push(
          this.userService.saveUserPostToLocalStorage(post).subscribe(posts => {
            this.usersPosts = posts;
            this.notificationService.notify(NotificationType.SUCCESS, "New post was created");
          })
        );
      }
    });
  }

  getUserName(userId: number) {
    return this.users.find((user: { id: number; }) => user.id == userId).username;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
