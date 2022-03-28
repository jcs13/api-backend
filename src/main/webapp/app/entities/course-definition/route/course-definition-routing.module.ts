import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CourseDefinitionComponent } from '../list/course-definition.component';
import { CourseDefinitionDetailComponent } from '../detail/course-definition-detail.component';
import { CourseDefinitionUpdateComponent } from '../update/course-definition-update.component';
import { CourseDefinitionRoutingResolveService } from './course-definition-routing-resolve.service';

const courseDefinitionRoute: Routes = [
  {
    path: '',
    component: CourseDefinitionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CourseDefinitionDetailComponent,
    resolve: {
      courseDefinition: CourseDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CourseDefinitionUpdateComponent,
    resolve: {
      courseDefinition: CourseDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CourseDefinitionUpdateComponent,
    resolve: {
      courseDefinition: CourseDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(courseDefinitionRoute)],
  exports: [RouterModule],
})
export class CourseDefinitionRoutingModule {}
