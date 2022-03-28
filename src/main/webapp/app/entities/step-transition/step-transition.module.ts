import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StepTransitionComponent } from './list/step-transition.component';
import { StepTransitionDetailComponent } from './detail/step-transition-detail.component';
import { StepTransitionUpdateComponent } from './update/step-transition-update.component';
import { StepTransitionDeleteDialogComponent } from './delete/step-transition-delete-dialog.component';
import { StepTransitionRoutingModule } from './route/step-transition-routing.module';

@NgModule({
  imports: [SharedModule, StepTransitionRoutingModule],
  declarations: [
    StepTransitionComponent,
    StepTransitionDetailComponent,
    StepTransitionUpdateComponent,
    StepTransitionDeleteDialogComponent,
  ],
  entryComponents: [StepTransitionDeleteDialogComponent],
})
export class StepTransitionModule {}
