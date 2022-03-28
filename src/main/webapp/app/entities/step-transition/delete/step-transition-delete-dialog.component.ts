import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStepTransition } from '../step-transition.model';
import { StepTransitionService } from '../service/step-transition.service';

@Component({
  templateUrl: './step-transition-delete-dialog.component.html',
})
export class StepTransitionDeleteDialogComponent {
  stepTransition?: IStepTransition;

  constructor(protected stepTransitionService: StepTransitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.stepTransitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
