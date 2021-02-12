import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { WorkSpacePhaseService } from './work-space-phase.service';
import { CommonService } from '../../utils/common.service';

@Component({
  selector: 'app-work-space-phase',
  templateUrl: './work-space-phase.component.html',
  styleUrls: ['./work-space-phase.component.css']
})
export class WorkSpacePhaseComponent implements OnInit {
  collapseFlag:boolean=false;
  wsPocName: any;
  wsPocId: any;
  phaseId:any;
  workSpaceBoardNames = [];
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
  constructor(private commonService: CommonService, private route: Router, private actRoute: ActivatedRoute, private Service: WorkSpacePhaseService, private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.wsPocId = this.actRoute.snapshot.params.subNav;
    this.wsPocName = this.actRoute.snapshot.params.wsPocName;
    this.phaseId= this.actRoute.snapshot.params.boardId;
    this.getWorkspacePhase(localStorage.getItem('tempCurrentUserToken'), this.wsPocId);

  }
  getWorkspacePhase(token: any, wsPocId: any) {
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    this.Service.getWorkspacePhase(header, wsPocId)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.commonService.setRole(data.result_data.userRoleToWorkspace)
          this.workSpaceBoardNames = data.result_data['phaseList'];
          console.log(this.workSpaceBoardNames,"workSpaceBoardNames")
        },
        error => {
        });

  }
  phaseClick(boardId, boardCode) {
    this.phaseId =boardId;
    var subNav = this.actRoute.snapshot.params.subNav;
    var wsPocName = this.actRoute.snapshot.params.wsPocName;
    //localStorage.setItem('boardId',boardId);
    this.route.navigateByUrl('/workspace/view/' + subNav + '/' + wsPocName + '/' + boardId + '/phase/' + this.workSpaceBoardRouterLink[boardCode]);

  }
  ngAfterViewChecked() {

    this.cdref.detectChanges();
  }
  ShowPhase(BoardName) {
    var flag = true;
    var userRole =this.commonService.getRole();
    if (userRole == 'idea-owner') {
      flag = true;
    }
    else {
      if (BoardName == 'POC Review') {
        flag = false;
      }
      if (BoardName == 'Development Documents') {
        flag =true;
        
      }      
      if (BoardName == 'Publish POC') {
        flag = false; 
      }
      
    }
    return flag;


  }
  setCollapse(flag)
  {
    this.collapseFlag =false;
    if (flag == "true")
    {
      this.collapseFlag =true;
    }
  }
}
