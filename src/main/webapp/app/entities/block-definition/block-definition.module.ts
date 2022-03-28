import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BlockDefinitionComponent } from './list/block-definition.component';
import { BlockDefinitionDetailComponent } from './detail/block-definition-detail.component';
import { BlockDefinitionUpdateComponent } from './update/block-definition-update.component';
import { BlockDefinitionDeleteDialogComponent } from './delete/block-definition-delete-dialog.component';
import { BlockDefinitionRoutingModule } from './route/block-definition-routing.module';

@NgModule({
  imports: [SharedModule, BlockDefinitionRoutingModule],
  declarations: [
    BlockDefinitionComponent,
    BlockDefinitionDetailComponent,
    BlockDefinitionUpdateComponent,
    BlockDefinitionDeleteDialogComponent,
  ],
  entryComponents: [BlockDefinitionDeleteDialogComponent],
})
export class BlockDefinitionModule {}
