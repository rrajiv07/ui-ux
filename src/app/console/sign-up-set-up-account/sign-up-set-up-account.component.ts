import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef , DialogService,DynamicDialogConfig} from 'primeng/dynamicdialog';
import {SignUpInviteTeamComponent} from '../sign-up-invite-team/sign-up-invite-team.component';
import {SignUpSetUpAccountService} from './sign-up-set-up-account.service';
import { first } from 'rxjs/operators';
import {CommonService} from '../../utils/common.service';
@Component({
  selector: 'app-sign-up-set-up-account',
  templateUrl: './sign-up-set-up-account.component.html',
  styleUrls: ['./sign-up-set-up-account.component.css']
})
export class SignUpSetUpAccountComponent implements OnInit {  
  signupDialogPtr: DynamicDialogRef;
  signupForm: FormGroup;
  submitted: boolean = false;
  isSignUpError: boolean = false;

  constructor(public dialog : DynamicDialogRef,private dialogService: DialogService,
    public config: DynamicDialogConfig,private formBuilder: FormBuilder,
    private service:SignUpSetUpAccountService,private commonService :CommonService) { }

  ngOnInit(): void {
    this.initForm();
  }
  // Form Initialize
  initForm() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      micrositeName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get f1() { return this.signupForm.controls; }
  Close()
  {
    this.dialog.close()
  }
  signup()
  {
    this.submitted = true;
    this.isSignUpError = false;
    
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }
    if(!(<HTMLInputElement>document.getElementById("chkTems")).checked)
    {
      this.commonService.failureMessage('You must agree to terms of service and privacy policy');
      return;
    }
    var reqdata = this.config.data;
    reqdata["fullName"]=this.signupForm.get("firstName").value;
    // reqdata["email"]="en";
    reqdata["userTypeCdoe"]="Idea Owner";
    reqdata["password"]=this.signupForm.get("password").value;
    reqdata["micrositeName"]=this.signupForm.get("micrositeName").value;
    this.service.signUp(reqdata)
    .pipe(first())
    .subscribe(
        data => {
            if (data.result_status.toUpperCase() === 'SUCCESS') {
                //this.commonService.successMessage(data['result_msg']);
                this.Success();
                return;
            }
            else{
              this.commonService.failureMessage(data['result_msg']);
              return;
            }
        },
        error => {
        });
    

    
  }
  Success()
  {
    this.Close();
    var objPubSub = {};
    objPubSub["micrositeName"]=this.signupForm.get("micrositeName").value;
    this.signupDialogPtr = this.dialogService.open(SignUpInviteTeamComponent, {
      showHeader:false,
      closable:false,
      width: '50%',
      data:objPubSub,
      contentStyle: { "max-height": "30%", "overflow": "auto","padding":"0 1.1rem 0rem 1.5rem","border-radius":"10px"},
    });
  }
  privacyPolicy()
  {
    window.open("assets/documents/privacy-policy.pdf", '_blank');
    /*
    this.privacyPolicyDialogPtr = this.dialogService.open(PrivacyPolicyComponent, {
      showHeader:false,
      closable:false,
      width: '50%',
      contentStyle: { "max-height": "30%", "overflow": "auto","padding":"0 1.1rem 0rem 1.5rem","border-radius":"10px"},
    });
    */
  }
  termsCondition()
  {
    window.open("assets/documents/terms-and-conditions.pdf", '_blank');
    /*
    this.privacyPolicyDialogPtr = this.dialogService.open(TermsConditionComponent, {
      showHeader:false,
      closable:false,
      width: '50%',
      contentStyle: { "max-height": "50%", "overflow": "auto","padding":"0 1.1rem 0rem 1.5rem","border-radius":"10px"},
    });
    */
  }
}