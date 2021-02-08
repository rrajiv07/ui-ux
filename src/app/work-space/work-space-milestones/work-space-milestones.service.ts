import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WorkSpaceMilestonesService {

  constructor(private http: HttpClient,private ngxService: NgxUiLoaderService,private appService: AppConfigService) { }
  getMilestones(id: any, header) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}workspace/milestones?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}`, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    complete(reqdata: any, header: any) {
      this.ngxService.start();
      return this.http.put(`${this.appService.apiURL}workspace/milestone`, reqdata, header)
          .pipe(map(data => { 
            this.ngxService.stop();
            return data; }));
    }
}
