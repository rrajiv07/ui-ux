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
export class WorkSpaceInformationArchitectureService {
  role_id =this.commonService.getReviewerId();
    constructor(private http: HttpClient,
    private ngxService: NgxUiLoaderService,
    private commonService:CommonService,
    private appService: AppConfigService) {}
  onUpload(value: any,header:any) {
    this.ngxService.start();
      return this.http.post<any>(`${this.appService.apiURL}poc/doc/upload`, value,header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    onDownloadFile(params: any,header:any) {
      this.ngxService.start();
      let uri;
      uri = `${this.appService.apiURL}workspace/doc/download/attachment`;
      return this.http.get(uri, { headers: header.headers, params: params, responseType: 'blob' })
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    getAllUploadedFile(id: any,header:any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}workspace/docs/details?micrositeId=${id.micrositeId}&workspaceId=${id.pocId}&workspaceDtlId=${id.pocBoardMapId}`, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    getReviewerCombo(id: any, header: any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}workspace/team/user-byrole?workspaceId=${id.workspaceId}&micrositeId=${id.micrositeId}&roleId=${this.role_id}`, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    getAllRoleId(header:any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}roles`, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }));
    }
    submitReviewer(value: any, header: any) {
      this.ngxService.start();
      return this.http.post<any>(`${this.appService.apiURL}phase/reviewer/mapping`, value, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    getAssignedReviewer(id: any, header: any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}phase/mapped/reviewers?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}&workspaceDtlId=${id.workspaceDtlId}`, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    getAllStatus(header:any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}status`,header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    getAllReviewComments(id: any, header: any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}workspace/review/comments?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}&workspaceDtlId=${id.workspaceDtlId}`, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    saveComments(value: any,header:any) {
      this.ngxService.start();
      return this.http.post<any>(`${this.appService.apiURL}workspace/review/comment`, value,header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
}
