import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StepDefinitionComponent } from '../list/step-definition.component';
import { StepDefinitionDetailComponent } from '../detail/step-definition-detail.component';
import { StepDefinitionUpdateComponent } from '../update/step-definition-update.component';
import { StepDefinitionRoutingResolveService } from './step-definition-routing-resolve.service';

const stepDefinitionRoute: Routes = [
  {
    path: '',
    component: StepDefinitionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StepDefinitionDetailComponent,
    resolve: {
      stepDefinition: StepDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StepDefinitionUpdateComponent,
    resolve: {
      stepDefinition: StepDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StepDefinitionUpdateComponent,
    resolve: {
      stepDefinition: StepDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(stepDefinitionRoute)],
  exports: [RouterModule],
})
export class StepDefinitionRoutingModule {}
