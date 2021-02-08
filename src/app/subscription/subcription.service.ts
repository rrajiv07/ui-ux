import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubcriptionService {

  constructor(private http: HttpClient,
    private ngxService: NgxUiLoaderService) {
  }

  getAllMem(micrositeId, header) {
    this.ngxService.start();
    return this.http.get<any>(`${environment.apiUrl}microsite/users?micrositeId=${micrositeId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }


  inviteMember(value: any, header) {
    this.ngxService.start();
    return this.http.post<any>(`${environment.apiUrl}invite/internal/users`, value, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  getPlanDetails(micrositeId, header) {
    this.ngxService.start();
    return this.http.get<any>(`${environment.apiUrl}microsite/subscription?micrositeId=${micrositeId}`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  getAllPlanDetails(header) {
    this.ngxService.start();
    return this.http.get<any>(`${environment.apiUrl}subscription/plans`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
  makePayment(value,header){
    this.ngxService.start();
    return this.http.put<any>(`${environment.apiUrl}microsite/subscription`, value, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data;
      }),
      );
  }
} 
