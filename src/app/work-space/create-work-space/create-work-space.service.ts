import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class CreateWorkSpaceService {

  constructor(private http: HttpClient,private ngxService: NgxUiLoaderService) {   
     
  }

  getWorkSpaceboards(header: any) {    
    this.ngxService.start(); 
    return this.http.get<any>(`${environment.apiUrl}microsite/workspace/phases`, header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data; }),
        // catchError(this.handleError)
      );
  }
  createWorkspace(value: any,header: any) {
    this.ngxService.start(); 
    return this.http.post<any>(`${environment.apiUrl}microsite/workspace`, value,header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data; }),
        // catchError(this.handleError)
      );
  }
}
