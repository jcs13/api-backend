import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICourseDefinition, CourseDefinition } from '../course-definition.model';
import { CourseDefinitionService } from '../service/course-definition.service';

@Component({
  selector: 'jhi-course-definition-update',
  templateUrl: './course-definition-update.component.html',
})
export class CourseDefinitionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
  });

  constructor(
    protected courseDefinitionService: CourseDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courseDefinition }) => {
      this.updateForm(courseDefinition);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const courseDefinition = this.createFromForm();
    if (courseDefinition.id !== undefined) {
      this.subscribeToSaveResponse(this.courseDefinitionService.update(courseDefinition));
    } else {
      this.subscribeToSaveResponse(this.courseDefinitionService.create(courseDefinition));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourseDefinition>>): void {
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

  protected updateForm(courseDefinition: ICourseDefinition): void {
    this.editForm.patchValue({
      id: courseDefinition.id,
      name: courseDefinition.name,
      label: courseDefinition.label,
    });
  }

  protected createFromForm(): ICourseDefinition {
    return {
      ...new CourseDefinition(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
    };
  }
}
