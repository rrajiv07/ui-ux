import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import {ExpandYourTeamComponent} from '../expand-your-team/expand-your-team.component';
import { first } from 'rxjs/operators';
import { SubcriptionService } from '../subcription.service';
import { CommonService } from '@app/utils/common.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-subscription.component.html',
  styleUrls: ['./manage-subscription.component.css']
})
export class ManageSubscriptionComponent implements OnInit {
  inviteMemberDialogPtr: DynamicDialogRef;
  membersList = [];
  planDetails ={};
  micrositeId = localStorage.getItem('micrositeId');
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };
  planType:any;
  totalLicense:any;
  allocatedLicense:any;
  unallocatedLicense:any;
  noOfDaysToSubscriptionElapse:any;
  constructor(private dialogService: DialogService,
    private service: SubcriptionService,
    private common: CommonService,
    private route: Router) { }

  ngOnInit(): void {
    this.getAllMem(this.micrositeId);
    this.getPlanDetails(this.micrositeId);
  }
  getPlanDetails(micrositeId){
    this.service.getPlanDetails(micrositeId, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          // if (data.result_data && Object.keys(data.result_data).length !== 0) {
          if (data.result_status.toUpperCase() === "SUCCESS" && data.result_data !=null) {
            this.planDetails = data.result_data;
            this.planType =this.planDetails['subscriptionPlanType'];
            this.noOfDaysToSubscriptionElapse=this.planDetails['noOfDaysToSubscriptionElapse'];
            this.totalLicense =this.planDetails['totalLicense'];
            this.allocatedLicense =this.planDetails['allocatedLicense'];
            this.unallocatedLicense =this.planDetails['unallocatedLicense'];
            return;
          }
        },
        error => {
        });
  }
  getAllMem(micrositeId){
    this.service.getAllMem(micrositeId, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          // if (data.result_data && Object.keys(data.result_data).length !== 0) {
          if (data.result_status.toUpperCase() === "SUCCESS" && data.result_data !=null) {
            this.membersList = data.result_data;
            return;
          }
        },
        error => {
        });
  }
  inviteMember()
  {
    this.inviteMemberDialogPtr = this.dialogService.open(ExpandYourTeamComponent, {
      //header: 'Setup your account',
      showHeader:false,
      closable:false,
      width: '59%',
      contentStyle: { "max-height": "30%", "overflow": "auto","padding":"0 1.1rem 0rem 1.5rem","border-radius":"10px"},
    });

    this.inviteMemberDialogPtr.onClose.subscribe((data) => {
      this.getAllMem(this.micrositeId);
      this.getPlanDetails(this.micrositeId);
    });

  }
  buyMoreSeats(){
    this.route.navigate(['/subscription/purchase-subcription'], { queryParams: { subscriptionId: this.planDetails['id'] ,totalLicense:this.totalLicense} });
  }
  
  changeTeamStatus(record, status) {
    swal.fire({
      showCancelButton: true,
      title: 'Are you sure want to change status?',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.statusChange(record, status);
      } else if (result.dismiss === swal.DismissReason.cancel) {
        return;
      }
    })
    return;

  }
  statusChange(record, status) {
    const param = {
      "micrositeId": this.micrositeId,
      "userId": record.userId,
      "statusCode": status
    };
    this.service.changeTeamStatus(param, this.header).pipe(first())
      .subscribe(
        (data: any) => {
          if (data['result_status'].toUpperCase() == "SUCCESS") {
            this.getAllMem(this.micrositeId);
            this.getPlanDetails(this.micrositeId);
            this.common.successMessage(data['result_msg']);
            return
          }
          this.common.failureMessage(data.result_msg);
        },
        error => {
        });
  }
}
