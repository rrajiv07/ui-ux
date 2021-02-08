import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,private appService: AppConfigService) { }

  login(value: any) {
    return this.http.post<any>(`${this.appService.apiURL}authenticate`, value)
      .pipe(map(data => { return data; }),
        // catchError(this.handleError)
      );
  }

  getWorkSpaceboards(header: any) {
    return this.http.get<any>(`${this.appService.apiURL}microsite/workspace/phases`, header)
      .pipe(map(data => { return data; }),
        // catchError(this.handleError)
      );
  }

  getLoggedInDetails(header: any) {
    return this.http.get<any>(`${this.appService.apiURL}account`, header)
      .pipe(map(data => { return data; }),
        // catchError(this.handleError)
      );
  }
}
