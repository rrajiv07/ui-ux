import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SignUpInviteTeamService {

  constructor(private http: HttpClient,private ngxService: NgxUiLoaderService,private appService: AppConfigService) {
    
   }
  signUp(value: any) {
    this.ngxService.start(); 
    return this.http.post<any>(`${this.appService.apiURL}register`, value)
      .pipe(map(data => { 
        this.ngxService.stop();
        return data; }),
        // catchError(this.handleError)
      );
  }
}
