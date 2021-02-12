import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {EnvironmentService} from 'src/environments/environment.service';
import {WorkSpaceSubNavService} from './work-space-sub-nav.service';
import {CommonService} from '../../utils/common.service';

@Component({
  selector: 'app-work-space-sub-nav',
  templateUrl: './work-space-sub-nav.component.html',
  styleUrls: ['./work-space-sub-nav.component.css']
})
export class WorkSpaceSubNavComponent implements OnInit {
  subNav: any;
  wsPocName: any;
  boardId:any;
  boardName:any;
  SubMenuVar: any = "summary";
  workSpaceBoardRouterLink=
  {
    "Initial Requirement":"initial-requirment",
    "Process Flow":"process-flow",
    "Application Flow":"information-architecture",
    "Wireframe":"wireframe",
    "Prototype":"prototype",
    "POC Review":"poc-review",
    "Development Documents":"development-document",
    "Publish POC":"publish-poc"
 };
  constructor(private actRoute: ActivatedRoute, private cdref: ChangeDetectorRef,private route: Router,
    private environmentService:EnvironmentService,private service:WorkSpaceSubNavService,
    private commonService:CommonService) { }

  ngOnInit(): void {
    this.subNav = this.actRoute.snapshot.params.subNav;
    this.wsPocName = this.actRoute.snapshot.params.wsPocName;
    this.environmentService.setPOCId(this.subNav);
    this.getDefaultWorkspacePhase(localStorage.getItem('tempCurrentUserToken'));
  }
  getDefaultWorkspacePhase(token: any) {
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    this.service.getDefaultWorkspacePhase(header,this.subNav)
        .pipe(first())
        .subscribe(
          (data: any) => {
            var defaultBoard =null;
            if (data.result_data != null && data.result_data.phaseList !=null && data.result_data.phaseList !=undefined)
            defaultBoard = data.result_data.phaseList[0];
            if ( data.result_data !=null && defaultBoard !=null && defaultBoard !=undefined)
            { 
              this.commonService.setRole(data.result_data.userRoleToWorkspace);
              this.boardName =defaultBoard.phaseCode;
              this.boardId  =defaultBoard.id;
            }

            /*
            if (data.result_data !=null &&  data.result_data['defaultBoard'] !=null && data.result_data['defaultBoard'] !=undefined)
            {
            this.boardName =data.result_data['defaultBoard'].name;
            this.boardId  =data.result_data['defaultBoard'].id;
            }
            */
          },
          error => {
          });
  }
  menuClick(SubMenu) {
    //this.SubMenuVar = SubMenu;
    //this.environmentService.setWSSubMenu(SubMenu);
    var pocId= this.actRoute.snapshot.params.subNav;
    this.subNav = this.actRoute.snapshot.params.subNav;
    this.wsPocName = this.actRoute.snapshot.params.wsPocName;

    /*
    var defaultBoards =JSON.parse(localStorage.getItem('defaultBoards'));
    var defaultBoardsObj = defaultBoards[pocId];
    this.boardId =(Object.values(defaultBoardsObj));
    this.boardName =(Object.keys(defaultBoardsObj));    
    */
    
    if (SubMenu == 'phase')
    {
    this.route.navigateByUrl('/workspace/view/' + this.subNav +'/' + this.wsPocName +'/' + this.boardId + '/phase/'+ this.workSpaceBoardRouterLink[this.boardName]);
    }
    else
    {
      this.route.navigateByUrl('/workspace/view/' + this.subNav +'/' + this.wsPocName + '/' + SubMenu);
    
    }

  }
  ngAfterViewChecked() {
    //console.log(this.actRoute.snapshot.params,"nav")    
    var routeURL=this.route.url;
    var routeURLSplit=routeURL.split("/");
    if ( routeURL.indexOf('phase') >0)
    {
      this.environmentService.setWSSubMenu('phase');
    }
    else
    {
      this.environmentService.setWSSubMenu(routeURLSplit[routeURLSplit.length - 1]);
    } 
    this.cdref.detectChanges();
  }
}
