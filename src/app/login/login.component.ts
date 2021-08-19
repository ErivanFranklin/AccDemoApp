import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {User} from "../model/User";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NotificationService} from "../services/notification.service";
import {NotificationType} from "../enum/notification-type";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  private errorMessage: string | undefined;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private userService: UserService, private router: Router, private notificationService:NotificationService) { }

  ngOnInit(): void {

    // It checks if the user is logged in otherwise go to the login page
    if(this.userService.isLoggedIn()){
      this.router.navigateByUrl("/user");
    }else{
      this.router.navigateByUrl("/login");
    }
  }

  get f(){
    return this.form.controls;
  }

  submit(user: User){
    if (this.form.valid){
      this.subscriptions.push(
        this.userService.logIn(user).subscribe((response) => {
          if (response.length){
            this.userService.setUserInfoLocalStorage(response);
            this.router.navigateByUrl("/user");
          }else{
            this.notificationService.notify(NotificationType.WARNING, "Email not found");
          }
        },(error) => {
          this.notificationService.notify(NotificationType.ERROR, "Something went wrong");
        })
      );
    }else{
      this.errorMessage = 'Username or password invalid';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
