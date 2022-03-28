import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOfferComposition } from '../offer-composition.model';
import { OfferCompositionService } from '../service/offer-composition.service';

@Component({
  templateUrl: './offer-composition-delete-dialog.component.html',
})
export class OfferCompositionDeleteDialogComponent {
  offerComposition?: IOfferComposition;

  constructor(protected offerCompositionService: OfferCompositionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.offerCompositionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
