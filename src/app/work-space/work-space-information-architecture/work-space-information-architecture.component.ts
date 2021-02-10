import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { WorkSpaceInformationArchitectureService } from './work-space-information-architecture.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// tslint:disable-next-line:import-spacing
import  * as $ from 'src/assets/js/jquery.min.js';
import {CommonService} from '../../utils/common.service';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { WorkSpaceUploadImageComponent} from '../work-space-upload-image/work-space-upload-image.component';
import {EditCommentsReceivedComponent} from '../edit-comments-received/edit-comments-received.component';
declare var jQuery:any;

@Component({
  selector: 'app-work-space-information-architecture',
  templateUrl: './work-space-information-architecture.component.html',
  styleUrls: ['./work-space-information-architecture.component.css']
})
export class WorkSpaceInformationArchitectureComponent implements OnInit {
  imageObject: Array<object> = [];
  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  uploadDialogPtr: DynamicDialogRef;
  editCommentsDialogPtr: DynamicDialogRef;
  header:any;
  roles = [];
  reviewers = [];
  selectedRole: any;
  reviewerList: any;
  reviewer: object;
  selectedReviewer = [];
  selectedReviewerObj={};
  selectedReviewerIndex:any;
  existingReviewer=[];
  commentsReceived=[];
  allUploadedFile = [];
  allUploadedFileIndex = [];
  IX = 0;
  pageIconCount: number = 1;
  allUploadedFileCount = 0;
  allFiles = [];
  tableContent = [];
  status = [];
  imageURL: any;
  formGroup: FormGroup;
  fileSelect: FileList;
  blob: any;
  submitted: boolean = false;
  desc: string;
  heading: string;
  activeCorosalImg: object;
  boardId: any; 
  wsPocId: any;
  micrositeId: any;
  currentIndex:any =-1;
  constructor(private workspace: WorkSpaceInformationArchitectureService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private actRoute: ActivatedRoute,
    private commonService:CommonService,
    private dialogService: DialogService) { }

