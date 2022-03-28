import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICourseDefinition } from '../course-definition.model';
import { CourseDefinitionService } from '../service/course-definition.service';

@Component({
  templateUrl: './course-definition-delete-dialog.component.html',
})
export class CourseDefinitionDeleteDialogComponent {
  courseDefinition?: ICourseDefinition;

  constructor(protected courseDefinitionService: CourseDefinitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.courseDefinitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
