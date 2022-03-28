import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BlockTransitionComponent } from '../list/block-transition.component';
import { BlockTransitionDetailComponent } from '../detail/block-transition-detail.component';
import { BlockTransitionUpdateComponent } from '../update/block-transition-update.component';
import { BlockTransitionRoutingResolveService } from './block-transition-routing-resolve.service';

const blockTransitionRoute: Routes = [
  {
    path: '',
    component: BlockTransitionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BlockTransitionDetailComponent,
    resolve: {
      blockTransition: BlockTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BlockTransitionUpdateComponent,
    resolve: {
      blockTransition: BlockTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BlockTransitionUpdateComponent,
    resolve: {
      blockTransition: BlockTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blockTransitionRoute)],
  exports: [RouterModule],
})
export class BlockTransitionRoutingModule {}
