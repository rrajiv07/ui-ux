import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { environment } from '@environments/environment';
import { AppConfigService } from '@app/utils/app-config.service';
@Injectable({
  providedIn: 'root'
})

export class WorkSpaceInitialRequirementService {
  
  constructor(private http: HttpClient,private ngxService: NgxUiLoaderService,private appService: AppConfigService) {     
    this.ngxService.start();
   }
  formDataSave(reqdata: any, header: any, isEdit: any) {
    this.ngxService.start();
    if (isEdit) {
      return this.http.put(`${this.appService.apiURL}workspace/phase/requirement`, reqdata, header)
        .pipe(map(data => { 
          this.ngxService.stop();
          return data; }));
    } else {
      return this.http.post(`${this.appService.apiURL}workspace/phase/requirement`, reqdata, header)
        .pipe(map(data => { 
          this.ngxService.stop();
          return data; }));
    }
  }
  initInitialRequirement(micrositeId:any,pocId: any,boardMapId:any, header: any) {
    this.ngxService.start();
    //return this.http.get<any>(`${this.appService.apiURL}workspace/phase/requirement?micrositeId`+'='+micrositeId +'&workspaceId='+ pocId +'&pocBoardMapId='+ boardMapId, header)
    return this.http.get<any>(`${this.appService.apiURL}workspace/phase/requirement?micrositeId`+'='+micrositeId +'&workspaceId='+ pocId, header)
      .toPromise()
      .then(data => {
        this.ngxService.stop();
        return data;
      });
  }
}
