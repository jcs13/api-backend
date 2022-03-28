import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IStep, Step } from '../step.model';
import { StepService } from '../service/step.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

@Component({
  selector: 'jhi-step-update',
  templateUrl: './step-update.component.html',
})
export class StepUpdateComponent implements OnInit {
  isSaving = false;

  coursesSharedCollection: ICourse[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    stepDefinitionId: [null, [Validators.required]],
    display: [null, [Validators.required]],
    order: [null, [Validators.required]],
    course: [],
  });

  constructor(
    protected stepService: StepService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ step }) => {
      this.updateForm(step);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const step = this.createFromForm();
    if (step.id !== undefined) {
      this.subscribeToSaveResponse(this.stepService.update(step));
    } else {
      this.subscribeToSaveResponse(this.stepService.create(step));
    }
  }

  trackCourseById(index: number, item: ICourse): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStep>>): void {
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

  protected updateForm(step: IStep): void {
    this.editForm.patchValue({
      id: step.id,
      name: step.name,
      label: step.label,
      stepDefinitionId: step.stepDefinitionId,
      display: step.display,
      order: step.order,
      course: step.course,
    });

    this.coursesSharedCollection = this.courseService.addCourseToCollectionIfMissing(this.coursesSharedCollection, step.course);
  }

  protected loadRelationshipsOptions(): void {
    this.courseService
      .query()
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing(courses, this.editForm.get('course')!.value)))
      .subscribe((courses: ICourse[]) => (this.coursesSharedCollection = courses));
  }

  protected createFromForm(): IStep {
    return {
      ...new Step(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      stepDefinitionId: this.editForm.get(['stepDefinitionId'])!.value,
      display: this.editForm.get(['display'])!.value,
      order: this.editForm.get(['order'])!.value,
      course: this.editForm.get(['course'])!.value,
    };
  }
}
