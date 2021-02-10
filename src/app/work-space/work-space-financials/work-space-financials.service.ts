import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WorkSpaceFinancialsService {

  constructor(private http: HttpClient,
    private ngxService: NgxUiLoaderService,
    private appService: AppConfigService) { }

    upload(value: any, header: any,isEdit:any) {
      this.ngxService.start();      

      if (!isEdit)
      {
      return this.http.post<any>(`${this.appService.apiURL}workspace/estimation/doc/upload`, value, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
      }
      else
      {
        return this.http.put<any>(`${this.appService.apiURL}workspace/estimation/doc/upload`, value, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
      }
    }
    download(params: any,header:any) {
      let uri;
      uri = `${this.appService.apiURL}workspace/estimation/doc/download`;
      this.ngxService.start();
      return this.http.get(uri, { headers: header.headers, params: params, responseType: 'blob' })
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    getEstimationHeaderInfo(id: any, header: any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}workspace/estimations?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
    }
    getEstimationDetailInfo(id: any, header: any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}workspace/estimation/details?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
    }
    getComments(id: any, header: any) {
      this.ngxService.start();
      return this.http.get<any>(`${this.appService.apiURL}workspace/estimation/comments?micrositeId=${id.micrositeId}&workspaceId=${id.workspaceId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
    }
    NewComments(value: any, header: any) {
      this.ngxService.start();      
      return this.http.post<any>(`${this.appService.apiURL}workspace/estimation/comment`, value, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    ReplyComments(value: any, header: any) {
      this.ngxService.start();      
      return this.http.post<any>(`${this.appService.apiURL}workspace/estimation/reply`, value, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
    deleteEstimation(id: any, header: any){
      this.ngxService.start();
      return this.http.delete<any>(`${this.appService.apiURL}workspace/estimation/detail?workspaceId=${id.workspaceId}&micrositeId=${id.micrositeId}&estimationDtlId=${id.estimationDtlId}&estimationId=${id.estimationId}`, header)
        .pipe(map(data => {
          this.ngxService.stop();
          return data;
        }),
        );
    }
}
