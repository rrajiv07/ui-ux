import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  appConfig: string;
  apiURL: string;

  constructor(private http: HttpClient) { }
  getAppConfigs() {
    return new Promise((resolve) => {
        this.http.get('./assets/config/config.json').subscribe(
            (response) => {
                this.setAppConfigs(response);
            }, (err) => {
            }, () => {
                resolve(true);
            }
        );
    });
}
setAppConfigs(response) {
  this.appConfig = response;
  this.apiURL = response['apiUrl'];
}
}
