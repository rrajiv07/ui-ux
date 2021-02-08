import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})

export class WorkSpaceSummaryService {
  // token = localStorage.getItem('tempCurrentUserToken');
  // header = {
  //   headers: new HttpHeaders()
  //     .set('Authorization', `Bearer ${this.token}`)
  // };
  constructor(private http: HttpClient, private ngxService: NgxUiLoaderService,
    private appService: AppConfigService) { }

  getTeamDtl(id: any, header) {
    this.ngxService.start();
    return this.http.get<any>(`${this.appService.apiURL}workspace/team/users?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  

  getPOCDtl(id: any, header: any) {
    this.ngxService.start();
    return this.http.get<any>(`${this.appService.apiURL}microsite/workspace/?micrositeId=${id.micrositeId}&workspaceId=${id.pocId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  getDashboard(id: any, header: any) {
    this.ngxService.start();
    return this.http.get<any>(`${this.appService.apiURL}workspace/summary/review/counts?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  getMilestones(id: any, header) {
    this.ngxService.start();
    return this.http.get<any>(`${this.appService.apiURL}workspace/milestones?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  closePOC(params, header: any) {
    this.ngxService.start();
    return this.http.put<any>(`${this.appService.apiURL}microsite/workspace/close`, params, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
}
