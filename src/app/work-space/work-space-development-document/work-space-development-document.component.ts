import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { first } from 'rxjs/operators';
import {CommonService} from '../../utils/common.service';
import { WorkSpaceSevelopmentDocumentService } from './work-space-development-document.service';
import { EditCommentsReceivedComponent } from '../edit-comments-received/edit-comments-received.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-work-space-development-document',
  templateUrl: './work-space-development-document.component.html',
  styleUrls: ['./work-space-development-document.component.css']
})
export class WorkSpaceDevelopmentDocumentComponent implements OnInit {
  formGroup: FormGroup;
  editCommentsDialogPtr: DynamicDialogRef;
  submitted: boolean = false;
  commentsReceived = [];
  existingReviewer = [];
  selectedReviewerObj = {};
  selectedReviewer = [];
  selectedReviewerIndex: any;
  selectedRole: any;
  reviewers = [];
  fileSelect: FileList;
  workSpaceDDLists = [];
  blob: any;
  message: string;
  boardId: any;
  wsPocId: any;
  header:any;
  micrositeId :any;
  constructor(private WorkSpaceSevelopmentDocumentService: WorkSpaceSevelopmentDocumentService,
    private HttpClient: HttpClient,
    private formBuilder: FormBuilder,
    private actRoute: ActivatedRoute,
    private commonService:CommonService,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.getParams();
    this.initForm();
    this.getDocumentList();
    this.getReviewerCombo();
    this.getAllReviewComments();
    this.getAssignedReviewer();
  }

  getDocumentList() {

    const token = localStorage.getItem('tempCurrentUserToken');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
      // .set('Content-Type', `multipart/form-data`)
    };
    let queryParams = "micrositeId=" + this.micrositeId + "&workspaceId=" + this.wsPocId + "&workspaceDtlId=" + this.boardId;

    // let queryParams = "micrositeId=" + this.micrositeId + "&pocId=" + this.wsPocId + "&wsBoardId=" + this.boardId;
    // console.log("");

