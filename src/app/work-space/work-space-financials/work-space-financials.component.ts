import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { first } from 'rxjs/operators';
import {WorkSpaceAddEstimationDetailsComponent} from '../work-space-add-estimation-details/work-space-add-estimation-details.component';
import {WorkSpaceEditEstimationDetailsComponent} from '../work-space-edit-estimation-details/work-space-edit-estimation-details.component';
import {WorkSpaceFinancialsService} from './work-space-financials.service';
import {CommonService} from '../../utils/common.service';
import * as XLSX from 'xlsx';
// AOA : array of array
type AOA = any[][];

@Component({
  selector: 'app-work-space-financials',
  templateUrl: './work-space-financials.component.html',
  styleUrls: ['./work-space-financials.component.css']
})
export class WorkSpaceFinancialsComponent implements OnInit {
  excelDataEncodeToJson;
  excelTransformNum = [];
  sheetMaxRow;
  sheetJsExcelName = 'null.xlsx';
  sheetBufferRender;
  isEmptyDrop = true;
  isExcelDrop = true;
  origExcelData: AOA = [
    ['Data: 2018/10/26'],
    ['Data: 2018/10/26'],
    ['Data: 2018/10/26'],
  ];
  localWorkBook;
  sheetNameForTab: Array<string> = ['excel tab 1', 'excel tab 2'];
  totalPage = this.sheetNameForTab.length;
  selectDefault;
  localwSheet;
  sheetCellRange;
  refExcelData: Array<any>;
  formGroup: FormGroup;
  fileSelect: FileList;
  blob: any;
  fileId:any;
  fileName:any;
  isUploadFlag:boolean=false;
  myEstimationFlag:boolean=false;
  hivezenEstimation:boolean=true;
  hivezenPhaseDtl:any;
  addEstimationDialogPtr: DynamicDialogRef;
  editEstimationDialogPtr: DynamicDialogRef;
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };
  wsPocId: string;
  micrositeId: string;
  submitted: boolean;
  commentsDtl: any;
  constructor(private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private actRoute: ActivatedRoute,
    private workspace:WorkSpaceFinancialsService,
    private commonService:CommonService) { }

  ngOnInit(): void {
    this.initForm();
    this.getParams();
    this.getEstimationHeaderInfo();
    this.getComments();
  }
  initForm()
  {
    this.formGroup = this.formBuilder.group({
      uploadFile: [''],
      newComments: [null, Validators.required],
      replyComments: [null, Validators.required],
    });
  }
  getParams() {
    this.actRoute.parent.paramMap
      .subscribe(params => {
        this.wsPocId = params['params'].subNav;
      });
    this.micrositeId = JSON.parse(localStorage.getItem('micrositeId'));
  }
  getEstimationHeaderInfo()
  {
    const reqdata = {
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId)
    }
    this.workspace.getEstimationHeaderInfo(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS" && data.result_data !=null) {
            this.fileId=data['result_data'][0].id;
            this.fileName =data['result_data'][0].fileName;
            var estimationType =data['result_data'][0].estimationType;            
            if (estimationType == 'myEstimation')
            {
              this.isUploadFlag=true;
              this.myEstimationFlag=true;
              this.hivezenEstimation=false;
            }
            else
            {
              this.isUploadFlag=false;
              this.myEstimationFlag=false;
              this.hivezenEstimation=true;
              this.getEstimationDetailInfo();
            }
            return;
          }
        },
        error => {
        });
  }
  getEstimationDetailInfo()
  {
    const reqdata = {
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId)
    }
    this.workspace.getEstimationDetailInfo(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS" && data.result_data !=null) {
            
            this.hivezenPhaseDtl = data.result_data.estimationDetails;
            return;
          }
        },
        error => {
        });
  }
 
  fileUpload(file: FileList,event) {
    console.log(event,">>>>>>>>>>>>event")
    this.fileSelect = file;
  }
  upload()
  {
    const formData = this.formGroup.getRawValue();
    const reqdata = {
      "description": formData.docDesc,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId),
      "estimationType": "myEstimation"
    }
    var isEdit=false;
    if (this.isUploadFlag && this.fileId !=null)
    {
      reqdata["id"]=this.fileId;
      isEdit=true;
    }
    if (this.fileSelect == undefined)
    {
      this.commonService.failureMessage("Upload document");
      return;
    }
    const fileToUpload = this.fileSelect.item(0);    
    const formDataf = new FormData();
    formDataf.append('file', fileToUpload, fileToUpload.name);
    formDataf.append('docDto', JSON.stringify(reqdata));
    console.log(fileToUpload,">>>>>>>>>>>>>fileToUpload");
    this.workspace.upload(formDataf,this.header,isEdit)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status === 'Success') {
            this.commonService.successMessage(data.result_msg);
            this.fileId=data.result_data.id;
            this.fileName =data.result_data.fileName;
          }
          else
          {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });
  }
  download()
  {
    if (this.fileId ==undefined || this.fileId ==null)
    {
      this.commonService.failureMessage("No file to view");
      return;
    }
    let param = new HttpParams().set("docDto", `{"micrositeId": ${this.micrositeId},"workspaceId":${this.wsPocId},"id":${this.fileId}}`);
    this.workspace.download(param,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          var ext = this.fileName.substr(this.fileName.lastIndexOf('.') + 1);
          this.blob = new Blob([data], { type: ext });           
          var downloadURL = window.URL.createObjectURL(this.blob);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = this.fileName;
          //console.log(link);
          var file = new File([this.blob], this.fileName, {lastModified: 1534584790000});
          //this.inputExcelOnClick1(file);
          link.click();
        },
        error => {
        });
  }
  radioClick(val)
  {
    if(val == 'Upload')
    {
      this.isUploadFlag=true;
    }
    else{
      this.isUploadFlag=false;
    }
  }
  addEstimation()
  {
    var objPubSub = {
      "micrositeId": this.micrositeId,
      "workspaceId": this.wsPocId,
      "estimationType": "hivezenEstimation"
    };
    this.addEstimationDialogPtr = this.dialogService.open(WorkSpaceAddEstimationDetailsComponent, {
      //header: 'Setup your account',
      showHeader:false,
      closable:false,
      width: '30%', 
      data:objPubSub,
      contentStyle: { "max-height": "30%", "overflow": "auto","padding":"0 1.1rem 0rem 1.5rem","border-radius":"10px"},
    });

    this.addEstimationDialogPtr.onClose.subscribe((data) => {
      this.getEstimationHeaderInfo();
      this.getEstimationDetailInfo();
    });
  }
  editEstimation(hivezenPhaseDtlobj)
  {
    var objPubSub = {
      "micrositeId": this.micrositeId,
      "workspaceId": this.wsPocId,
      "estimationType": "hivezenEstimation",
      "id": hivezenPhaseDtlobj.id,
      "estimationId":hivezenPhaseDtlobj.estimationId,
      "devPhase":hivezenPhaseDtlobj.devPhase,
      "manMonthsEffort" : hivezenPhaseDtlobj.manMonthsEffort,
      "costs":hivezenPhaseDtlobj.costs
    };
    this.addEstimationDialogPtr = this.dialogService.open(WorkSpaceEditEstimationDetailsComponent, {
      //header: 'Setup your account',
      showHeader:false,
      closable:false,
      width: '30%',
      data:objPubSub,
      contentStyle: { "max-height": "30%", "overflow": "auto","padding":"0 1.1rem 0rem 1.5rem","border-radius":"10px"},
    }); 
    this.addEstimationDialogPtr.onClose.subscribe((data) => {
      this.getEstimationDetailInfo();
    });
  }
  inputExcelOnClick1(evt) {
    /*
    const target: HTMLInputElement = evt.target;
    if (target.files.length === 0) {
      throw new Error('未上傳');
    }
    if (target.files.length > 1) {
      throw new Error('Cannot use multiple files');
    }
    this.sheetJsExcelName = evt.target.files.item(0).name;
    */
   console.log(evt,">>>>>>>>>evt")
    const reader: FileReader = new FileReader();
    this.readerExcel(reader);
    //console.log(target.files[0])
    reader.readAsArrayBuffer(evt);
    this.sheetBufferRender = evt;
    this.isEmptyDrop = false;
    this.isExcelDrop = true;
  }
  inputExcelOnClick(evt) {
    const target: HTMLInputElement = evt.target;
    if (target.files.length === 0) {
      throw new Error('未上傳');
    }
    if (target.files.length > 1) {
      throw new Error('Cannot use multiple files');
    }
    this.sheetJsExcelName = evt.target.files.item(0).name;
    const reader: FileReader = new FileReader();
    this.readerExcel(reader);
    console.log(target.files[0])
    reader.readAsArrayBuffer(target.files[0]);
    this.sheetBufferRender = target.files[0];
    this.isEmptyDrop = false;
    this.isExcelDrop = true;
  }
  readerExcel(reader, index = 0) {
    /* reset array */
    this.origExcelData = [];
    reader.onload = (e: any) => {
      const data: string = e.target.result;
      const wBook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
      this.localWorkBook = wBook;
      const wsname: string = wBook.SheetNames[index];
      this.sheetNameForTab = wBook.SheetNames;
      this.totalPage = this.sheetNameForTab.length;
      this.selectDefault = this.sheetNameForTab[index];
      const wSheet: XLSX.WorkSheet = wBook.Sheets[wsname];
      this.localwSheet = wSheet;
      this.sheetCellRange = XLSX.utils.decode_range(wSheet['!ref']);
      this.sheetMaxRow = this.sheetCellRange.e.r;
      this.origExcelData = <AOA>XLSX.utils.sheet_to_json(wSheet, {
        header: 1,
        range: wSheet['!ref'],
        raw: true,
      });
     
      //this.refExcelData = this.origExcelData.slice(1).map(value => Object.assign([], value));
      this.refExcelData = this.origExcelData.map(value => Object.assign([], value));
      /* 抓 range & 清除占存 A->Z */
      this.excelTransformNum = [];
      for (let idx = 0; idx <= this.sheetCellRange.e.c; idx++) {
        this.excelTransformNum[idx] = this.transform(idx);
      }
      /* 加入 order 的佔位(#) */
      this.refExcelData.map(x => x.unshift('#'));
      this.excelTransformNum.unshift('order');
      
      /* 合併成JSON */
      this.excelDataEncodeToJson = this.refExcelData.slice(0).map(item =>
        item.reduce((obj, val, i) => {
          obj[this.excelTransformNum[i]] = val;
          return obj;
        }, {}),
      );
      console.log(this.origExcelData,this.excelTransformNum,this.excelDataEncodeToJson,"origExcelData")
    };
  }
  transform(value) {
    return (value >= 26 ? this.transform(((value / 26) >> 0) - 1) : '') + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[value % 26 >> 0];
  }
  get f1() { return this.formGroup.controls; }
  NewComments()
  {
    const formData = this.formGroup.getRawValue();
    console.log(formData,">>>>>>>>>>>>>>>>formData")
    if (formData.newComments ==null)
    {
    this.commonService.failureMessage("New Comments is required");
    return;
    }
    const reqdata = {
      "comments": formData.newComments,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId),
      "estimationId":parseInt(this.fileId),
      "commentType": "Estimation"
    }
    this.workspace.NewComments(reqdata,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);            
            this.getComments();
            this.resetComments();
          }
          else
          {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });
  }
  ReplyComments(commentsDtlObj){
    const formData = this.formGroup.getRawValue();
    console.log(formData,">>>>>>>>>>>>>>>>formData")
    if (formData.replyComments ==null)
    {
    this.commonService.failureMessage("Reply Comments is required");
    return;
    }
    const reqdata = {
      "comments": formData.replyComments,
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId),
      "estimationId":parseInt(this.fileId),
      "commentId":parseInt(commentsDtlObj.id)
    }
    this.workspace.ReplyComments(reqdata,this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data.result_msg);
            this.getComments();
            this.resetComments();
          }
          else
          {
            this.commonService.failureMessage(data.result_msg);
          }
        },
        error => {
        });
  }
  getComments()
  {
    const reqdata = {
      "micrositeId": parseInt(this.micrositeId),
      "workspaceId": parseInt(this.wsPocId)
    }
    this.workspace.getComments(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS" && data.result_data !=null) {            
            this.commentsDtl = data.result_data;
            return;
          }
        },
        error => {
        });
  }
  resetComments()
  {
    this.formGroup.get("newComments").setValue(null);
    this.formGroup.get("replyComments").setValue(null);
  }
  deleteEstimation(hivezenPhaseDtlobj)
  {
    var reqdata = {
      "micrositeId": this.micrositeId,
      "workspaceId": this.wsPocId,
      "estimationDtlId": hivezenPhaseDtlobj.id,
      "estimationId":hivezenPhaseDtlobj.estimationId
    };
    this.workspace.deleteEstimation(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.result_status.toUpperCase() == "SUCCESS") {
            this.commonService.successMessage(data.result_msg);    
            this.getEstimationDetailInfo();                   
            return;
          }
          else
          {
            this.commonService.failureMessage(data.result_msg); 
          }
        },
        error => {
        });
  }
}

