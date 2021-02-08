import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppConfigService } from '@app/utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WorkSpaceListService {

  constructor(private http: HttpClient,private ngxService: NgxUiLoaderService,private appService: AppConfigService) { 
    ;  
  }
  getWorkSpaceList(header: any) {    
	this.ngxService.start()
    return this.http.get<any>(`${this.appService.apiURL}microsite/workspaces?micrositeId`+'='+localStorage.getItem('micrositeId'), header)
      .pipe(map(data => {
        this.ngxService.stop();
        return data; })
      );
  }
}
