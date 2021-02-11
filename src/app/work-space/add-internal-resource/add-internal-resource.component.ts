import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { WorkSpaceTeamService } from '../work-space-team/work-space-team.service';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/utils/common.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-internal-resource',
  templateUrl: './add-internal-resource.component.html',
  styleUrls: ['./add-internal-resource.component.css']
})
export class AddInternalResourceComponent implements OnInit {
  roleModel: any = null;
  nameModel: any = null;
  resourcesList = [];
  submitted: boolean = false;
  form: FormGroup;
  selectedResource: object;
  boardId: any;
  wsPocId: any;
  roles = [];
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };
  micrositeId = JSON.parse(localStorage.getItem('micrositeId'));
  
  constructor(public dialog: DynamicDialogRef,
    private workspace: WorkSpaceTeamService,
    private actRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: CommonService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.init();
    setTimeout(() => {
      this.getRoles();
      this.getTeamList();
      });
    
  }
  get f1() { return this.form.controls; }
  getRoles() {
    this.workspace.getAllRole(this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == 'SUCCESS') {
            this.roles = data.result_data;
            return;
          }
        },
        error => {
        });
  }

  init() {
    this.boardId = this.config.data.boardId;
    this.wsPocId = this.config.data.wsPocId;
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      email: [''],
    });
  }

  Close() {
    this.dialog.close()
  }

  onChangeRes(event) {
    const value = event.target.value;
    this.selectedResource = this.resourcesList.find(elem => (elem.id == value));
    this.form.patchValue({ email: this.selectedResource['email'] });
  }

  onSave() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
     return;
    }
    const form = this.form.getRawValue();
    const role = this.roles.find(elem => elem.id == form.role)
    const reqData = {
      "micrositeId": this.micrositeId,
      "workspaceId": this.wsPocId,
      "userId": this.selectedResource['userId'],
      "roleId": role['id'],
      "usertype": "Internal"
    }
    this.workspace.onMapPocWithResource(reqData, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == 'SUCCESS') {
            this.service.successMessage(data.result_msg);
            this.Close();
            return;
          }
          this.service.failureMessage(data.result_msg);
        },
        error => {
        });
  }

  getTeamList() {
    this.workspace.getAllResources(this.micrositeId, this.wsPocId,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == 'SUCCESS') {
            this.resourcesList = data.result_data;
            return;
          }
        },
        error => {
        });
  }
}
