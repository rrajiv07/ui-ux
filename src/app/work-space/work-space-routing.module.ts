import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WorkSpaceLandingComponent} from 'src/app/work-space/work-space-landing/work-space-landing.component';
import { CreateWorkSpaceComponent } from './create-work-space/create-work-space.component';
import {WorkSpaceSubMenuComponent} from './work-space-sub-menu/work-space-sub-menu.component';
import {WorkSpacePhaseComponent} from './work-space-phase/work-space-phase.component';
import {WorkSpaceSummaryComponent} from './work-space-summary/work-space-summary.component';
import {WorkSpaceInitialRequirementComponent} from './work-space-initial-requirement/work-space-initial-requirement.component';
import {WorkSpaceProcessFlowComponent} from './work-space-process-flow/work-space-process-flow.component';
import {WorkSpaceInformationArchitectureComponent} from './work-space-information-architecture/work-space-information-architecture.component';
import {WorkSpaceWireframeComponent} from './work-space-wireframe/work-space-wireframe.component';
import {WorkSpacePrototypeComponent} from './work-space-prototype/work-space-prototype.component';
import {WorkSpacePocReviewComponent} from './work-space-poc-review/work-space-poc-review.component';
import {WorkSpaceDevelopmentDocumentComponent} from './work-space-development-document/work-space-development-document.component';
import {WorkSpaceTeamComponent} from './work-space-team/work-space-team.component';
import {WorkSpaceDocumentsComponent} from './work-space-documents/work-space-documents.component';
import {WorkSpaceMilestonesComponent} from './work-space-milestones/work-space-milestones.component';
import {WorkSpaceFinancialsComponent} from './work-space-financials/work-space-financials.component';
import { WorkSpacePublishPocComponent } from './work-space-publish-poc/work-space-publish-poc.component';
import {NoPageAvailableComponent} from '../console/no-page-available/no-page-available.component';
import { EditWorkSpaceComponent } from './edit-work-space/edit-work-space.component';
import { WorkspaceAiIntegrationComponent } from './workspace-ai-integration/workspace-ai-integration.component';

const routes: Routes = [
  {
    path: 'workspace',
    component: WorkSpaceLandingComponent,
    children: [
      { path: 'createworkspace', component: CreateWorkSpaceComponent}
     ]
  },
  {
    path: 'workspace',
    component: WorkSpaceLandingComponent,
    children: [
      { path: ':subNav/edit-workspace', component: EditWorkSpaceComponent}
     ]
  },
  {
    path: 'workspace',
    component: WorkSpaceLandingComponent,
    children: [
      { path: 'no-workspace', component: NoPageAvailableComponent}
     ]
  },
  {
    path: 'workspace/view',
    component: WorkSpaceLandingComponent,
    children: [
      { path: ':subNav/:wsPocName', component: WorkSpaceSubMenuComponent,
      children: [
        { path: 'edit-workspace', component: EditWorkSpaceComponent},
        { path: 'summary', component: WorkSpaceSummaryComponent},
        { path: 'team', component: WorkSpaceTeamComponent},
        { path: 'documents', component: WorkSpaceDocumentsComponent},
        { path: 'milestones', component: WorkSpaceMilestonesComponent},
        { path: 'financials', component: WorkSpaceFinancialsComponent}    
       ]
      }
     ]
  },
  {
    path: 'workspace/view',
    component: WorkSpaceLandingComponent,
    children: [
      { path: ':subNav/:wsPocName/:boardId/phase', component: WorkSpacePhaseComponent,
      children: [
        /*
        { path: 'initial-requirment/:boardId', component: WorkSpaceInitialRequirementComponent},
        { path: 'process-flow/:boardId', component: WorkSpaceProcessFlowComponent},
        { path: 'information-architecture/:boardId', component: WorkSpaceInformationArchitectureComponent},
        { path: 'wireframe/:boardId', component: WorkSpaceWireframeComponent},
        { path: 'prototype/:boardId', component: WorkSpacePrototypeComponent},
        { path: 'poc-review/:boardId', component: WorkSpacePocReviewComponent},
        { path: 'development-document/:boardId', component: WorkSpaceDevelopmentDocumentComponent}
        */ 
        { path: 'initial-requirment', component: WorkSpaceInitialRequirementComponent},
        { path:'ai-integration',component:WorkspaceAiIntegrationComponent},
        { path: 'process-flow', component: WorkSpaceProcessFlowComponent},
        { path: 'information-architecture', component: WorkSpaceInformationArchitectureComponent},
        { path: 'wireframe', component: WorkSpaceWireframeComponent},
        { path: 'prototype', component: WorkSpacePrototypeComponent},
        { path: 'poc-review', component: WorkSpacePocReviewComponent},
        { path: 'development-document', component: WorkSpaceDevelopmentDocumentComponent},
        { path: 'publish-poc', component: WorkSpacePublishPocComponent}     
       ]
      }
     ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class WorkSpaceRoutingModule { }
