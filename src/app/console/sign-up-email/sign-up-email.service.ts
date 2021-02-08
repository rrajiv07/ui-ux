import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SignUpEmailService {

  constructor(private http: HttpClient,private ngxService: NgxUiLoaderService,private appService: AppConfigService) { }
  checkEmail(queryParams)
  {
    this.ngxService.start(); 
    return this.http.get<any>(`${this.appService.apiURL}checkmail?` + queryParams)
    .toPromise()
    .then(data => {
      this.ngxService.stop(); 
      return data;
    });
  }
}
