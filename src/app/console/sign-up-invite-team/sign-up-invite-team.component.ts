import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { first } from 'rxjs/operators';
import { SignUpSucessComponent } from '../sign-up-sucess/sign-up-sucess.component';
import { SignUpInviteTeamService } from './sign-up-invite-team.service';
import { CommonService } from '../../utils/common.service';
import { AppConfigService } from '../../utils/app-config.service';
import { SubcriptionService } from '@app/subscription/subcription.service';
import { HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up-invite-team',
  templateUrl: './sign-up-invite-team.component.html',
  styles: []
})
export class SignUpInviteTeamComponent implements OnInit {
  signupDialogPtr: DynamicDialogRef;
  laterDialogPtr: DynamicDialogRef;
  micrositeName: any;
  micrositeId : any;
  token : any;
  header : any;
  form: FormGroup;
  submitted: boolean = false;
  totalMemberCnt:any=4;
  MemberCnt:any=1;
  constructor(private formBuilder: FormBuilder,private appConfig: AppConfigService, public dialog: DynamicDialogRef, private dialogService: DialogService, public config: DynamicDialogConfig,
    private signUpService: SignUpInviteTeamService, private commonService: CommonService, private service: SubcriptionService) { }

  ngOnInit(): void {
    
    this.micrositeId = this.config.data.micrositeId;
    this.token = this.config.data.token;
    this.header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${this.token}`)
    };
    this.micrositeName = this.config.data.micrositeName;
    
    this.init();
  }
  init() {
    this.form = this.formBuilder.group({
      emailIds: this.formBuilder.array(
				[this.createTeamFormGroup()],
				[Validators.required])
    });
  }
  createTeamFormGroup() {
		return this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
		})
  }
  get emailIds(): FormArray {
		return this.form.get('emailIds') as FormArray;
  }
  addMember() {
    if (this.MemberCnt <this.totalMemberCnt )
    {
		let fg = this.createTeamFormGroup();
    this.emailIds.push(fg);
    this.MemberCnt =this.MemberCnt +1;
    }
    else{
      this.commonService.failureMessage("Exceed total licence.");
      return;
    }
	}

   get invoiceparticularsArray(): FormArray{
	  return this.form.get('emailIds') as FormArray;
  }
  onDelete(index) {
    this.invoiceparticularsArray.removeAt(index);
  }
  
  Close() {
    this.dialog.close()
  }
  later() {
    setTimeout(() => { 
    this.dialog.close();
    },500);
    this.laterDialogPtr = this.dialogService.open(SignUpSucessComponent, {
      showHeader: false,
      closable: false,
      width: '56%',
      data:this.config.data,
      contentStyle: { "max-height": "30%", "overflow": "auto", "padding": "0 1.1rem 0rem 1.5rem", "border-radius": "20px" },
    });

  }

  onInvite() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    var emailIdArray=this.form.value.emailIds;
    var emailIdArray_data = [];
    emailIdArray.forEach(element => {
      emailIdArray_data.push(element.emailId)
    });
    const reqdata = {
      "emailIds": emailIdArray_data,
      "mailSent": true,
      "micrositeId": this.micrositeId
    }
    this.service.inviteMember(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            // this.commonService.successMessage(data.result_msg);
            this.Success();
            this.Close();
            return;
          }
          this.commonService.failureMessage(data.result_msg);
        },
        error => {
        });
  }

  Invite() {
    this.onInvite();
    
  }
  Success() {
    this.Close();
    this.signupDialogPtr = this.dialogService.open(SignUpSucessComponent, {
      showHeader: false,
      closable: false,
      width: '56%',
      data:this.config.data,
      contentStyle: { "max-height": "30%", "overflow": "auto", "padding": "0 1.1rem 0rem 1.5rem", "border-radius": "20px" },
    });
    /*
    const baseUrlFlag = this.appConfig.appConfig['flag'];
    if (baseUrlFlag == 'Y') {
      window.location.href = "http://" + this.micrositeName + ".hivezen.com:9797/Hivezen/";
    }
    */
  }
  successMessage(msg) {
    this.commonService.successMessage(msg);
  }
  failureMessage(msg) {
    this.commonService.failureMessage(msg);
  }
}