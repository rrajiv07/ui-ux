import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {CommonService} from '../../utils/common.service';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WorkSpacePocReviewService {
  role_id =this.commonService.getReviewerId();
  constructor(private http: HttpClient,
    private ngxService: NgxUiLoaderService,
    private commonService:CommonService,
    private appService: AppConfigService) {}

    getReviewer(id: any, header: any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}workspace/mapped/reviewers?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}`, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    getReviewComments(id: any, header: any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}workspace/review/all/comments?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}`, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    getDashboard(id: any, header: any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}phase/review/counts?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}`, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }

}
