import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOfferComposition } from '../offer-composition.model';

@Component({
  selector: 'jhi-offer-composition-detail',
  templateUrl: './offer-composition-detail.component.html',
})
export class OfferCompositionDetailComponent implements OnInit {
  offerComposition: IOfferComposition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offerComposition }) => {
      this.offerComposition = offerComposition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
