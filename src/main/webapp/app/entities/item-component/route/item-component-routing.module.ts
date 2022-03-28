import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItemComponentComponent } from '../list/item-component.component';
import { ItemComponentDetailComponent } from '../detail/item-component-detail.component';
import { ItemComponentUpdateComponent } from '../update/item-component-update.component';
import { ItemComponentRoutingResolveService } from './item-component-routing-resolve.service';

const itemComponentRoute: Routes = [
  {
    path: '',
    component: ItemComponentComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItemComponentDetailComponent,
    resolve: {
      itemComponent: ItemComponentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemComponentUpdateComponent,
    resolve: {
      itemComponent: ItemComponentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemComponentUpdateComponent,
    resolve: {
      itemComponent: ItemComponentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itemComponentRoute)],
  exports: [RouterModule],
})
export class ItemComponentRoutingModule {}
