import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { first } from 'rxjs/operators';
import { CommonService } from '../../utils/common.service';
import { HttpHeaders } from '@angular/common/http';
import { ForgotPasswordService } from '../forgot-password/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder,public dialog: DynamicDialogRef,
    private service: ForgotPasswordService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }
  get f1() { return this.form.controls; }
  forgotPassword() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    var reqdata ={};
    reqdata["email"] = this.form.get("email").value;
    this.service.forgotPassword(reqdata)
      .pipe(first())
      .subscribe(
        data => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
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
