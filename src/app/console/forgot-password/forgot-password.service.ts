import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpClient,private ngxService: NgxUiLoaderService) {}
  forgotPassword(value: any) {
    this.ngxService.start(); 
    return this.http.post<any>(`${environment.apiUrl}account/forgot-password/initiate`, value)
      .pipe(map(data => { 
        this.ngxService.stop();
        return data; }),
        // catchError(this.handleError)
      );
  }
}
