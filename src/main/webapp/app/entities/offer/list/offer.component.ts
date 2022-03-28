import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOffer } from '../offer.model';
import { OfferService } from '../service/offer.service';
import { OfferDeleteDialogComponent } from '../delete/offer-delete-dialog.component';

@Component({
  selector: 'jhi-offer',
  templateUrl: './offer.component.html',
})
export class OfferComponent implements OnInit {
  offers?: IOffer[];
  isLoading = false;

  constructor(protected offerService: OfferService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.offerService.query().subscribe({
      next: (res: HttpResponse<IOffer[]>) => {
        this.isLoading = false;
        this.offers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOffer): number {
    return item.id!;
  }

  delete(offer: IOffer): void {
    const modalRef = this.modalService.open(OfferDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.offer = offer;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
