import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { first } from 'rxjs/operators';
import {  CommonService} from '../../utils/common.service';
import { WorkSpaceInitialRequirementService } from './work-space-initial-requirement.component.service';
@Component({
  selector: 'app-work-space-initial-requirement',
  templateUrl: './work-space-initial-requirement.component.html',
  styleUrls: ['./work-space-initial-requirement.component.css']
})
export class WorkSpaceInitialRequirementComponent implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  message: string;
  isEditButton = false;
  isButtonText = 'Save';
  initialRequirementId:any=null;
  boardMapId: any;
  PocId: any;
  micrositeId:any;
  wsPocName:any;
  constructor(private formBuilder: FormBuilder,
    private wpirService: WorkSpaceInitialRequirementService,
    private commonService: CommonService,
    private actRoute: ActivatedRoute,
    private route:Router) { }

  ngOnInit(): void {
    this.getParams();
    this.initForm();

    this.initInitialRequirement();
  }
  initForm() {
    this.formGroup = this.formBuilder.group({
      problemStatement: ['', Validators.required],
      proposedSolution: ['', Validators.required],
      valueCreation: ['', [Validators.required]]
    });
  }
  initInitialRequirement() {
    const token = localStorage.getItem('tempCurrentUserToken');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    this.wpirService.initInitialRequirement(this.micrositeId,this.PocId,this.boardMapId,header).then(
      data => {
        var repsonse_data= data['result_data'];
        if (repsonse_data != null)
        {
        this.initialRequirementId = repsonse_data.id;
        this.formGroup.patchValue(repsonse_data);
        }
      },
      error => {
      });
  }



  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    }
    const formData = this.formGroup.getRawValue();
    var reqdata :any={};
    if (this.initialRequirementId !=null)
    {
      this.isEditButton=true;
      reqdata = {
        "micrositeId":localStorage.getItem('micrositeId'),
        "workspaceId": this.PocId,
        "workspaceDtlId": this.boardMapId,      
        "problemStatement":formData.problemStatement,
        "proposedSolution":formData.proposedSolution,
        "valueCreation":formData.valueCreation,
        "id":this.initialRequirementId
      };
    }
    else
    {
    reqdata = {
      "micrositeId":localStorage.getItem('micrositeId'),
      "workspaceId": this.PocId,
      "workspaceDtlId": this.boardMapId,      
      "problemStatement":formData.problemStatement,
      "proposedSolution":formData.proposedSolution,
      "valueCreation":formData.valueCreation
    };
  }

    const token = localStorage.getItem('tempCurrentUserToken');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    };
    
    this.wpirService.formDataSave(reqdata, header, this.isEditButton).pipe(first())
      .subscribe(
        (data: any) => {
          if (data['result_status'].toUpperCase() == "SUCCESS") {
            this.submitted = false;
            //this.formGroup.reset();
            this.commonService.successMessage(data['result_msg']);
          }

        },
        error => {
        });

  }
  get f1() { return this.formGroup.controls; }
  getParams() {
    this.micrositeId =localStorage.getItem('micrositeId');
    this.actRoute.parent.paramMap
      .subscribe(params => {
        this.boardMapId = params['params'].boardId;
        this.PocId = params['params'].subNav;
        this.wsPocName =params['wsPocName'].subNav;
      });
  }
  suggestStyleGuide(){
    this.route.navigateByUrl("/workspace/view/"+this.PocId + '/' + this.wsPocName + '/' + this.boardMapId + '/phase/ai-integration');
  }
}
