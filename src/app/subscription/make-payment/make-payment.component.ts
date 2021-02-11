import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SubcriptionService } from '../subcription.service';
import { CommonService } from '@app/utils/common.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {PayPalIntegrationComponent} from '../pay-pal-integration/pay-pal-integration.component';
@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.css']
})
export class MakePaymentComponent implements OnInit {
  paypalDialogPtr: DynamicDialogRef;
  subscriptionId:any;
  totalLicense:any;
  basicAmount:any;
  planId:any;
  planType:any;
  micrositeId = localStorage.getItem('micrositeId');
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };
  constructor(private route: Router,private actRoute:ActivatedRoute,private service: SubcriptionService,
    private common: CommonService,private dialogService: DialogService) { }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(params => {
      console.log(params,">>>>>>>>>>>>>>>>params")
      // Defaults to 0 if no query param provided.
      this.subscriptionId = params['subscriptionId'] || 0;
      this.totalLicense = params['totalLicense'] || 0;
      this.basicAmount = params['amount'] || 0;
      this.planId = params['id'] || 0;
      this.planType = params['plan'];
    });
    console.log(this.planType,">>>>>>>>>>>>>>>>>this.planType")
  }
  pay(){
    const reqdata = {
      "subscriptionId": parseInt(this.planId),
      "totalLicense": parseInt(this.totalLicense),
      "micrositeId": parseInt(this.micrositeId),
      "id": parseInt(this.subscriptionId),
      "subscriptionPeriod": "Monthly"
    }
    this.service.makePayment(reqdata, this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          // if (data.result_data && Object.keys(data.result_data).length !== 0) {
          if (data.result_status.toUpperCase() === 'SUCCESS') {
            this.common.successMessage(data.result_msg);
            this.route.navigateByUrl('/subscription/manage-subscription');
            return;
          }
          this.common.failureMessage(data.result_msg);
        },
        error => {
        });
    
  }
  back()
  {
    this.route.navigate(['/subscription/purchase-subcription'], { queryParams: { subscriptionId: this.subscriptionId,totalLicense:this.totalLicense} });
  }
  paypal()
  {
    this.paypalDialogPtr = this.dialogService.open(PayPalIntegrationComponent, {
      showHeader: false,
      closable: false,
      width: '25%',
      contentStyle: { "max-height": "30%", "overflow": "auto", "padding": "0 1.1rem 0rem 1.5rem", "border-radius": "10px" },
    });
    this.paypalDialogPtr.onClose.subscribe((data) => {
      this.common.successMessage("Payment Successful");
    });
  }
}
