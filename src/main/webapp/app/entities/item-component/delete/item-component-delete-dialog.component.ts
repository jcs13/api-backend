import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItemComponent } from '../item-component.model';
import { ItemComponentService } from '../service/item-component.service';

@Component({
  templateUrl: './item-component-delete-dialog.component.html',
})
export class ItemComponentDeleteDialogComponent {
  itemComponent?: IItemComponent;

  constructor(protected itemComponentService: ItemComponentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemComponentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
