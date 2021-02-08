import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CommonService} from '../../utils/common.service';
import {EnvironmentService} from '../../../environments/environment.service';
import {ChangePasswordComponent} from '../change-password/change-password.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.css']
})
export class HeaderPanelComponent implements OnInit {
  userName:any;
  initialLetter:any;
  dialogPtr:DynamicDialogRef;
  constructor(private commonService:CommonService,private route: Router,
    private environmentService:EnvironmentService,
    private dialogService: DialogService) { 
      this.initialLetter =this.commonService.getUserName().charAt(0).toUpperCase();
      this.userName =this.commonService.getUserName();
    } 

  ngOnInit(): void {
    
  }
  logout()
  {
    location.href="";
  }
  subscription()
  {
    this.environmentService.setPOCId('null');
    this.route.navigateByUrl('/subscription/manage-subscription');
  }
  changePassword(){
    this.dialogPtr = this.dialogService.open(ChangePasswordComponent, {
      //header: 'Setup your account',
      showHeader:false,
      closable:false,
      width: '59%',
      contentStyle: { "max-height": "30%", "overflow": "auto","padding":"0 1.1rem 0rem 1.5rem","border-radius":"10px"},
    });
  }
}
