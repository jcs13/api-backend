import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IStepDefinition, StepDefinition } from '../step-definition.model';
import { StepDefinitionService } from '../service/step-definition.service';

@Component({
  selector: 'jhi-step-definition-update',
  templateUrl: './step-definition-update.component.html',
})
export class StepDefinitionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    display: [null, [Validators.required]],
  });

  constructor(
    protected stepDefinitionService: StepDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stepDefinition }) => {
      this.updateForm(stepDefinition);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stepDefinition = this.createFromForm();
    if (stepDefinition.id !== undefined) {
      this.subscribeToSaveResponse(this.stepDefinitionService.update(stepDefinition));
    } else {
      this.subscribeToSaveResponse(this.stepDefinitionService.create(stepDefinition));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStepDefinition>>): void {
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

  protected updateForm(stepDefinition: IStepDefinition): void {
    this.editForm.patchValue({
      id: stepDefinition.id,
      name: stepDefinition.name,
      label: stepDefinition.label,
      display: stepDefinition.display,
    });
  }

  protected createFromForm(): IStepDefinition {
    return {
      ...new StepDefinition(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      display: this.editForm.get(['display'])!.value,
    };
  }
}
