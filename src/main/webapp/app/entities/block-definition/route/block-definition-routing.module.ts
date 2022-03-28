import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BlockDefinitionComponent } from '../list/block-definition.component';
import { BlockDefinitionDetailComponent } from '../detail/block-definition-detail.component';
import { BlockDefinitionUpdateComponent } from '../update/block-definition-update.component';
import { BlockDefinitionRoutingResolveService } from './block-definition-routing-resolve.service';

const blockDefinitionRoute: Routes = [
  {
    path: '',
    component: BlockDefinitionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BlockDefinitionDetailComponent,
    resolve: {
      blockDefinition: BlockDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BlockDefinitionUpdateComponent,
    resolve: {
      blockDefinition: BlockDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BlockDefinitionUpdateComponent,
    resolve: {
      blockDefinition: BlockDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blockDefinitionRoute)],
  exports: [RouterModule],
})
export class BlockDefinitionRoutingModule {}
