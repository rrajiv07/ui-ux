import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private http: HttpClient,private ngxService: NgxUiLoaderService) {}
  changePassword(value: any,header) {
    this.ngxService.start();
    return this.http.post<any>(`${environment.apiUrl}account/forgot-password/complete`, value, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
}
