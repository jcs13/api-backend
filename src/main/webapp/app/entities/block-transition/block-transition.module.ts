import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BlockTransitionComponent } from './list/block-transition.component';
import { BlockTransitionDetailComponent } from './detail/block-transition-detail.component';
import { BlockTransitionUpdateComponent } from './update/block-transition-update.component';
import { BlockTransitionDeleteDialogComponent } from './delete/block-transition-delete-dialog.component';
import { BlockTransitionRoutingModule } from './route/block-transition-routing.module';

@NgModule({
  imports: [SharedModule, BlockTransitionRoutingModule],
  declarations: [
    BlockTransitionComponent,
    BlockTransitionDetailComponent,
    BlockTransitionUpdateComponent,
    BlockTransitionDeleteDialogComponent,
  ],
  entryComponents: [BlockTransitionDeleteDialogComponent],
})
export class BlockTransitionModule {}
