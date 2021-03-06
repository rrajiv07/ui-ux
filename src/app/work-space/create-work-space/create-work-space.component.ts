import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { CreateWorkSpaceService } from './create-work-space.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EnvironmentService } from 'src/environments/environment.service';
import { CommonService } from '../../utils/common.service';

@Component({
  selector: 'app-create-work-space',
  templateUrl: './create-work-space.component.html',
  styleUrls: ['./create-work-space.component.css']
})
export class CreateWorkSpaceComponent implements OnInit {
  workSpaceBoardPhaseDescription =
    {
      "Initial Requirement": "Record customer problem your POC intended to solve, the solution brief and why it is important for your customer. Provides design guidelines for development",
      "Process Flow": "Identify the target roles / user personal, the specific actions performed by the users as process flow",
      "Application Flow": "Captures how the users would be navigating through the application and achieve their goals. Various screens and their links are detailed in Application flow",
      "Wireframe": "Screens identified in “Application Flow” gets their skeleton structure. What controls comes in and they are combined to deliver the end result is captured as WireFrame",
      "Prototype": "The mock Application comes to life in a colourful way. UX designs, colourful themes, Usability are considered to make the application unique"
    };
  formGroup: FormGroup;
  workspaceBoardsData = [];
  pocBoardsList = [];
  submitted: boolean = false;
  currentDate = new Date();
  constructor(private route: Router, private formBuilder: FormBuilder, private Service: CreateWorkSpaceService,
    private environmentService: EnvironmentService, private commonService: CommonService) {
  }
  ngOnInit(): void {
    //this.initForm();  
    this.init();
    this.getWorkSpaceBoards(localStorage.getItem('tempCurrentUserToken'));
  }
  init() {
    this.formGroup = this.formBuilder.group({
      workspaceBoards: new FormArray([]),
      wsName: ['', Validators.required],
      wsDesc: ['', Validators.required],
    });
  }

