import { Component, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal'; 
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-pay-pal-integration',
  templateUrl: './pay-pal-integration.component.html',
  styleUrls: ['./pay-pal-integration.component.css']
})
export class PayPalIntegrationComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  constructor(public dialog: DynamicDialogRef) { }

    ngOnInit(): void {
      this.initConfig();
    }

    private initConfig(): void {
      this.payPalConfig = {
      currency: 'INR',
      clientId: 'ATK3ZKcLYeg5Yo468b3mh_Pj65A66WblRBf6B00sC-dR861n707qiNZZRHgFc2c9uSkJeVdwIiUfroie',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'INR',
              value: '1',
              breakdown: {
                item_total: {
                  currency_code: 'INR',
                  value: '1'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'INR',
                  value: '1',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.Close('Success');
        // this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.Close('failed');
      },
      onError: err => {
        console.log('OnError', err);
        this.Close('failed');
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
    }
    Close(flag) {
      var tmprecords = [{"flag":flag}];
      this.dialog.close(tmprecords)
    }
    
  }