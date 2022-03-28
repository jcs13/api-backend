import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OfferComponent } from '../list/offer.component';
import { OfferDetailComponent } from '../detail/offer-detail.component';
import { OfferUpdateComponent } from '../update/offer-update.component';
import { OfferRoutingResolveService } from './offer-routing-resolve.service';

const offerRoute: Routes = [
  {
    path: '',
    component: OfferComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OfferDetailComponent,
    resolve: {
      offer: OfferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OfferUpdateComponent,
    resolve: {
      offer: OfferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OfferUpdateComponent,
    resolve: {
      offer: OfferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(offerRoute)],
  exports: [RouterModule],
})
export class OfferRoutingModule {}