  get workspaceBoardsFormArray() {
    return this.formGroup.controls.workspaceBoards as FormArray;
  }
  private addCheckboxes() {
    this.workspaceBoardsData.forEach(element => {
      if (element.id > 5)
      this.workspaceBoardsFormArray.push(new FormControl(true))
      else
      this.workspaceBoardsFormArray.push(new FormControl(false))
  });
   //this.workspaceBoardsData.forEach(() => this.workspaceBoardsFormArray.push(new FormControl(false)));
  }
  saveWorkSpace() {
    const formData = this.formGroup.getRawValue();
    this.pocBoardsList =[];
    var pocBoardsList = this.formGroup.value.workspaceBoards
      .map((v, i) => v ? this.workspaceBoardsData[i] : null)
      .filter(v => v !== null);
    pocBoardsList.forEach(element => {
      const outputObj ={};
      outputObj["phaseId"]=element.id;
      outputObj["custPhaseName"]=element.name; 
      this.pocBoardsList.push(outputObj)
    }); 
    console.log(this.pocBoardsList);
    if(this.pocBoardsList.length ==3)
    {
      this.commonService.failureMessage("Select atleast one phase.");
      return;
    }
    const reqdata = {
      "wsName": formData.wsName,
      "wsDesc": formData.wsDesc,
      "micrositeId": localStorage.getItem('micrositeId'),
      "phaseList": this.pocBoardsList
    };
    console.log(reqdata);
    const token = localStorage.getItem('tempCurrentUserToken');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    this.Service.createWorkspace(reqdata, header)
      .pipe(first())
      .subscribe(
        data => {
          if (data['result_status'].toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data['result_msg']);
            var wsPocId = data['result_data'].id;
            var wsName = data['result_data'].wsName;
            //localStorage.setItem('workspaceCreate','list');
            //localStorage.setItem('SubMenuVar','summary');
            this.environmentService.setPOCId(wsPocId);
            this.route.navigateByUrl('/workspace/view/' + wsPocId + '/' + wsName + '/summary');
            return;
          }
          else {
            this.commonService.failureMessage(data['result_msg']);
          }
        },
        error => {
        });



  }
  initForm() {
    this.formGroup = this.formBuilder.group({
      wsName: ['', Validators.required],
      wsDesc: ['', Validators.required],
      initialRequirement: ['IR_V1'],
      processFlow: ['PF_V1'],
      applicationFlow: ['AF_V1'],
      wireframe: ['W_V1'],
      prototype: ['P_V1'],
      pocreview: ['PR_V1'],
      developmentDocuments: ['DD_V1'],
      publishpoc: ['PP_V1']
    });
  }
  save(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    }
    this.saveWorkSpace();
  }
  save1() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    }
    const formData = this.formGroup.getRawValue();
    this.pocBoardsList = [];

    if (this.formGroup.get("initialRequirement").value != null && this.formGroup.get("initialRequirement").value != "") {
      this.pocBoardsList.push(this.getWorkSpaceBoardObj('Initial Requirement', this.formGroup.get("initialRequirement").value));
    }
    if (this.formGroup.get("processFlow").value != null && this.formGroup.get("processFlow").value != "") {
      this.pocBoardsList.push(this.getWorkSpaceBoardObj('Process Flow', this.formGroup.get("processFlow").value));
    }
    if (this.formGroup.get("applicationFlow").value != null && this.formGroup.get("applicationFlow").value != "") {
      this.pocBoardsList.push(this.getWorkSpaceBoardObj('Application Flow', this.formGroup.get("applicationFlow").value));
    }
    if (this.formGroup.get("wireframe").value != null && this.formGroup.get("wireframe").value != "") {
      this.pocBoardsList.push(this.getWorkSpaceBoardObj('Wireframe', this.formGroup.get("wireframe").value));
    }
    if (this.formGroup.get("prototype").value != null && this.formGroup.get("prototype").value != "") {
      this.pocBoardsList.push(this.getWorkSpaceBoardObj('Prototype', this.formGroup.get("prototype").value));
    }
    if (this.formGroup.get("pocreview").value != null && this.formGroup.get("pocreview").value != "") {
      this.pocBoardsList.push(this.getWorkSpaceBoardObj('POC Review', this.formGroup.get("pocreview").value));
    }
    if (this.formGroup.get("developmentDocuments").value != null && this.formGroup.get("developmentDocuments").value != "") {
      this.pocBoardsList.push(this.getWorkSpaceBoardObj('Development Documents', this.formGroup.get("developmentDocuments").value));
    }
    if (this.formGroup.get("publishpoc").value != null && this.formGroup.get("publishpoc").value != "") {
      this.pocBoardsList.push(this.getWorkSpaceBoardObj('Publish POC', this.formGroup.get("publishpoc").value));
    }
    if (this.pocBoardsList.length == 0) {
      this.commonService.failureMessage('Please select atleast one workspace boards.');
      return;
    }

    const reqdata = {
      "wsName": formData.wsName,
      "wsDesc": formData.wsDesc,
      "micrositeId": localStorage.getItem('micrositeId'),
      "phaseList": this.pocBoardsList
    };

    console.log(reqdata);
    const token = localStorage.getItem('tempCurrentUserToken');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    this.Service.createWorkspace(reqdata, header)
      .pipe(first())
      .subscribe(
        data => {
          if (data['result_status'].toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data['result_msg']);
            var wsPocId = data['result_data'].id;
            var wsName = data['result_data'].wsName;
            //localStorage.setItem('workspaceCreate','list');
            //localStorage.setItem('SubMenuVar','summary');
            this.environmentService.setPOCId(wsPocId);
            this.route.navigateByUrl('/workspace/view/' + wsPocId + '/' + wsName + '/summary');
            return;
          }
          else {
            this.commonService.failureMessage(data['result_msg']);
          }
        },
        error => {
        });

    //this.route.navigateByUrl('/workspace/view/w1/summary');
  }
  getWorkSpaceBoards(token: any) {
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };

    this.Service.getWorkSpaceboards(header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.workspaceBoardsData = data.result_data;
          this.addCheckboxes();
          //console.log(this.workspaceBoardsData,this.getWorkSpaceBoardAvailablity('Process Flow'),">>>>>>>>>this.workspaceBoardsData")

        },
        error => {
        });
  }
  get f1() { return this.formGroup.controls; }
  getWorkSpaceBoardAvailablity(boardName) {
    if (this.getWorkSpaceBoardExists(boardName)) {
      /*
      if (boardName == 'Initial Requirement')
      {
        this.formGroup.get("initialRequirement").setValidators(Validators.required);
      }
      if (boardName == 'Process Flow')
      {
        this.formGroup.get("processFlow").setValidators(Validators.required);
      }
      if (boardName == 'Application Flow')
      {
        this.formGroup.get("applicationFlow").setValidators(Validators.required);
      }
      if (boardName == 'Wireframe')
      {
        this.formGroup.get("wireframe").setValidators(Validators.required);
      }
      if (boardName == 'Prototype')
      {
        this.formGroup.get("prototype").setValidators(Validators.required);
      }
      if (boardName == 'POC Review')
      {
        this.formGroup.get("pocreview").setValidators(Validators.required);
      }
      if (boardName == 'Development Documents')
      {
        this.formGroup.get("developmentDocuments").setValidators(Validators.required);
      }
      if (boardName == 'Publish POC')
      {
        this.formGroup.get("publishpoc").setValidators(Validators.required);
      }*/
    }
    return this.getWorkSpaceBoardExists(boardName);
  }
  getWorkSpaceBoardExists(boardName) {
    return this.workspaceBoardsData.some(function (el) {
      return el.name == boardName;
    });
  }
  getWorkSpaceBoardObj(boardName, desc) {
    const outputObj = {};
    this.workspaceBoardsData.some(function (el) {
      if (el.name == boardName) {
        outputObj["phaseId"] = el.id;
        outputObj["custPhaseName"] = boardName;
        //outputObj["custPhaseName"]=desc;
      }
    });
    return outputObj;
  }
  deletePhase(phase, control) {
    const filteredPhase = this.workspaceBoardsData.filter((item) => item.name !== phase);
    this.workspaceBoardsData = filteredPhase.slice();
    this.formGroup.get(control).setValue(null);
  }
  renamePhase(record){
    record["disabled"]='N';
  }
  removePhase(record,phaseName,ix){
   this.workspaceBoardsData.splice(ix,1);
  }
  changePhaseEvent(event,record){    
   record["name"]=event.target.value;
   record["disabled"]=null;
  }
  createWorkSpace() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    }

    const formData = this.formGroup.getRawValue();
    this.pocBoardsList =[];
    var pocBoardsList = this.workspaceBoardsData;
    pocBoardsList.forEach(element => {
      const outputObj ={};
      outputObj["phaseId"]=element.id;
      outputObj["custPhaseName"]=element.name; 
      this.pocBoardsList.push(outputObj)
    }); 
    console.log(this.pocBoardsList);
    const reqdata = {
      "wsName": formData.wsName,
      "wsDesc": formData.wsDesc,
      "micrositeId": localStorage.getItem('micrositeId'),
      "phaseList": this.pocBoardsList
    };
    console.log(reqdata);
    const token = localStorage.getItem('tempCurrentUserToken');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    this.Service.createWorkspace(reqdata, header)
      .pipe(first())
      .subscribe(
        data => {
          if (data['result_status'].toUpperCase() === 'SUCCESS') {
            this.commonService.successMessage(data['result_msg']);
            var wsPocId = data['result_data'].id;
            var wsName = data['result_data'].wsName;
            //localStorage.setItem('workspaceCreate','list');
            //localStorage.setItem('SubMenuVar','summary');
            this.environmentService.setPOCId(wsPocId);
            this.route.navigateByUrl('/workspace/view/' + wsPocId + '/' + wsName + '/summary');
            return;
          }
          else {
            this.commonService.failureMessage(data['result_msg']);
          }
        },
        error => {
        });

  }
}
