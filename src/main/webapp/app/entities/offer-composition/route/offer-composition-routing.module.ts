import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OfferCompositionComponent } from '../list/offer-composition.component';
import { OfferCompositionDetailComponent } from '../detail/offer-composition-detail.component';
import { OfferCompositionUpdateComponent } from '../update/offer-composition-update.component';
import { OfferCompositionRoutingResolveService } from './offer-composition-routing-resolve.service';

const offerCompositionRoute: Routes = [
  {
    path: '',
    component: OfferCompositionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OfferCompositionDetailComponent,
    resolve: {
      offerComposition: OfferCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OfferCompositionUpdateComponent,
    resolve: {
      offerComposition: OfferCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OfferCompositionUpdateComponent,
    resolve: {
      offerComposition: OfferCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(offerCompositionRoute)],
  exports: [RouterModule],
})
export class OfferCompositionRoutingModule {}
