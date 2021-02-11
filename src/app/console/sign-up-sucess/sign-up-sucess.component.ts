import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { AppConfigService } from '../../utils/app-config.service';

@Component({
  selector: 'app-sign-up-sucess',
  templateUrl: './sign-up-sucess.component.html',
  styles: []
})
export class SignUpSucessComponent implements OnInit {
  micrositeName: any;
  micrositeId : any;
  token : any;
  constructor(public dialog : DynamicDialogRef,
    private router: Router,
    public config: DynamicDialogConfig,
    @Inject(DOCUMENT) private document: Document,
    private appConfig: AppConfigService) { }

  ngOnInit(): void {
    this.micrositeId = this.config.data.micrositeId;
    this.token = this.config.data.token;
    this.micrositeName = this.config.data.micrositeName;
  }
  Close()
  {
    this.navigation();
    //this.router.navigate(['/workspace'])
    this.dialog.close()
  }
  navigation(){

    const baseUrlFlag = this.appConfig.appConfig['flag'];
    if (baseUrlFlag == 'Y') {
    var url = window.location.origin;
    var subDomain = this.getSubdomain(url);
    url = url.replace(subDomain, this.micrositeName);
    var pathname = window.location.pathname;
    var urlPath = url + pathname + '#/page-redirect?token=' + this.token;
    document.location.href = urlPath;
    }
    else{
      this.router.navigate(['/workspace'])
    }
  }
  getSubdomain(url) {
    var urlSplit = url.split('.')[1] ? url.split('.')[0] : '';
    var lastIndex = urlSplit.lastIndexOf("//");
    var s2 = urlSplit.substring(lastIndex + 1);
    var subdomain = s2.replace('/', '');
    return subdomain;
}

}
