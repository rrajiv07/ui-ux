import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../utils/common.service';
import { WorkSpaceSummaryService } from './work-space-summary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { threadId } from 'worker_threads';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-work-space-summary',
  templateUrl: './work-space-summary.component.html',
  styleUrls: ['./work-space-summary.component.css']
})
export class WorkSpaceSummaryComponent implements OnInit {
  milestoneDtl:any;
  POCDetails: any=[];
  boardId: string;
  wsPocId: string;
  micrositeId: string;
  wsPocName:any;
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };
  teamDtl = [];
  totalCount:any=0;
  openCount:any=0;
  closedCount:any=0;
  topReviewerName:any;
  mostReviewedPhase:any;

  constructor(private actRoute: ActivatedRoute,
    private workSpaceSummary: WorkSpaceSummaryService,
    private commonService: CommonService,
    private route: Router) { }

  ngOnInit(): void {
    this.getParams();
    this.getPOCDTL();
    this.getTeamDtl();
    this.getDashboard();
    this.getMilestones();
  }

  getTeamDtl() {
    const param = { micrositeId: this.micrositeId, workspaceId: this.wsPocId };
    this.workSpaceSummary.getTeamDtl(param, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.teamDtl = data.result_data;
            return;
          }
          this.commonService.failureMessage(data['result_msg']);
        },
        error => {
        });
  }
  onClosePOC() {
  }

  onManagePOC() {
   this.route.navigateByUrl('/workspace/view/' + this.wsPocId + '/' + this.wsPocName + '/edit-workspace')
    //this.route.navigateByUrl('/workspace/view/' + this.wsPocId + '/' + this.POCDetails.pocName + '/4424/phase/information-architecture' );
  }

  getPOCDTL() {
    const param = { micrositeId: this.micrositeId, pocId: this.wsPocId };
    this.workSpaceSummary.getPOCDtl(param, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == 'SUCCESS') {
            if (data.result_data !=undefined)
            {
            this.commonService.setRole(data.result_data.userRoleToWorkspace);
            this.POCDetails = data.result_data;
            }
            return;
          }
          this.commonService.failureMessage(data['result_msg']);
        },
        error => {
        });
  }

  getParams() {
    this.actRoute.parent.paramMap
      .subscribe(params => {
        //console.log(params['params'],"Process-flow")
        this.boardId = params['params'].boardId;
        this.wsPocId = params['params'].subNav;
        this.wsPocName = params['params'].wsPocName;
      });
    this.micrositeId = JSON.parse(localStorage.getItem('micrositeId'));
  }
  getDashboard()
  {
    const reqdata = {
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId)
    }
    this.workSpaceSummary.getDashboard(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS" && data.result_data !=null) {
            //this.commentsReceived = data.result_data;

            this.totalCount =data.result_data.reviewTotalCount;
            this.openCount =data.result_data.reviewOpenCount;
            this.closedCount=data.result_data.reviewClosedCount;
            this.topReviewerName=data.result_data.topReviewerName;
            this.mostReviewedPhase=data.result_data.mostReviewedPhase;
            return;
          }
        },
        error => {
        });
  }
  getMilestones(){
    const param = { micrositeId: this.micrositeId, workspaceId: this.wsPocId };
    this.workSpaceSummary.getMilestones(param, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS' && data.result_data !=null) {
            this.milestoneDtl = data.result_data;
            return;
          }
        },
        error => {
        });
  }
}
