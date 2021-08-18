import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserPost} from "../model/UserPost";
import {UserService} from "../services/user.service";

interface DialogData{
  id: number,
  userId: number
}
@Component({
  selector: 'app-add-post-dialog',
  templateUrl: './add-post-dialog.component.html',
  styleUrls: ['./add-post-dialog.component.scss']
})
export class AddPostDialogComponent implements OnInit {

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required)
  })
  constructor(private userService: UserService, private dialogRefs: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {}

  submit(post: UserPost) {
    if (this.form.valid){
      post.id = this.data.id;
      post.userId = this.data.userId;
      this.dialogRefs.close(post);
    }else{
      console.log("form not valid");
    }
  }
}
