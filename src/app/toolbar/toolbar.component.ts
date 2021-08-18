import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  userName: string | undefined;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.userName = JSON.parse(<string>localStorage.getItem("user"))[0].username;
  }

  logout() {
    this.userService.logOut();
    this.router.navigateByUrl("/login");
  }
}
