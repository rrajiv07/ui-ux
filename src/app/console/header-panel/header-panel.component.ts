import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CommonService} from '../../utils/common.service';
import {EnvironmentService} from '../../../environments/environment.service';
@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.css']
})
export class HeaderPanelComponent implements OnInit {
  userName:any;
  initialLetter:any;
  constructor(private commonService:CommonService,private route: Router,
    private environmentService:EnvironmentService) { 
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
}
