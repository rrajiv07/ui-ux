import { Component, OnInit } from '@angular/core';
import { WorkSpaceWireframeService } from './work-space-wireframe.service';
import { first } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../utils/common.service';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { EditCommentsReceivedComponent } from '../edit-comments-received/edit-comments-received.component';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageModelComponent } from './image-model/image-model.component';
@Component({
  selector: 'app-work-space-wireframe',
  templateUrl: './work-space-wireframe.component.html',
  styleUrls: ['./work-space-wireframe.component.css']
})
export class WorkSpaceWireframeComponent implements OnInit {
  method: string = 'SAVE';
  submitted: boolean = false;
  formGroup: FormGroup;
  editCommentsDialogPtr: DynamicDialogRef;
  imageModelDialog: DynamicDialogRef;
  reviewers = [];
  selectedRole: any;
  reviewer: object;
  selectedReviewer = [];
  existingReviewer = [];
  commentsReceived = [];
  selectedReviewerObj = {};
  selectedReviewerIndex: any;
  tableContent = [];
  status = [];
  iframeUrl: any;
  link: any;
  boardId: any;
  wsPocId: any;
  // header:any;
  micrositeId: any;
  respAfterSavingLink: any;
  canShowReviewer: boolean = false;
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };

  // canShowIframe: boolean;
  constructor(private workspace: WorkSpaceWireframeService,
    private sanitizer: DomSanitizer,
    private actRoute: ActivatedRoute,
    private commonService: CommonService,
    private dialogService: DialogService,
    private formBuilder: FormBuilder) { }


  getParams() {
    const token = localStorage.getItem('tempCurrentUserToken');
    // this.header = {
    //   headers: new HttpHeaders()
    //     .set('Authorization', `Bearer ${token}`)
    // };
    this.micrositeId = localStorage.getItem('micrositeId');
    this.actRoute.parent.paramMap
      .subscribe(params => {
        this.boardId = params['params'].boardId;
        this.wsPocId = params['params'].subNav
      });
  }

  variablesSetting(data) {
    this.canShowReviewer = true;
    // this.canShowIframe = true;
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
    //this.iframeUrl =this.link;
    this.respAfterSavingLink = data;
    this.status = data;
    this.method = 'UPDATE';
  }

  loadIframe() {
    const reqdata = {
      "micrositeId": this.micrositeId, "pocId": this.wsPocId, "pocBoardMapId": this.boardId
    }
    this.workspace.getLinkDetails(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS" && data.result_data != null) {
            this.link = data.result_data[0]['doclink'];
            this.variablesSetting(data.result_data[0]);
            return;
          }
          this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl("assets/images/noData.png");
          //this.iframeUrl = "assets/images/noData.png";
        },
        error => {
        });
  }

  onSaveLink() {
    const reqdata = {
      "doclink": this.link, "micrositeId": this.micrositeId, "workspaceId": this.wsPocId, "workspaceDtlId": this.boardId,
      'id': this.respAfterSavingLink && this.respAfterSavingLink.id
    }
    this.workspace.onSaveLink(reqdata, this.method, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === "SUCCESS") {
            this.commonService.successMessage(data.result_msg);
            this.variablesSetting(data.result_data);
            return;
          }
          this.commonService.failureMessage(data.result_msg);
        },
        error => {
        });
  }

  ngOnInit(): void {
    this.getParams();
    this.initForm();
    this.selectedReviewer = [];
    this.loadIframe();
    this.getReviewerCombo();
    this.getAllReviewComments();
    this.getAssignedReviewer();
    //this.proto();
  }
  initForm() {
    this.formGroup = this.formBuilder.group({
      reviewComment: ['', Validators.required]
    });
  }
  get f1() { return this.formGroup.controls; }
  getReviewerCombo() {
    const req_data = {
      'micrositeId': this.micrositeId,
      'workspaceId': this.wsPocId
    }
    this.workspace.getReviewerCombo(req_data, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_data != null && data.result_data.length) {
            this.reviewers = data.result_data;
            return;
          }
        },
        error => {
        });
  }
  proto() {
    this.reviewers = [
      { "id": 3, "name": "Reviewer 3" },
      { "id": 4, "name": "Reviewer 4" },
    ]
    this.existingReviewer = [
      { "id": 1, "name": "Reviewer 1" },
      { "id": 2, "name": "Reviewer 2" },
    ]
    this.commentsReceived = [
      { "date": "Dec 25, 2020", "reviewer": "Rajiv", "comments": "Check Section 4", "action": "Accepted", "assignTo": "Developer 1", "status": "Inprogress" },
      { "date": "Dec 25, 2020", "reviewer": "Kali", "comments": "Reduce no of steps", "action": "Rejected", "assignTo": "", "status": "Done" },
      { "date": "Dec 25, 2020", "reviewer": "Reviewer 1", "comments": "Notification to be added", "action": "Accepted", "assignTo": "Developer 2", "status": "Inprogress" },
      { "date": "Dec 25, 2020", "reviewer": "Reviewer 2", "comments": "FAQ missing", "action": "Rejected", "assignTo": "", "status": "Done" }
    ];
  }
  selectReviewer() {
    if (this.selectedRole != null && this.selectedRole != undefined) {
      this.selectedReviewer.push(this.selectedReviewerObj);
      this.reviewers.splice(this.selectedReviewerIndex, 1);
    }
    else {
      this.commonService.failureMessage("Please select reviewer");
    }
    this.selectedRole = null;
  }
  onChangeReview(event) {
    this.selectedReviewerObj = {};
    this.selectedReviewerIndex = null;
    this.selectedReviewerIndex = event.target["selectedIndex"];
    var element = this.reviewers[this.selectedReviewerIndex];
    this.selectedReviewerObj = element;
  }
  deleteSelectedReviewer(item, index) {
    this.reviewers.push(item);
    this.selectedReviewer.splice(index, 1);
  }
  editComments(item) {
    item["wsPocId"] = this.wsPocId;
    item["boardId"] = this.boardId;
    this.editCommentsDialogPtr = this.dialogService.open(EditCommentsReceivedComponent, {
      //header: 'Setup your account',
      showHeader: false,
      closable: false,
      width: '35%',
      data: item,
      contentStyle: { "max-height": "30%", "overflow": "auto", "padding": "0 1.1rem 0rem 1.5rem", "border-radius": "10px" },
    });
    this.editCommentsDialogPtr.onClose.subscribe((data) => {
      this.getAllReviewComments();
    });
  }

  onViewFullScreen() {
    const item = [];
    item["wsPocId"] = this.wsPocId;
    item["boardId"] = this.boardId;
    item['micrositeId'] = this.micrositeId;
    item['header'] = this.header;
    item['link'] = this.link;
    item['isAdobe'] = true;
    this.imageModelDialog = this.dialogService.open(ImageModelComponent, {
      //header: 'Setup your account',
      showHeader: false,
      closable: true,
      width: '80%',
      contentStyle: { "max-height": "50%", "overflow": "auto", "padding": "0 1.1rem 0rem 1.5rem", "border-radius": "10px" },
      data: item
    });
    this.imageModelDialog.onClose.subscribe((data) => {
      this.getAllReviewComments();
    });
  }
  saveComments() {
    const formData = this.formGroup.getRawValue();
    this.submitted = true;
    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    }
    const reqdata = {
      "reviewComment": formData.reviewComment,
      //"docName": formData.docName,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId),
      "workspaceDtlId": parseInt(this.boardId)
    }
    this.workspace.saveComments(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);
            this.getAllReviewComments();
          }
          else {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });

  }
  getAllReviewComments() {
    const reqdata = {
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId),
      "workspaceDtlId": parseInt(this.boardId)
    }
    this.workspace.getAllReviewComments(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS") {
            this.commentsReceived = data.result_data;
            return;
          }
        },
        error => {
        });
  }
  submitReviewer() {
    var selectedReviewer = [];
    this.selectedReviewer.forEach(element => {
      var selectedReviewerobj = {};
      selectedReviewerobj["id"] = element.userId;
      selectedReviewerobj["name"] = element.userName;
      selectedReviewer.push(selectedReviewerobj);
    });
    const reqdata = {
      "reviewerIds": selectedReviewer,
      //"docName": formData.docName,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId),
      "workspaceDtlId": parseInt(this.boardId)
    }
    console.log(reqdata, ">>>>>>>>>>>reqdata")
    this.workspace.submitReviewer(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);
            this.selectedReviewer = [];
            this.getAssignedReviewer();
          }
          else {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });
  }
  getAssignedReviewer() {
    const reqdata = {
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId),
      "workspaceDtlId": parseInt(this.boardId)
    }
    this.workspace.getAssignedReviewer(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS" && data.result_data != null) {
            this.existingReviewer = data.result_data;
            return;
          }
        },
        error => {
        });
  }
  sanitizeUrl(link) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }
}
