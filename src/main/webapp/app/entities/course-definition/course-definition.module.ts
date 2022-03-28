import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CourseDefinitionComponent } from './list/course-definition.component';
import { CourseDefinitionDetailComponent } from './detail/course-definition-detail.component';
import { CourseDefinitionUpdateComponent } from './update/course-definition-update.component';
import { CourseDefinitionDeleteDialogComponent } from './delete/course-definition-delete-dialog.component';
import { CourseDefinitionRoutingModule } from './route/course-definition-routing.module';

@NgModule({
  imports: [SharedModule, CourseDefinitionRoutingModule],
  declarations: [
    CourseDefinitionComponent,
    CourseDefinitionDetailComponent,
    CourseDefinitionUpdateComponent,
    CourseDefinitionDeleteDialogComponent,
  ],
  entryComponents: [CourseDefinitionDeleteDialogComponent],
})
export class CourseDefinitionModule {}
