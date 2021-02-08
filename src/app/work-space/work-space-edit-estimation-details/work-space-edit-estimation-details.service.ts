import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WorkSpaceEditEstimationDetailsService {
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };
  constructor(private http: HttpClient,
    private ngxService: NgxUiLoaderService,
    private appService: AppConfigService) {    
  }
  save(value: any, isEdit: any,header:any) {
    this.ngxService.start();
    if (isEdit) {
      return this.http.put<any>(`${this.appService.apiURL}workspace/estimation/details`, value, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
    }
    else
    {
    return this.http.post<any>(`${this.appService.apiURL}workspace/estimation/details`, value, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
    }
  }
  
}
