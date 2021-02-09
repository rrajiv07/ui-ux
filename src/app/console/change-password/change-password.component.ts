import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { first } from 'rxjs/operators';
import { CommonService } from '../../utils/common.service';
import { HttpHeaders } from '@angular/common/http';
import { ChangePasswordService } from '../change-password/change-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  emailId:any;
  constructor(private formBuilder: FormBuilder,public dialog: DynamicDialogRef,
    private service: ChangePasswordService, private commonService: CommonService) {

      this.emailId=this.commonService.getEmail();
     }

  ngOnInit(): void {
    this.initForm();
    console.log(localStorage.getItem('tempCurrentUser'),">>>>>>>>>tempCurrentUser")
  }
  initForm() {
    this.form = this.formBuilder.group({
      email: [this.emailId, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      mailedPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }
  get f1() { return this.form.controls; }
  changePassword() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    var oldPassword =this.form.get("mailedPassword").value;
    var newPassword =this.form.get("newPassword").value;
    var confirmPassword =this.form.get("confirmPassword").value;

    if (newPassword != confirmPassword)
    {
      this.commonService.failureMessage("New password and confirm password does not match.");
      return;
    }
    var reqdata ={};
    reqdata["email"] = this.form.get("email").value;
    reqdata["mailedPassword"] = oldPassword;
    reqdata["newPassword"] = confirmPassword;
    const token = localStorage.getItem('tempCurrentUserToken');
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };


    this.service.changePassword(reqdata,header)
      .pipe(first())
      .subscribe(
        data => {
          if (data['result_status'].toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data['result_msg']);
            this.Close();
            return;
          }
          else {
            this.commonService.failureMessage(data['result_msg']);
            return;
          }
        },
        error => {
        });
  }
  Close() {
    this.dialog.close()
  }
}
