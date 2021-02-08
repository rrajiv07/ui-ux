import { Component, OnInit, ViewChild } from '@angular/core';
import { PinchComponentComponent } from '../pinch-component/pinch-component.component';
import { CommonService } from '@app/utils/common.service';
import { HttpHeaders } from '@angular/common/http';
import { WorkSpaceWireframeService } from '../work-space-wireframe.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-model',
  templateUrl: './image-model.component.html',
  styleUrls: ['./image-model.component.css']
})
export class ImageModelComponent implements OnInit {
  @ViewChild('pinch') pinchZoom: PinchComponentComponent;
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };
  formGroup: FormGroup;
  boardId: any;
  wsPocId: any;
  // header:any;
  micrositeId: any;
  submitted: boolean = false;
  link: any;

  constructor(private commonService: CommonService,
    private workspace: WorkSpaceWireframeService,
    private formBuilder: FormBuilder,
    private config: DynamicDialogConfig,
    private sanitizer: DomSanitizer,
    private dialog: DynamicDialogRef) { }

  ngOnInit(): void {
    this.link = this.config.data['isAdobe'] ? this.sanitizer.bypassSecurityTrustResourceUrl(this.config.data['link']) : this.config.data['link'][0].image;
    this.initForm();
  }

  Close() {
    this.dialog.close()
  }
  initForm() {
    this.formGroup = this.formBuilder.group({
      reviewComment: ['', Validators.required]
    });
  }
  get f1() { return this.formGroup.controls; }
  saveComments() {
    const config = this.config.data;
    const formData = this.formGroup.getRawValue();
    this.submitted = true;
    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    }
    const reqdata = {
      "reviewComment": formData.reviewComment,
      "micrositeId": config['micrositeId'],
      "workspaceId": config['wsPocId'],
      "workspaceDtlId": config['boardId']
    }
    this.workspace.saveComments(reqdata, config['header'])
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);
            this.Close();
          }
          else {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });

  }

}
