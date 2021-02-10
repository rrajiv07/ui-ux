import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { LoginService } from './login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { SignUpEmailComponent } from '../sign-up-email/sign-up-email.component';
import { CommonService } from '../../utils/common.service';
import { AppConfigService } from '../../utils/app-config.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
    signupDialogPtr: DynamicDialogRef;
    forgotPasswordDialogPtr: DynamicDialogRef;
    loginForm: FormGroup;
    submitted: boolean = false;
    isLoginError: boolean = false;
    loginFormDiv: boolean = true;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private loginService: LoginService,
        private dialogService: DialogService,
        private commonService: CommonService,
        private appConfig: AppConfigService) { }

    getLoginDetails(token: any) {
        const formData = {};
        const header = {
            headers: new HttpHeaders()
                .set('Authorization', `Bearer ${token}`)
        };
        this.loginService.getLoggedInDetails(header)
            .pipe(first())
            .subscribe(
                data => {

                    if (data['result_status'].toUpperCase() === 'SUCCESS') {
                        const baseUrlFlag = this.appConfig.appConfig['flag'];

                        if (baseUrlFlag == 'Y') {
                            var url = window.location.origin;
                            var subDomain = this.getSubdomain(url);
                            var micrositeName = data['result_data'].micrositeName;
                            if (subDomain == micrositeName) {
                                if (data['result_data'].userTypeCdoe == 'Idea Owner' && data['result_data'] != null) {
                                    this.commonService.setIdeaOwner();
                                }
                                this.getWorkSpace(token, JSON.stringify(data['result_data']), data['result_data'].micrositeId);
                            }
                            else {
                                url = url.replace(subDomain, micrositeName);
                                var pathname = window.location.pathname;
                                var urlPath = url + pathname + '#/page-redirect?token=' + token;
                                window.location.href = urlPath;
                            }
                        }
                        else {
                            if (data['result_data'].userTypeCdoe == 'Idea Owner' && data['result_data'] != null) {
                                this.commonService.setIdeaOwner();
                            }
                            this.getWorkSpace(token, JSON.stringify(data['result_data']), data['result_data'].micrositeId);

                        }

                        /*
                        if (data['result_data'].userTypeCdoe == 'Idea Owner' && data['result_data'] != null) {
                            this.commonService.setIdeaOwner();
                        }

                        //localStorage.setItem('tempCurrentUser', JSON.stringify(data['result_data']));
                        //localStorage.setItem('micrositeId',data['result_data'].micrositeId);
                        this.getWorkSpace(token, JSON.stringify(data['result_data']), data['result_data'].micrositeId);
                        // data.result_data
                        */
                        return;
                    }
                    else {
                        this.commonService.failureMessage(data['result_msg']);
                        return;
                    }
                },
                error => {
                });
    }

    onSubmit() {
        this.submitted = true;
        this.isLoginError = false;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        else {
            const formData = this.loginForm.getRawValue();
            const reqdata = {
                "username": formData.emailId,
                "password": formData.password,
                "rememberMe": true
            }
            this.loginService.login(reqdata)
                .pipe(first())
                .subscribe(
                    data => {
                        if (data.result_status.toUpperCase() === 'SUCCESS') {
                            //localStorage.setItem('tempCurrentUserToken', data.result_data.id_token);
                            this.getLoginDetails(data.result_data.id_token);
                            //this.getWorkSpace(data.result_data.id_token);
                            return;
                        }
                        else {
                            this.commonService.failureMessage(data.result_msg);
                        }
                    },
                    error => {
                    });
        }
    }

    getWorkSpace(token: any, tempCurrentUser: any, micrositeId: any) {
        const header = {
            headers: new HttpHeaders()
                .set('Authorization', `Bearer ${token}`)
        };
        this.loginService.getWorkSpaceboards(header)
            .pipe(first())
            .subscribe(
                (data: any) => {
                    const len = data ? data.result_data.length : [];
                    localStorage.setItem('tempCurrentUserToken', token);
                    localStorage.setItem('tempCurrentUser', tempCurrentUser);
                    localStorage.setItem('micrositeId', micrositeId);
                    //len ? this.router.navigate(['/workspace/createworkspace']) : this.router.navigate(['/workspace/createworkspace'])
                    len ? this.router.navigate(['/workspace']) : this.router.navigate(['/workspace'])
                    /*
                    const baseUrlFlag = this.appConfig.appConfig['flag'];
                    if (baseUrlFlag == 'Y') {
                      //window.location.href = "http://" + this.micrositeName + ".hivezen.com:9797/Hivezen/";
                    }
                    */

                    return;
                },
                error => {
                });
    }

    get f1() { return this.loginForm.controls; }

    // Form Initialize
    initForm() {
        this.loginForm = this.formBuilder.group({
            emailId: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            password: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.initForm();
        this.deleteLocalStorage();
        //console.log(localStorage,"login init")
    }
    signup() {
        this.signupDialogPtr = this.dialogService.open(SignUpEmailComponent, {
            //header: 'Setup your account',
            showHeader: false,
            closable: false,
            width: '59%',
            contentStyle: { "max-height": "30%", "overflow": "auto", "padding": "0 1.1rem 0rem 1.5rem", "border-radius": "10px" },
        });
    }
    deleteLocalStorage() {
        Object.keys(localStorage).forEach(function (key) {
            localStorage.removeItem(key);
        });
    }
    forgotPassword() {
        this.forgotPasswordDialogPtr = this.dialogService.open(ForgotPasswordComponent, {
            //header: 'Setup your account',
            showHeader: false,
            closable: false,
            width: '59%',
            contentStyle: { "max-height": "30%", "overflow": "auto", "padding": "0 1.1rem 0rem 1.5rem", "border-radius": "10px" },
        });

    }
    getSubdomain(url) {
        var urlSplit = url.split('.')[1] ? url.split('.')[0] : '';
        var lastIndex = urlSplit.lastIndexOf("//");
        var s2 = urlSplit.substring(lastIndex + 1);
        var subdomain = s2.replace('/', '');
        return subdomain;
    }

}