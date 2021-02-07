import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { SubcriptionService } from '../subcription.service';
import { first } from 'rxjs/operators';
import { threadId } from 'worker_threads';
import { CommonService } from '@app/utils/common.service';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-expand-your-team',
  templateUrl: './expand-your-team.component.html',
  styleUrls: ['./expand-your-team.component.css']
})
export class ExpandYourTeamComponent implements OnInit {
  emailId: any;
  username: any;
  form: FormGroup;
  submitted: boolean = false;
  micrositeId = localStorage.getItem('micrositeId');
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };

  constructor(public dialog: DynamicDialogRef,
    private service: SubcriptionService,
    private common: CommonService,
    private formBuilder: FormBuilder) { }


  Close() {
    this.dialog.close()
  }
  get f1() { return this.form.controls; }
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
    const form = this.form.getRawValue();
    const reqdata = {
      "emailIds": emailIdArray_data,
      "mailSent": true,
      "micrositeId": this.micrositeId
    }
    this.service.inviteMember(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          // if (data.result_data && Object.keys(data.result_data).length !== 0) {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.common.successMessage(data.result_msg);
            this.Close();
            return;
          }
          this.common.failureMessage(data.result_msg);
        },
        error => {
        });
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
			emailId: ['', [Validators.required]]
		})
  }
  get emailIds(): FormArray {
		return this.form.get('emailIds') as FormArray;
  }
  addMember() {
		let fg = this.createTeamFormGroup();
		this.emailIds.push(fg);
	}
  ngOnInit(): void {
    this.init();
  }
}
