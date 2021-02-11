import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { CommonService } from '../../utils/common.service';
import { PageRedirectService } from './page-redirect.service';
@Component({
  selector: 'app-page-redirect',
  templateUrl: './page-redirect.component.html',
  styleUrls: ['./page-redirect.component.css']
})
export class PageRedirectComponent implements OnInit {
  token:any;
  constructor(private commonService: CommonService, private service: PageRedirectService,
    private router: Router,private route: ActivatedRoute) { 
      this.route.queryParams.subscribe(params => {
        this.token = params['token'];        
    });
    }

  ngOnInit(): void {
    localStorage.setItem("alreadyLogin",null);
    localStorage.setItem('tempCurrentUserToken', this.token);
    this.getLoginDetails(this.token);
  }
  getLoginDetails(token: any) {
    const formData = {};
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    this.service.getLoggedInDetails(header)
      .pipe(first())
      .subscribe(
        data => {

          if (data['result_status'].toUpperCase() === 'SUCCESS') {
            if (data['result_data'].userTypeCdoe == 'Idea Owner' && data['result_data'] != null) {
              this.commonService.setIdeaOwner();
            }

            //localStorage.setItem('tempCurrentUser', JSON.stringify(data['result_data']));
            //localStorage.setItem('micrositeId',data['result_data'].micrositeId);
            this.getWorkSpace(token, JSON.stringify(data['result_data']), data['result_data'].micrositeId);
            // data.result_data
            return;
          }
          else {
            this.commonService.failureMessage(data['result_msg']);
            return;
          }
        },
        error => {
        });
  }
  getWorkSpace(token: any, tempCurrentUser: any, micrositeId: any) {
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    this.service.getWorkSpaceboards(header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          const len = data ? data.result_data.length : [];
          localStorage.setItem('tempCurrentUserToken', token);
          localStorage.setItem('tempCurrentUser', tempCurrentUser);
          localStorage.setItem('micrositeId', micrositeId);
          //len ? this.router.navigate(['/workspace/createworkspace']) : this.router.navigate(['/workspace/createworkspace'])
          len ? this.router.navigate(['/workspace']) : this.router.navigate(['/workspace'])
          /*
          const baseUrlFlag = this.appConfig.appConfig['flag'];
          if (baseUrlFlag == 'Y') {
            //window.location.href = "http://" + this.micrositeName + ".hivezen.com:9797/Hivezen/";
          }
          */

          return;
        },
        error => {
        });
  }

}
