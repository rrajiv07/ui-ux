import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WorkSpaceTeamService {
  // token = localStorage.getItem('tempCurrentUserToken');
  // header = {
  //   headers: new HttpHeaders()
  //     .set('Authorization', `Bearer ${this.token}`)
  // };
  // micrositeId = JSON.parse(localStorage.getItem('micrositeId'));
  constructor(private http: HttpClient,
    private ngxService: NgxUiLoaderService,
    private appService: AppConfigService
    ) {
  }

  getAllResources(microsite: any,workspaceId :any, header: any) {
    this.ngxService.start();
    return this.http.get<any>(`${this.appService.apiURL}microsite/active/unassigned/users?micrositeId=${microsite}&workspaceId=${workspaceId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }

  getAllRole(header: any) {
    this.ngxService.start();
    return this.http.get<any>(`${this.appService.apiURL}roles`,header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }

  onMapPocWithResource(params: any, header: any) {
    this.ngxService.start();
    return this.http.post<any>(`${this.appService.apiURL}workspace/team/user`, params, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }

  getTeamDTL(id: any, header: any) {
    return this.http.get<any>(`${this.appService.apiURL}workspace/team/users?micrositeId=${id.micrositeId}&workspaceId=${id.poc}`, header)
      .pipe(map(data => {
        return data;
      }),
      );
  }
  changeTeamStatus(reqdata: any, header: any) {
    this.ngxService.start();
    return this.http.put(`${this.appService.apiURL}workspace/team/user/status`, reqdata, header)
        .pipe(map(data => { 
          this.ngxService.stop();
          return data; }));
  }
}