    //Getting all the uploaded files list
  getAllUploadedFile() {
    this.allFiles = [];
    this.allUploadedFileIndex = [];
    this.pageIconCount = 1;

    const id = {
      'micrositeId': this.micrositeId,
      'pocId': this.wsPocId,
      'pocBoardMapId': this.boardId //process flow board id
    }
    this.workspace.getAllUploadedFile(id,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_data !=null && data.result_data.length) {
            this.allUploadedFile = data.result_data;
            this.getCarouselImage();
            return;
          }
        },
        error => {
        });
  }

  getCarouselImage()
  {
    var allFiles =[];    
    this.desc = this.allUploadedFile[0].description;
    this.heading = this.allUploadedFile[0].docName ? this.commonService.sliceEXTFromName(this.allUploadedFile[0].docName) : null;

    this.allUploadedFileCount = 0;
    var allFilesObj ={};
    this.allUploadedFile.forEach(element => {      
      allFilesObj ={};
    if (this.allUploadedFileCount == 0)
    {
      allFilesObj["active"] =true;
    }
    allFilesObj["docName"] =element.docName;
    
    allFiles.push(allFilesObj);
    this.getImageUrl(element,allFilesObj,allFiles);
    if (this.allUploadedFileCount % this.pageIconCount == 0) {
      this.allUploadedFileIndex.push(this.allUploadedFileCount / this.pageIconCount);
    }
    this.allUploadedFileCount++;
    });
    var allFilesArray =[]; 
    allFiles.forEach(element => { 
      allFilesArray.push(element);
    });
    this.allFiles =[];
    this.allFiles =allFilesArray.slice();
  }
  
  onClickSlider(item,ix) { 
    var allFiles = this.allFiles;
    var response_date = [];
    var cnt=0;
    allFiles.forEach(function(item) { 
    var tempItem = Object.assign({}, item);
    delete tempItem.active;           
    if (cnt == ix)
    {
      tempItem["active"]=true;
    }
    response_date.push(tempItem);
    cnt = cnt +1;
      });
    this.allFiles =[];
    this.allFiles =response_date.slice();
    this.desc = item.description;
    this.heading = this.commonService.sliceEXTFromName(item.docName) ;
    this.allFiles.slice(0);
    this.IX =ix;
  }

  getImageUrl(item,allFilesObj,allFiles) {
    let param = new HttpParams().set("docDto", `{"docName": "${item.docName}","micrositeId": ${this.micrositeId},"workspaceId":${this.wsPocId},"workspaceDtlId":${this.boardId},"id":${item.id}}`);
     this.workspace.onDownloadFile(param,this.header)
       .pipe(first())
       .subscribe(
         (data: any) => {    
           this.activeCorosalImg = item;
           this.blob = new Blob([data], { type: 'image/png' });
           allFilesObj["imageUrl"] =window.URL.createObjectURL(data);
           allFiles.push(allFilesObj)
           return;
         },
         error => {
         });
   }
   getSantizeUrl(url : string) {
       
         return this.sanitizer.bypassSecurityTrustUrl(url);
     }
  initForm() {
    this.formGroup = this.formBuilder.group({
      uploadFile: [''],
      documentDescription: [''],
      reviewComment: ['', Validators.required]
    });
  }

  get f1() { return this.formGroup.controls; }

  getParams() {
    const token = localStorage.getItem('tempCurrentUserToken');
    this.header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    this.micrositeId =localStorage.getItem('micrositeId');
    this.actRoute.parent.paramMap
      .subscribe(params => {
        this.boardId = params['params'].boardId;
        this.wsPocId = params['params'].subNav
      });
  }

  ngOnInit(): void {
    this.getParams();
    this.initForm();
    this.selectedReviewer = [];
    this.allFiles = [];
    this.getAllUploadedFile();    
    this.getReviewerCombo();
    this.getAllReviewComments();
    this.getAssignedReviewer();
    //this.proto() ;
  }
  ClickCarousolLeftSlider()
  {
    var currentItem = jQuery("#myCarousel .item.active" );    
    var currentIndex = jQuery('#myCarousel .item').index(currentItem) -1;
    var cnt = this.allUploadedFile.length;
    if (currentIndex < 0)
    {
      currentIndex = cnt-1;
    }
    console.log(currentIndex,this.allUploadedFile[currentIndex],">>>>>>left");
    this.desc = this.allUploadedFile[currentIndex].description;
    this.heading = this.allUploadedFile[currentIndex].docName ? this.commonService.sliceEXTFromName(this.allUploadedFile[currentIndex].docName) : null;
  }
  ClickCarousolRightSlider()
  {
    var currentItem = jQuery("#myCarousel .item.active" );    
    var currentIndex = jQuery('#myCarousel .item').index(currentItem) +1;
    var cnt = this.allUploadedFile.length;
    if (currentIndex == cnt)
    {
      currentIndex = 0;
    }
    console.log(currentIndex,this.allUploadedFile[currentIndex],">>>>>>right");
    this.desc = this.allUploadedFile[currentIndex].description;
    this.heading = this.allUploadedFile[currentIndex].docName ? this.commonService.sliceEXTFromName(this.allUploadedFile[currentIndex].docName) : null;  
  }
  upload()
    {
      var objPubSub = {
        "micrositeId":this.micrositeId,
        "pocId":this.wsPocId,
        "pocBoardMapId":this.boardId        
      };

      this.uploadDialogPtr = this.dialogService.open(WorkSpaceUploadImageComponent, {
          //header: 'Setup your account',
          showHeader:false,
          closable:false,
          width: '59%',
          data:objPubSub,
          contentStyle: { "max-height": "30%", "overflow": "auto","padding":"0 1.1rem 0rem 1.5rem","border-radius":"10px"},
        });
        this.uploadDialogPtr.onClose.subscribe((data) => {
          this.getAllUploadedFile();
        });
    }
    
  proto() {
    /*
    this.reviewers = [
      { "id": 3, "name": "Reviewer 3" },
      { "id": 4, "name": "Reviewer 4" },
    ]
    */
    this.existingReviewer=[
      { "id": 1, "name": "Reviewer 1" },
      { "id": 2, "name": "Reviewer 2" },
    ]
    this.commentsReceived=[
      {"date":"Dec 25, 2020","reviewer":"Rajiv","comments":"Check Section 4","action":"Accepted","assignTo":"Developer 1","status":"Inprogress"},
      {"date":"Dec 25, 2020","reviewer":"Kali","comments":"Reduce no of steps","action":"Rejected","assignTo":"","status":"Done"},
      {"date":"Dec 25, 2020","reviewer":"Reviewer 1","comments":"Notification to be added","action":"Accepted","assignTo":"Developer 2","status":"Inprogress"},
      {"date":"Dec 25, 2020","reviewer":"Reviewer 2","comments":"FAQ missing","action":"Rejected","assignTo":"","status":"Done"}
    ];
  }
  selectReviewer() {
    if(this.selectedRole != null && this.selectedRole != undefined)
    {
    this.selectedReviewer.push(this.selectedReviewerObj);
    this.reviewers.splice(this.selectedReviewerIndex,1);    
    }
    else
    {
      this.commonService.failureMessage("Please select reviewer");
    }
    this.selectedRole=null;
  }
  onChangeReview(event)
  {
    this.selectedReviewerObj={};
    this.selectedReviewerIndex=null;
    this.selectedReviewerIndex= event.target["selectedIndex"];
    var element =this.reviewers[this.selectedReviewerIndex];
    this.selectedReviewerObj =element;
  }
  deleteSelectedReviewer(item,index)
  {
    this.reviewers.push(item);
    this.selectedReviewer.splice(index,1);
  }
  editComments(item)
  {
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
  getReviewerCombo()
  {
    const req_data = {
      'micrositeId': this.micrositeId,
      'workspaceId': this.wsPocId,
      'workspaceDtlId':parseInt(this.boardId)
    }
    this.workspace.getReviewerCombo(req_data,this.header)
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
  saveComments()
  {
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
    this.workspace.saveComments(reqdata,this.header)
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
    this.workspace.submitReviewer(reqdata,this.header)
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
  getAssignedReviewer()
  {
    const reqdata = {
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId), 
      "workspaceDtlId": parseInt(this.boardId)
    }
    this.workspace.getAssignedReviewer(reqdata, this.header)
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
  zoomImage(index)
  {
    var currentItem = jQuery("#myCarousel .item.active");
    var currentIndex = jQuery('#myCarousel .item').index(currentItem);
   this.imageObject = [{
      image: this.allFiles[currentIndex].imageUrl
        }
        ];
    this.selectedImageIndex = index;
    this.showFlag = true;
  }
  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
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
    this.workspace.deleteExistingReviewer(reqdata, this.header)
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
