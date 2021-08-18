import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {User} from "../model/User";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private errorMessage: string | undefined;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {

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
      this.userService.logIn(user).subscribe((response) => {
        this.userService.setUserInfoLocalStorage(response);
        this.router.navigateByUrl("/user");
      },(error) => {
        console.log(error);
      });
    }else{
      this.errorMessage = 'Username or password invalid';
    }
  }
}
