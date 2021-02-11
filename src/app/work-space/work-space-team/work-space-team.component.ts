import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AddInternalResourceComponent } from '../add-internal-resource/add-internal-resource.component';
import { CommonService } from '../../utils/common.service';
import { EditInternalResourceComponent } from '../edit-internal-resource/edit-internal-resource.component';
import { first } from 'rxjs/operators';
import { WorkSpaceTeamService } from './work-space-team.service';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
@Component({
  selector: 'app-work-space-team',
  templateUrl: './work-space-team.component.html',
  styleUrls: ['./work-space-team.component.css']
})
export class WorkSpaceTeamComponent implements OnInit {
  resourceDialogPtr: DynamicDialogRef;
  editTeamDialogPtr: DynamicDialogRef;
  teamList = [];
  boardId: string;
  wsPocId: string;
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };
  micrositeId = JSON.parse(localStorage.getItem('micrositeId'));

  constructor(private dialogService: DialogService, private commonService: CommonService,
    private workspace: WorkSpaceTeamService,
    private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getParams();
    this.getTeamList();
    this.proto();
  }
  getParams() {
    this.micrositeId = localStorage.getItem('micrositeId');
    this.actRoute.parent.paramMap
      .subscribe(params => {
        this.boardId = params['params'].boardId;
        this.wsPocId = params['params'].subNav
      });
  }

  getTeamList() {
    const reqdata = {
      "micrositeId": this.micrositeId,
      "poc": this.wsPocId
    }
    this.workspace.getTeamDTL(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS") {
            this.teamList = data.result_data;
            return;
          }
        },
        error => {
        });
  }

  proto() {
    // this.teamList=[
    //   { "Resource":"James", "Email": "james@123.com","Type": "Internal", "Role": "Developer", "Status": "Active" },
    //   { "Resource":"John", "Email": "john@123.com","Type": "Internal", "Role": "Reviewer", "Status": "Active" },
    //   { "Resource":"Robert", "Email": "robert@123.com","Type": "Internal", "Role": "Developer", "Status": "Active" },
    //   { "Resource":"Michael", "Email": "michael@123.com","Type": "Internal", "Role": "Reviewer", "Status": "Inactive" }
    // ]
  }
  addResource() {
    this.resourceDialogPtr = this.dialogService.open(AddInternalResourceComponent, {
      //header: 'Setup your account',
      showHeader: false,
      closable: false,
      width: '30%',
      data: { boardId: this.boardId, 'wsPocId': this.wsPocId },
      contentStyle: { "max-height": "30%", "overflow": "auto", "padding": "0 1.1rem 0rem 1.5rem", "border-radius": "10px" },
    });
    this.resourceDialogPtr.onClose.subscribe(events => {
      this.getTeamList();
    });
  }
  editTeam(item) {
    this.editTeamDialogPtr = this.dialogService.open(EditInternalResourceComponent, {
      //header: 'Setup your account',
      showHeader: false,
      closable: false,
      width: '35%',
      data: item,
      contentStyle: { "max-height": "30%", "overflow": "auto", "padding": "0 1.1rem 0rem 1.5rem", "border-radius": "10px" },
    });
    this.editTeamDialogPtr.onClose.subscribe(events => {
      this.getTeamList();
    });
  }
  changeTeamStatus(record, status) {
    swal.fire({
      showCancelButton: true,
      title: 'Are you sure want to change status?',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.statusChange(record, status);
      } else if (result.dismiss === swal.DismissReason.cancel) {
        return;
      }
    })
    return;

  }
  statusChange(record, status) {
    const param = {
      "micrositeId": this.micrositeId,
      "workspaceId": this.wsPocId,
      "userId": record.userId,
      "statusCode": status
    };
    this.workspace.changeTeamStatus(param, this.header).pipe(first())
      .subscribe(
        (data: any) => {
          if (data['result_status'].toUpperCase() == "SUCCESS") {
            this.getTeamList();
            this.commonService.successMessage(data['result_msg']);
            return
          }
          this.commonService.failureMessage(data.result_msg);
        },
        error => {
        });
  }
}
