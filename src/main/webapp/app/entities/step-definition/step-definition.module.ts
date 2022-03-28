import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StepDefinitionComponent } from './list/step-definition.component';
import { StepDefinitionDetailComponent } from './detail/step-definition-detail.component';
import { StepDefinitionUpdateComponent } from './update/step-definition-update.component';
import { StepDefinitionDeleteDialogComponent } from './delete/step-definition-delete-dialog.component';
import { StepDefinitionRoutingModule } from './route/step-definition-routing.module';

@NgModule({
  imports: [SharedModule, StepDefinitionRoutingModule],
  declarations: [
    StepDefinitionComponent,
    StepDefinitionDetailComponent,
    StepDefinitionUpdateComponent,
    StepDefinitionDeleteDialogComponent,
  ],
  entryComponents: [StepDefinitionDeleteDialogComponent],
})
export class StepDefinitionModule {}
