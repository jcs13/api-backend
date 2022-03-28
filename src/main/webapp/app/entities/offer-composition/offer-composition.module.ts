import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OfferCompositionComponent } from './list/offer-composition.component';
import { OfferCompositionDetailComponent } from './detail/offer-composition-detail.component';
import { OfferCompositionUpdateComponent } from './update/offer-composition-update.component';
import { OfferCompositionDeleteDialogComponent } from './delete/offer-composition-delete-dialog.component';
import { OfferCompositionRoutingModule } from './route/offer-composition-routing.module';

@NgModule({
  imports: [SharedModule, OfferCompositionRoutingModule],
  declarations: [
    OfferCompositionComponent,
    OfferCompositionDetailComponent,
    OfferCompositionUpdateComponent,
    OfferCompositionDeleteDialogComponent,
  ],
  entryComponents: [OfferCompositionDeleteDialogComponent],
})
export class OfferCompositionModule {}