    this.WorkSpaceSevelopmentDocumentService.getDevelopmentDocumentationData(queryParams, header).then(
      data => {
        this.workSpaceDDLists = (data['result_data'] != undefined) ? data['result_data'] : [];
      },
      error => {
      });
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      documentName: ['', Validators.required],
      documentType: ['', Validators.required],
      isFileInput: ['', Validators.required],
      reviewComment: [''],
      uploadFile: ['', []],
      documentDescription: ['', Validators.required],
    });
  }



  onSubmit() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    }
    const formData = this.formGroup.getRawValue();
    const reqdata = {
      "docName": formData.documentName,
      "docType": formData.documentType,
      "description": formData.documentDescription,
      "micrositeId": this.micrositeId, 
      "workspaceId": this.wsPocId, 
      "workspaceDtlId": this.boardId
    }   

    const fileToUpload = this.fileSelect.item(0);
    const formDataf = new FormData();
    formDataf.append('file', fileToUpload, fileToUpload.name);
    formDataf.append('docDto', JSON.stringify(reqdata));
    const token = localStorage.getItem('tempCurrentUserToken');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
      // .set('Content-Type', `multipart/form-data`)
    };


    this.WorkSpaceSevelopmentDocumentService.formDataSave(formDataf, header).pipe(first())
      .subscribe(
        (data: any) => {

          if (data['result_status'] == "Success") {
            this.submitted = false;
            this.formGroup.reset();
            this.getDocumentList();
            this.commonService.successMessage(data['result_msg']);
          }
        },
        error => {
        });

  }

  fileUpload(file: FileList) {
    this.fileSelect = file;
    this.formGroup.patchValue({ isFileInput: this.fileSelect ? this.fileSelect[0].name : '' });
  }


  doDownload(fileName) {
    console.log(fileName,">>>>>>>>>>>>>>>fileName")
    let param = new HttpParams().set("docDto", `{"docName": "${fileName.docName}","micrositeId": ${this.micrositeId},"workspaceId":${this.wsPocId},"workspaceDtlId":${this.boardId},"id":${fileName.id}}`);
    this.WorkSpaceSevelopmentDocumentService.onDownloadFile(param,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          // var fileExt = fileName.split('.').pop();

          this.blob = new Blob([data], { type: fileName.fileExtn }); // image/png

          var downloadURL = window.URL.createObjectURL(this.blob);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = fileName.docName;
          link.click();
        },
        error => {
        });
  }
  get f1() { return this.formGroup.controls; }

  getParams() {
    const token = localStorage.getItem('tempCurrentUserToken');
    this.header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };

    this.micrositeId= localStorage.getItem('micrositeId');
    this.actRoute.parent.paramMap
      .subscribe(params => {
        this.boardId = params['params'].boardId;
        this.wsPocId = params['params'].subNav
      });
  }
  saveComments()
  {
    const formData = this.formGroup.getRawValue();
    if (formData.reviewComment == "") {
      this.commonService.failureMessage("Comments is required");
      return;
    };
    const reqdata = {
      "reviewComment": formData.reviewComment,
      //"docName": formData.docName,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId), 
      "workspaceDtlId": parseInt(this.boardId)
    }
    this.WorkSpaceSevelopmentDocumentService.saveComments(reqdata,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);
			      this.getAllReviewComments();
          }
          else
          {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });

  }
  getAllReviewComments()
  {
    const reqdata = {
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId), 
      "workspaceDtlId": parseInt(this.boardId)
    }
    this.WorkSpaceSevelopmentDocumentService.getAllReviewComments(reqdata, this.header)
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
  onChangeReview(event) {
    this.selectedReviewerObj = {};
    this.selectedReviewerIndex = null;
    this.selectedReviewerIndex = event.target["selectedIndex"];
    var element = this.reviewers[this.selectedReviewerIndex];
    this.selectedReviewerObj = element;
  }
  selectReviewer() {
    if (this.selectedRole != null && this.selectedRole != undefined) {
      //this.selectedReviewerObj["name"]=this.selectedReviewerObj["userName"];
      this.selectedReviewer.push(this.selectedReviewerObj);
      this.reviewers.splice(this.selectedReviewerIndex, 1);
    }
    else {
      this.commonService.failureMessage("Please select reviewer");
    }
    this.selectedRole = null;
  }
  getReviewerCombo()
  {
    const req_data = {
      'micrositeId': this.micrositeId,
      'workspaceId': this.wsPocId,
      'workspaceDtlId':parseInt(this.boardId)
    }
    this.WorkSpaceSevelopmentDocumentService.getReviewerCombo(req_data,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if ( data.result_data !=null && data.result_data.length) {     
            this.reviewers= data.result_data;
            this.selectedRole = null;
            this.reviewers.slice();
            return;
          }
        },
        error => {
        });
  }
  getAssignedReviewer()
  {
    const reqdata = {
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId), 
      "workspaceDtlId": parseInt(this.boardId)
    }
    this.WorkSpaceSevelopmentDocumentService.getAssignedReviewer(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS" && data.result_data !=null) {
            this.existingReviewer = data.result_data;
            return;
          }
        },
        error => {
        });
  }
  deleteSelectedReviewer(item, index) {
    this.reviewers.push(item);
    this.selectedReviewer.splice(index, 1);
  }
  submitReviewer()
  {
    var selectedReviewer=[];
    this.selectedReviewer.forEach(element => {
      var selectedReviewerobj={};
      selectedReviewerobj["id"]=element.userId;
      selectedReviewerobj["name"]=element.userName;
      selectedReviewer.push(selectedReviewerobj);
    });
    const reqdata = {
      "reviewerIds": selectedReviewer,
      //"docName": formData.docName,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId), 
      "workspaceDtlId": parseInt(this.boardId)
    }
    console.log(reqdata,">>>>>>>>>>>reqdata")
    this.WorkSpaceSevelopmentDocumentService.submitReviewer(reqdata,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);
            this.selectedReviewer=[];
            this.getAssignedReviewer();
          }
          else
          {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });
  }
  editComments(item) {
    item["wsPocId"]=this.wsPocId;
    item["boardId"]=this.boardId;
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
  deleteExistingReviewer(item)
  {
    console.log(item,">>>>>>>>>>>>>>>>>>item");
    const reqdata = {
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId),
      "workspaceDtlId": parseInt(this.boardId),
      "reviewerId": parseInt(item.id)
    }
    this.WorkSpaceSevelopmentDocumentService.deleteExistingReviewer(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS") {
            this.commonService.successMessage(data.result_msg);
            this.getReviewerCombo();
            this.existingReviewer=[];
            this.getAssignedReviewer();            
            return;
          }
        },
        error => {
        });

  }
}
