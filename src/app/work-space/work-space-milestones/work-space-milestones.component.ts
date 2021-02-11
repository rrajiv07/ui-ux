import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { WorkSpaceMilestonesService } from './work-space-milestones.service';
import { CommonService } from '../../utils/common.service';

@Component({
  selector: 'app-work-space-milestones',
  templateUrl: './work-space-milestones.component.html',
  styleUrls: ['./work-space-milestones.component.css']
})
export class WorkSpaceMilestonesComponent implements OnInit {
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };
  milestoneStatus:any=null;
  workSpaceBoardRouterLink =
    {
      "Initial Requirement": "initial-requirment",
      "Process Flow": "process-flow",
      "Application Flow": "information-architecture",
      "Wireframe": "wireframe",
      "Prototype": "prototype",
      "POC Review": "poc-review",
      "Development Documents": "development-document",
      "Publish POC": "publish-poc"
    };
  wsPocId: string;
  micrositeId: string;
  milestoneDtl: any;
  phaseId: any;
  wsPocName: any;
  workspaceDtlId: any;
  constructor(private workspace: WorkSpaceMilestonesService,
    private actRoute: ActivatedRoute,
    private route: Router,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.getParams();
    this.getMilestones();
  }
  getMilestones() {
    const param = { micrositeId: this.micrositeId, workspaceId: this.wsPocId };
    this.workspace.getMilestones(param, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS' && data.result_data != null) {
            this.milestoneDtl = data.result_data;
            return;
          }
        },
        error => {
        });
  }
  getParams() {
    this.actRoute.parent.paramMap
      .subscribe(params => {
        this.wsPocId = params['params'].subNav;
        this.wsPocName = params['params'].wsPocName;
      });
    this.micrositeId = JSON.parse(localStorage.getItem('micrositeId'));
  }
  onChangePlanStartDate(event, record) {
    delete record.plannedStartDate;
    record["plannedStartDate"] = event.target.value;
  }
  onChangePlanEndDate(event, record) {
    delete record.plannedEndDate;
    record["plannedEndDate"] = event.target.value;
  }
  viewDetails(record) {
    this.phaseId = record.phaseId;
    this.workspaceDtlId = record.workspaceDtlId;
    this.route.navigateByUrl('/workspace/view/' + this.wsPocId + '/' + this.wsPocName + '/' + this.workspaceDtlId + '/phase/' + this.workSpaceBoardRouterLink[record.custPhaseName]);
  }
  
  complete(record) {

    if (record.plannedStartDate == null || record.plannedStartDate == "") {
      this.commonService.failureMessage("Enter planned start date.");
      return;
    }
    if (record.plannedEndDate == null || record.plannedEndDate == "") {
      this.commonService.failureMessage("Enter planned end date.");
      return;
    }
    if (record["status"] ==null || record["status"]  =="")
    {
      this.commonService.failureMessage("Select status.");
      return;
    }
    record["statusCode"]=record["status"];
    this.workspace.complete(record, this.header).pipe(first())
      .subscribe(
        (data: any) => {
          if (data['result_status'].toUpperCase() == "SUCCESS") {
            this.getMilestones();
            this.commonService.successMessage(data['result_msg']);
            return
          }
          this.commonService.failureMessage(data.result_msg);
        },
        error => {
        });
  }
  onChangeMilestoneStatus(record,event){
    record["status"]=event.target.value;
    this.milestoneStatus = event.target.value;
  }
}
