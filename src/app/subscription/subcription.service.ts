import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SubcriptionService {

  constructor(private http: HttpClient,
    private ngxService: NgxUiLoaderService,
    private appService: AppConfigService) {
  }

  getAllMem(micrositeId, header) {
    this.ngxService.start();
    return this.http.get<any>(`${this.appService.apiURL}microsite/users?micrositeId=${micrositeId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }


  inviteMember(value: any, header) {
    this.ngxService.start();
    return this.http.post<any>(`${this.appService.apiURL}invite/internal/users`, value, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  getPlanDetails(micrositeId, header) {
    this.ngxService.start();
    return this.http.get<any>(`${this.appService.apiURL}microsite/subscription?micrositeId=${micrositeId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  getAllPlanDetails(header) {
    this.ngxService.start();
    return this.http.get<any>(`${this.appService.apiURL}subscription/plans`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  makePayment(value,header){
    this.ngxService.start();
    return this.http.put<any>(`${this.appService.apiURL}microsite/subscription`, value, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  changeTeamStatus(reqdata: any, header: any) {
    this.ngxService.start();
    return this.http.put(`${this.appService.apiURL}microsite/user/status`, reqdata, header)
        .pipe(map(data => { 
          this.ngxService.stop();
          return data; }));
  }
} 
