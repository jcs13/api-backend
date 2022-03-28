import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StepTransitionComponent } from '../list/step-transition.component';
import { StepTransitionDetailComponent } from '../detail/step-transition-detail.component';
import { StepTransitionUpdateComponent } from '../update/step-transition-update.component';
import { StepTransitionRoutingResolveService } from './step-transition-routing-resolve.service';

const stepTransitionRoute: Routes = [
  {
    path: '',
    component: StepTransitionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StepTransitionDetailComponent,
    resolve: {
      stepTransition: StepTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StepTransitionUpdateComponent,
    resolve: {
      stepTransition: StepTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StepTransitionUpdateComponent,
    resolve: {
      stepTransition: StepTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(stepTransitionRoute)],
  exports: [RouterModule],
})
export class StepTransitionRoutingModule {}
