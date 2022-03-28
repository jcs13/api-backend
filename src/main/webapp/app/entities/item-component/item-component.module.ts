import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItemComponentComponent } from './list/item-component.component';
import { ItemComponentDetailComponent } from './detail/item-component-detail.component';
import { ItemComponentUpdateComponent } from './update/item-component-update.component';
import { ItemComponentDeleteDialogComponent } from './delete/item-component-delete-dialog.component';
import { ItemComponentRoutingModule } from './route/item-component-routing.module';

@NgModule({
  imports: [SharedModule, ItemComponentRoutingModule],
  declarations: [ItemComponentComponent, ItemComponentDetailComponent, ItemComponentUpdateComponent, ItemComponentDeleteDialogComponent],
  entryComponents: [ItemComponentDeleteDialogComponent],
})
export class ItemComponentModule {}
