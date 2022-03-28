import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IStepTransition, StepTransition } from '../step-transition.model';
import { StepTransitionService } from '../service/step-transition.service';
import { ICourseDefinition } from 'app/entities/course-definition/course-definition.model';
import { CourseDefinitionService } from 'app/entities/course-definition/service/course-definition.service';
import { IStepDefinition } from 'app/entities/step-definition/step-definition.model';
import { StepDefinitionService } from 'app/entities/step-definition/service/step-definition.service';

@Component({
  selector: 'jhi-step-transition-update',
  templateUrl: './step-transition-update.component.html',
})
export class StepTransitionUpdateComponent implements OnInit {
  isSaving = false;

  courseDefinitionsCollection: ICourseDefinition[] = [];
  currentsCollection: IStepDefinition[] = [];
  nextsCollection: IStepDefinition[] = [];

  editForm = this.fb.group({
    id: [],
    transition: [null, [Validators.required]],
    courseDefinition: [],
    current: [],
    next: [],
  });

  constructor(
    protected stepTransitionService: StepTransitionService,
    protected courseDefinitionService: CourseDefinitionService,
    protected stepDefinitionService: StepDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stepTransition }) => {
      this.updateForm(stepTransition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stepTransition = this.createFromForm();
    if (stepTransition.id !== undefined) {
      this.subscribeToSaveResponse(this.stepTransitionService.update(stepTransition));
    } else {
      this.subscribeToSaveResponse(this.stepTransitionService.create(stepTransition));
    }
  }

  trackCourseDefinitionById(index: number, item: ICourseDefinition): number {
    return item.id!;
  }

  trackStepDefinitionById(index: number, item: IStepDefinition): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStepTransition>>): void {
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

  protected updateForm(stepTransition: IStepTransition): void {
    this.editForm.patchValue({
      id: stepTransition.id,
      transition: stepTransition.transition,
      courseDefinition: stepTransition.courseDefinition,
      current: stepTransition.current,
      next: stepTransition.next,
    });

    this.courseDefinitionsCollection = this.courseDefinitionService.addCourseDefinitionToCollectionIfMissing(
      this.courseDefinitionsCollection,
      stepTransition.courseDefinition
    );
    this.currentsCollection = this.stepDefinitionService.addStepDefinitionToCollectionIfMissing(
      this.currentsCollection,
      stepTransition.current
    );
    this.nextsCollection = this.stepDefinitionService.addStepDefinitionToCollectionIfMissing(this.nextsCollection, stepTransition.next);
  }

  protected loadRelationshipsOptions(): void {
    this.courseDefinitionService
      .query({ filter: 'steptransition-is-null' })
      .pipe(map((res: HttpResponse<ICourseDefinition[]>) => res.body ?? []))
      .pipe(
        map((courseDefinitions: ICourseDefinition[]) =>
          this.courseDefinitionService.addCourseDefinitionToCollectionIfMissing(
            courseDefinitions,
            this.editForm.get('courseDefinition')!.value
          )
        )
      )
      .subscribe((courseDefinitions: ICourseDefinition[]) => (this.courseDefinitionsCollection = courseDefinitions));

    this.stepDefinitionService
      .query({ filter: 'steptransition-is-null' })
      .pipe(map((res: HttpResponse<IStepDefinition[]>) => res.body ?? []))
      .pipe(
        map((stepDefinitions: IStepDefinition[]) =>
          this.stepDefinitionService.addStepDefinitionToCollectionIfMissing(stepDefinitions, this.editForm.get('current')!.value)
        )
      )
      .subscribe((stepDefinitions: IStepDefinition[]) => (this.currentsCollection = stepDefinitions));

    this.stepDefinitionService
      .query({ filter: 'steptransition-is-null' })
      .pipe(map((res: HttpResponse<IStepDefinition[]>) => res.body ?? []))
      .pipe(
        map((stepDefinitions: IStepDefinition[]) =>
          this.stepDefinitionService.addStepDefinitionToCollectionIfMissing(stepDefinitions, this.editForm.get('next')!.value)
        )
      )
      .subscribe((stepDefinitions: IStepDefinition[]) => (this.nextsCollection = stepDefinitions));
  }

  protected createFromForm(): IStepTransition {
    return {
      ...new StepTransition(),
      id: this.editForm.get(['id'])!.value,
      transition: this.editForm.get(['transition'])!.value,
      courseDefinition: this.editForm.get(['courseDefinition'])!.value,
      current: this.editForm.get(['current'])!.value,
      next: this.editForm.get(['next'])!.value,
    };
  }
}
