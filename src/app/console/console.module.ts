import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsoleRoutingModule } from './console-routing.module';
import { HeaderPanelComponent } from './header-panel/header-panel.component';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { SignUpSetUpAccountComponent } from './sign-up-set-up-account/sign-up-set-up-account.component';
import { SignUpInviteTeamComponent } from './sign-up-invite-team/sign-up-invite-team.component';
import { SignUpSucessComponent } from './sign-up-sucess/sign-up-sucess.component';
import { SignUpEmailComponent } from './sign-up-email/sign-up-email.component';
import { NoPageAvailableComponent } from './no-page-available/no-page-available.component';


@NgModule({
  declarations: [HeaderPanelComponent, SignUpSetUpAccountComponent, SignUpInviteTeamComponent, SignUpSucessComponent, SignUpEmailComponent, NoPageAvailableComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConsoleRoutingModule
  ],
  exports:[HeaderPanelComponent],
  providers:[DynamicDialogRef, DynamicDialogConfig, DialogService]
})
export class ConsoleModule { }
