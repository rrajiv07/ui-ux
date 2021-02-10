import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WorkSpaceLandingComponent} from 'src/app/work-space/work-space-landing/work-space-landing.component';
import { PageRedirectComponent } from './page-redirect/page-redirect.component';

const routes: Routes = [
  {
    path: 'user',
    component: WorkSpaceLandingComponent,
    children: [
      { path: 'page-redirect', component: PageRedirectComponent}
     ]
  },
  {
    path: 'page-redirect',
    component: PageRedirectComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsoleRoutingModule { }
