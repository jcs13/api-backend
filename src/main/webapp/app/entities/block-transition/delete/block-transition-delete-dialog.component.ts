import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlockTransition } from '../block-transition.model';
import { BlockTransitionService } from '../service/block-transition.service';

@Component({
  templateUrl: './block-transition-delete-dialog.component.html',
})
export class BlockTransitionDeleteDialogComponent {
  blockTransition?: IBlockTransition;

  constructor(protected blockTransitionService: BlockTransitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.blockTransitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
