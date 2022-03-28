import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStepDefinition } from '../step-definition.model';
import { StepDefinitionService } from '../service/step-definition.service';

@Component({
  templateUrl: './step-definition-delete-dialog.component.html',
})
export class StepDefinitionDeleteDialogComponent {
  stepDefinition?: IStepDefinition;

  constructor(protected stepDefinitionService: StepDefinitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.stepDefinitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
