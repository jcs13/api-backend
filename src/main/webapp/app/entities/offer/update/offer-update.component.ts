import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOffer, Offer } from '../offer.model';
import { OfferService } from '../service/offer.service';
import { IBusinessUnit } from 'app/entities/business-unit/business-unit.model';
import { BusinessUnitService } from 'app/entities/business-unit/service/business-unit.service';

@Component({
  selector: 'jhi-offer-update',
  templateUrl: './offer-update.component.html',
})
export class OfferUpdateComponent implements OnInit {
  isSaving = false;

  businessUnitsSharedCollection: IBusinessUnit[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    businessUnit: [],
  });

  constructor(
    protected offerService: OfferService,
    protected businessUnitService: BusinessUnitService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offer }) => {
      this.updateForm(offer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offer = this.createFromForm();
    if (offer.id !== undefined) {
      this.subscribeToSaveResponse(this.offerService.update(offer));
    } else {
      this.subscribeToSaveResponse(this.offerService.create(offer));
    }
  }

  trackBusinessUnitById(index: number, item: IBusinessUnit): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffer>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(offer: IOffer): void {
    this.editForm.patchValue({
      id: offer.id,
      name: offer.name,
      label: offer.label,
      businessUnit: offer.businessUnit,
    });

    this.businessUnitsSharedCollection = this.businessUnitService.addBusinessUnitToCollectionIfMissing(
      this.businessUnitsSharedCollection,
      offer.businessUnit
    );
  }

  protected loadRelationshipsOptions(): void {
    this.businessUnitService
      .query()
      .pipe(map((res: HttpResponse<IBusinessUnit[]>) => res.body ?? []))
      .pipe(
        map((businessUnits: IBusinessUnit[]) =>
          this.businessUnitService.addBusinessUnitToCollectionIfMissing(businessUnits, this.editForm.get('businessUnit')!.value)
        )
      )
      .subscribe((businessUnits: IBusinessUnit[]) => (this.businessUnitsSharedCollection = businessUnits));
  }

  protected createFromForm(): IOffer {
    return {
      ...new Offer(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      businessUnit: this.editForm.get(['businessUnit'])!.value,
    };
  }
}
