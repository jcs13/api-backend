import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOfferComposition } from '../offer-composition.model';
import { OfferCompositionService } from '../service/offer-composition.service';
import { OfferCompositionDeleteDialogComponent } from '../delete/offer-composition-delete-dialog.component';

@Component({
  selector: 'jhi-offer-composition',
  templateUrl: './offer-composition.component.html',
})
export class OfferCompositionComponent implements OnInit {
  offerCompositions?: IOfferComposition[];
  isLoading = false;

  constructor(protected offerCompositionService: OfferCompositionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.offerCompositionService.query().subscribe({
      next: (res: HttpResponse<IOfferComposition[]>) => {
        this.isLoading = false;
        this.offerCompositions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOfferComposition): number {
    return item.id!;
  }

  delete(offerComposition: IOfferComposition): void {
    const modalRef = this.modalService.open(OfferCompositionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.offerComposition = offerComposition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
