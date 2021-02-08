import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkSpaceRoutingModule } from './work-space-routing.module';
import { WorkSpaceListComponent } from './work-space-list/work-space-list.component';
import { WorkSpaceSubNavComponent } from './work-space-sub-nav/work-space-sub-nav.component';
import { WorkSpacePhaseComponent } from './work-space-phase/work-space-phase.component';
import {ConsoleModule} from 'src/app/console/console.module';
import { WorkSpaceLandingComponent } from './work-space-landing/work-space-landing.component';
import { CreateWorkSpaceComponent } from './create-work-space/create-work-space.component';
import { WorkSpaceSummaryComponent } from './work-space-summary/work-space-summary.component';
import { WorkSpaceInitialRequirementComponent } from './work-space-initial-requirement/work-space-initial-requirement.component';
import { WorkSpaceProcessFlowComponent } from './work-space-process-flow/work-space-process-flow.component';
import { WorkSpaceInformationArchitectureComponent } from './work-space-information-architecture/work-space-information-architecture.component';
import { WorkSpaceWireframeComponent } from './work-space-wireframe/work-space-wireframe.component';
import { WorkSpacePrototypeComponent } from './work-space-prototype/work-space-prototype.component';
import { WorkSpacePocReviewComponent } from './work-space-poc-review/work-space-poc-review.component';
import { WorkSpaceDevelopmentDocumentComponent } from './work-space-development-document/work-space-development-document.component';
import { WorkSpaceSubMenuComponent } from './work-space-sub-menu/work-space-sub-menu.component';
import { WorkSpaceTeamComponent } from './work-space-team/work-space-team.component';
import { WorkSpaceDocumentsComponent } from './work-space-documents/work-space-documents.component';
import { WorkSpaceMilestonesComponent } from './work-space-milestones/work-space-milestones.component';
import { WorkSpaceFinancialsComponent } from './work-space-financials/work-space-financials.component';
import { FileValidator } from './work-space-development-document/file-input.validator';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { WorkSpaceUploadImageComponent } from './work-space-upload-image/work-space-upload-image.component';
import { WorkSpacePublishPocComponent } from './work-space-publish-poc/work-space-publish-poc.component';
import { AddInternalResourceComponent } from './add-internal-resource/add-internal-resource.component';
import { WorkSpaceAddEstimationDetailsComponent } from './work-space-add-estimation-details/work-space-add-estimation-details.component';
import { EditCommentsReceivedComponent } from './edit-comments-received/edit-comments-received.component';
import { EditInternalResourceComponent } from './edit-internal-resource/edit-internal-resource.component';
import { EditWorkSpaceComponent } from './edit-work-space/edit-work-space.component';
import { WorkSpaceEditEstimationDetailsComponent } from './work-space-edit-estimation-details/work-space-edit-estimation-details.component';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import {CdkTableModule} from '@angular/cdk/table';
import { ImageModelComponent } from './work-space-wireframe/image-model/image-model.component';
import { PinchComponentComponent } from './work-space-wireframe/pinch-component/pinch-component.component';
import { WorkspaceAiIntegrationComponent } from './workspace-ai-integration/workspace-ai-integration.component';
@NgModule({
  declarations: [WorkSpaceListComponent,WorkSpaceSubNavComponent, WorkSpacePhaseComponent, WorkSpaceLandingComponent, CreateWorkSpaceComponent, WorkSpaceSummaryComponent, WorkSpaceInitialRequirementComponent, WorkSpaceProcessFlowComponent, WorkSpaceInformationArchitectureComponent, WorkSpaceWireframeComponent, WorkSpacePrototypeComponent, WorkSpacePocReviewComponent, WorkSpaceDevelopmentDocumentComponent, WorkSpaceSubMenuComponent, WorkSpaceTeamComponent, WorkSpaceDocumentsComponent, WorkSpaceMilestonesComponent, WorkSpaceFinancialsComponent,FileValidator, WorkSpaceUploadImageComponent, WorkSpacePublishPocComponent, AddInternalResourceComponent, WorkSpaceAddEstimationDetailsComponent, EditCommentsReceivedComponent, EditInternalResourceComponent, EditWorkSpaceComponent, WorkSpaceEditEstimationDetailsComponent, ImageModelComponent, PinchComponentComponent, WorkspaceAiIntegrationComponent],
  imports: [
    CommonModule,
    WorkSpaceRoutingModule,
    ConsoleModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    ReactiveFormsModule,
    NgImageFullscreenViewModule,
    CdkTableModule
  ]
})
export class WorkSpaceModule { }
