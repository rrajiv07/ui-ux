import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SubcriptionService } from '../subcription.service';

@Component({
  selector: 'app-purchase-subscription',
  templateUrl: './purchase-subscription.component.html',
  styleUrls: ['./purchase-subscription.component.css']
})
export class PurchaseSubscriptionComponent implements OnInit {
 seatLists=[];
 basicPMAmt:number=4;
 basicAmt:number=20;
 stdPMAmt:number=8;
 stdAmt:number=40;
 proPMAmt:number=20;
 proAmt:number=100;
 selectedSeatsIndex =0;
 micrositeId = localStorage.getItem('micrositeId');
  token = localStorage.getItem('tempCurrentUserToken');
  header = {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
  };
  subscriptionPlanDetails_data:any;
  subscriptionFeatures:any;
  subscriptionFeatureCnt:any;
  subscriptionPlanDetails:any;
  subscriptionId:any;
  totalLicense:any;
  constructor(private service: SubcriptionService,private actRoute:ActivatedRoute,private route: Router) { }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.subscriptionId = +params['subscriptionId'] || 0;
      this.totalLicense = +params['totalLicense'] || 0;
    });
    this.proto();
    this.getAllPlanDetails();
  }
  getAllPlanDetails(){
    this.service.getAllPlanDetails(this.header)
      .pipe(first())
      .subscribe(
        (data: any) => {
          // if (data.result_data && Object.keys(data.result_data).length !== 0) {
          if (data.result_status.toUpperCase() === "SUCCESS" && data.result_data !=null) {
            this.subscriptionFeatures =data.result_data[0].subscriptionFeatures;
            this.subscriptionFeatureCnt =this.subscriptionFeatures.length -1;
            this.subscriptionPlanDetails =data.result_data;
            this.subscriptionPlanDetails_data =this.subscriptionPlanDetails;
            var rowCnt=1;
            this.subscriptionPlanDetails.forEach(element => {
              element['basicAmt'] = this.getBasicAmount(5,element.monthlyPrice);
              if (rowCnt==1)
              {
                element['style1'] ="plan-basic";
                element['style2'] ="b-all-green";
                element['style3'] ="ft-green";
              }
              if (rowCnt==2)
              {
                element['style1'] ="plan-standard";
                element['style2'] ="b-all-blue";
                element['style3'] ="ft-blue";
              }
              if (rowCnt==3)
              {
                element['style1'] ="plan-pro";
                element['style2'] ="b-all-red";
                element['style3'] ="ft-merown";
              }
              rowCnt=rowCnt+1;
            });
            console.log(this.subscriptionPlanDetails,">>>>>>>>subscriptionPlanDetails")
            return;
          }
        },
        error => {
        });
  }
  proto()
  {
    this.seatLists =[
    {"seats":"5"},
    {"seats":"10"},
    {"seats":"15"},
    {"seats":"20"},
    {"seats":"25"},
    {"seats":"30"},
    {"seats":"40"},
    {"seats":"50"},
    {"seats":"100"}
    ];
    var cnt=0;
    this.seatLists.forEach(element => {
      if (element.seats == this.totalLicense)
      {
        this.selectedSeatsIndex =cnt;
      }
      cnt=cnt+1;
    });
  }
  selectedSeats(item,value,ix)
  {
    this.selectedSeatsIndex =ix;
    /*
    this.basicAmt = this.basicPMAmt* value;
    this.stdAmt = this.stdPMAmt* value;
    this.proAmt = this.proPMAmt* value;
    */
   this.totalLicense =value;
    this.subscriptionPlanDetails_data.forEach(element => {
      element['basicAmt'] = this.getBasicAmount(value,element.monthlyPrice);
    });
    this.subscriptionPlanDetails =this.subscriptionPlanDetails_data;
  }
  getBasicAmount(seats,amt)
  {
    return seats * amt;
  }
  makePayment(planId,basicAmt,planType){
    this.route.navigate(['/subscription/make-payment'], { queryParams: { subscriptionId: this.subscriptionId,id:planId,amount:basicAmt,totalLicense:this.totalLicense,plan:planType} });
  }
}
