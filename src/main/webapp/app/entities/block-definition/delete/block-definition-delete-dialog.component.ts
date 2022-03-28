import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlockDefinition } from '../block-definition.model';
import { BlockDefinitionService } from '../service/block-definition.service';

@Component({
  templateUrl: './block-definition-delete-dialog.component.html',
})
export class BlockDefinitionDeleteDialogComponent {
  blockDefinition?: IBlockDefinition;

  constructor(protected blockDefinitionService: BlockDefinitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.blockDefinitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
