import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonService} from '../../utils/common.service';
import {EditCommentsReceivedService} from './edit-comments-received.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-edit-comments-received',
  templateUrl: './edit-comments-received.component.html',
  styleUrls: ['./edit-comments-received.component.css']
})
export class EditCommentsReceivedComponent implements OnInit {
  assignToModel:any=null;
  statusModel:any=null;
  formGroup: FormGroup;
  commentId:any;
  wsPocId: any;
  boardId:any;
  commentStatus:any;
  actionStatus:any;
  data:any;
  developers = [];
  header: any;
  micrositeId: any;
  roleId:any;
  assignToId:any;
  constructor(private actRoute: ActivatedRoute,private workspace: EditCommentsReceivedService,private commonService:CommonService,private dialog: DynamicDialogRef,public config: DynamicDialogConfig,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.micrositeId = localStorage.getItem('micrositeId');
    this.data = this.config.data;
    this.commentStatus =this.data.commentStatus;
    this.commentId =this.data.id;
    this.actionStatus =this.data.actionStatus;   
    this.roleId =this.commonService.getuserRoleCode();
    this.assignToId =this.data.assignToId;
    const token = localStorage.getItem('tempCurrentUserToken');
    this.header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    this.wsPocId=this.data.wsPocId;
    this.boardId=this.data.boardId;
    this.assignToModel =this.assignToId;

    console.log(this.data,">>>>>>>>>>>this.data")
    this.initForm();
    setTimeout(() => {
      this.getDeveloperCombo();
      });
  }
  initForm(){
    const bol = this.commonService.getRole() =='idea-owner'  && this.actionStatus =='Pending';
    this.formGroup = this.formBuilder.group({
      reviewer: [{value:this.data.enteredByName,disabled: true}, Validators.required],
      comments: [{value:this.data.reviewComment,disabled: true}, Validators.required],
      rejectionRemarks: [],
      assignTo: ['', Validators.required],
      status: ['', Validators.required]
    });
  }
  Close() {
    this.dialog.close()
  }
  getDeveloperCombo(){
    const req_data = {
      'micrositeId': this.micrositeId,
      'workspaceId': this.wsPocId
    }   

    this.workspace.getDeveloperCombo(req_data, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == 'SUCCESS') {
            this.developers = data.result_data;
            return;
          }
        },
        error => {
        });
  }
  accept()
  {
    if (this.assignToModel == null)
    {
      this.commonService.failureMessage("Select AssignTo");
      return;
    }
    const reqdata = {
      "id": this.commentId,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId), 
      "workspaceDtlId": parseInt(this.boardId),
      "actionStatus":"Accepted",
      "assignToId":this.assignToModel
    }
    this.workspace.accept(reqdata,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);
            this.Close();
          }
          else
          {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });

  }
  reject()
  {
    const formValues = this.formGroup.getRawValue();
    if(!formValues.rejectionRemarks) {
      this.commonService.failureMessage('Kindly enter rejection reason');
      return;
    }
    const reqdata = {
      "id": this.commentId,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId), 
      "workspaceDtlId": parseInt(this.boardId),
      "actionStatus":"Rejected",
      'rejectionRemarks': formValues.rejectionRemarks
    }
    this.workspace.accept(reqdata,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);
            this.Close();
          }
          else
          {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });
  }
  Inprogress()
  {
     
      this.assignToModel =this.assignToId;

      const reqdata = {
      "id": this.commentId,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId), 
      "workspaceDtlId": parseInt(this.boardId),
      "commentStatus":"In-Progress",
      "assignToId":this.assignToModel,
      "userRoleCode":this.roleId
    }
    console.log(reqdata,">>>>>>>>>>>>>>>>reqdata");
    //return;
    this.workspace.save(reqdata,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);
            this.Close();
          }
          else
          {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });

  }
  Closed()
  {
    this.assignToModel =this.assignToId;
    const reqdata = {
    "id": this.commentId,
    "micrositeId": parseInt(this.micrositeId),
    "workspaceId": parseInt(this.wsPocId), 
    "workspaceDtlId": parseInt(this.boardId),
    "commentStatus":"Closed",
    "assignToId":this.assignToModel,
    "userRoleCode":this.roleId
  }
  console.log(reqdata,">>>>>>>>>>>>>>>>reqdata");
  //return;
  this.workspace.save(reqdata,this.header)
    .pipe(first())
    .subscribe(
      (data: any) => {
        if (data.result_status.toUpperCase() === 'SUCCESS') {
          this.commonService.successMessage(data.result_msg);
          this.Close();
        }
        else
        {
          this.commonService.failureMessage(data.result_msg);
        }
      },
      error => {
      });
  }
  Completed()
  {
    this.assignToModel =this.assignToId;
      const reqdata = {
      "id": this.commentId,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId), 
      "workspaceDtlId": parseInt(this.boardId),
      "commentStatus":"Completed",
      "assignToId":this.assignToModel,
      "userRoleCode":this.roleId
    }
    console.log(reqdata,">>>>>>>>>>>>>>>>reqdata");
    //return;
    this.workspace.save(reqdata,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);
            this.Close();
          }
          else
          {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });
  }
}
