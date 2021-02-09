import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { SignUpSetUpAccountComponent } from '../sign-up-set-up-account/sign-up-set-up-account.component';
import { SignUpEmailService } from './sign-up-email.service';
import { CommonService } from '../../utils/common.service';

@Component({
  selector: 'app-sign-up-email',
  templateUrl: './sign-up-email.component.html',
  styleUrls: ['./sign-up-email.component.css']
})
export class SignUpEmailComponent implements OnInit {
  signupDialogPtr: DynamicDialogRef;
  signupForm: FormGroup;
  submitted: boolean = false;
  isSignUpError: boolean = false;
  constructor(public dialog: DynamicDialogRef, private dialogService: DialogService,
    private formBuilder: FormBuilder, private service: SignUpEmailService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.initForm();
  }
  // Form Initialize
  initForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    });
  }
  get f1() { return this.signupForm.controls; }
  Close() {
    this.dialog.close()
  }
  signup() {
    this.submitted = true;
    this.isSignUpError = false;
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }
    this.checkEmail();

  }
  checkEmail() {
    var emailId = this.signupForm.get("email").value;
    let queryParams = "emailId=" + emailId;

    this.service.checkEmail(queryParams).then(
      data => {
        if (data.result_status.toUpperCase() === 'SUCCESS') {
          this.Close();
          var emailId = this.signupForm.get("email").value;
          var objPubSub = { "email": emailId };

          this.signupDialogPtr = this.dialogService.open(SignUpSetUpAccountComponent, {
            //header: 'Setup your account',
            showHeader: false,
            closable: false,
            width: '50%',
            data: objPubSub,
            contentStyle: { "max-height": "30%", "overflow": "auto", "padding": "0 1.1rem 0rem 1.5rem", "border-radius": "10px" },
          });
        }
        else {
          this.commonService.failureMessage(data['result_msg']);
        }

      },
      error => {
      });
  }
}
