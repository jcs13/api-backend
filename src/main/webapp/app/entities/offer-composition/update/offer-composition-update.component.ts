import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOfferComposition, OfferComposition } from '../offer-composition.model';
import { OfferCompositionService } from '../service/offer-composition.service';
import { IOffer } from 'app/entities/offer/offer.model';
import { OfferService } from 'app/entities/offer/service/offer.service';
import { ICourseDefinition } from 'app/entities/course-definition/course-definition.model';
import { CourseDefinitionService } from 'app/entities/course-definition/service/course-definition.service';

@Component({
  selector: 'jhi-offer-composition-update',
  templateUrl: './offer-composition-update.component.html',
})
export class OfferCompositionUpdateComponent implements OnInit {
  isSaving = false;

  offersCollection: IOffer[] = [];
  courseParentsCollection: ICourseDefinition[] = [];
  courseChildrenCollection: ICourseDefinition[] = [];

  editForm = this.fb.group({
    id: [],
    inheritanceOrder: [null, [Validators.required]],
    offer: [],
    courseParent: [],
    courseChild: [],
  });

  constructor(
    protected offerCompositionService: OfferCompositionService,
    protected offerService: OfferService,
    protected courseDefinitionService: CourseDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offerComposition }) => {
      this.updateForm(offerComposition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offerComposition = this.createFromForm();
    if (offerComposition.id !== undefined) {
      this.subscribeToSaveResponse(this.offerCompositionService.update(offerComposition));
    } else {
      this.subscribeToSaveResponse(this.offerCompositionService.create(offerComposition));
    }
  }

  trackOfferById(index: number, item: IOffer): number {
    return item.id!;
  }

  trackCourseDefinitionById(index: number, item: ICourseDefinition): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOfferComposition>>): void {
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

  protected updateForm(offerComposition: IOfferComposition): void {
    this.editForm.patchValue({
      id: offerComposition.id,
      inheritanceOrder: offerComposition.inheritanceOrder,
      offer: offerComposition.offer,
      courseParent: offerComposition.courseParent,
      courseChild: offerComposition.courseChild,
    });

    this.offersCollection = this.offerService.addOfferToCollectionIfMissing(this.offersCollection, offerComposition.offer);
    this.courseParentsCollection = this.courseDefinitionService.addCourseDefinitionToCollectionIfMissing(
      this.courseParentsCollection,
      offerComposition.courseParent
    );
    this.courseChildrenCollection = this.courseDefinitionService.addCourseDefinitionToCollectionIfMissing(
      this.courseChildrenCollection,
      offerComposition.courseChild
    );
  }

  protected loadRelationshipsOptions(): void {
    this.offerService
      .query({ filter: 'offercomposition-is-null' })
      .pipe(map((res: HttpResponse<IOffer[]>) => res.body ?? []))
      .pipe(map((offers: IOffer[]) => this.offerService.addOfferToCollectionIfMissing(offers, this.editForm.get('offer')!.value)))
      .subscribe((offers: IOffer[]) => (this.offersCollection = offers));

    this.courseDefinitionService
      .query({ filter: 'offercomposition-is-null' })
      .pipe(map((res: HttpResponse<ICourseDefinition[]>) => res.body ?? []))
      .pipe(
        map((courseDefinitions: ICourseDefinition[]) =>
          this.courseDefinitionService.addCourseDefinitionToCollectionIfMissing(courseDefinitions, this.editForm.get('courseParent')!.value)
        )
      )
      .subscribe((courseDefinitions: ICourseDefinition[]) => (this.courseParentsCollection = courseDefinitions));

    this.courseDefinitionService
      .query({ filter: 'offercomposition-is-null' })
      .pipe(map((res: HttpResponse<ICourseDefinition[]>) => res.body ?? []))
      .pipe(
        map((courseDefinitions: ICourseDefinition[]) =>
          this.courseDefinitionService.addCourseDefinitionToCollectionIfMissing(courseDefinitions, this.editForm.get('courseChild')!.value)
        )
      )
      .subscribe((courseDefinitions: ICourseDefinition[]) => (this.courseChildrenCollection = courseDefinitions));
  }

  protected createFromForm(): IOfferComposition {
    return {
      ...new OfferComposition(),
      id: this.editForm.get(['id'])!.value,
      inheritanceOrder: this.editForm.get(['inheritanceOrder'])!.value,
      offer: this.editForm.get(['offer'])!.value,
      courseParent: this.editForm.get(['courseParent'])!.value,
      courseChild: this.editForm.get(['courseChild'])!.value,
    };
  }
}
