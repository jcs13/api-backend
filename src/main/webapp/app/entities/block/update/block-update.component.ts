import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBlock, Block } from '../block.model';
import { BlockService } from '../service/block.service';
import { IStep } from 'app/entities/step/step.model';
import { StepService } from 'app/entities/step/service/step.service';

@Component({
  selector: 'jhi-block-update',
  templateUrl: './block-update.component.html',
})
export class BlockUpdateComponent implements OnInit {
  isSaving = false;

  stepsSharedCollection: IStep[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    componentName: [null, [Validators.required]],
    stepDefinitionId: [null, [Validators.required]],
    blockDefinitionId: [null, [Validators.required]],
    display: [null, [Validators.required]],
    order: [null, [Validators.required]],
    step: [],
  });

  constructor(
    protected blockService: BlockService,
    protected stepService: StepService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ block }) => {
      this.updateForm(block);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const block = this.createFromForm();
    if (block.id !== undefined) {
      this.subscribeToSaveResponse(this.blockService.update(block));
    } else {
      this.subscribeToSaveResponse(this.blockService.create(block));
    }
  }

  trackStepById(index: number, item: IStep): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlock>>): void {
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

  protected updateForm(block: IBlock): void {
    this.editForm.patchValue({
      id: block.id,
      name: block.name,
      label: block.label,
      componentName: block.componentName,
      stepDefinitionId: block.stepDefinitionId,
      blockDefinitionId: block.blockDefinitionId,
      display: block.display,
      order: block.order,
      step: block.step,
    });

    this.stepsSharedCollection = this.stepService.addStepToCollectionIfMissing(this.stepsSharedCollection, block.step);
  }

  protected loadRelationshipsOptions(): void {
    this.stepService
      .query()
      .pipe(map((res: HttpResponse<IStep[]>) => res.body ?? []))
      .pipe(map((steps: IStep[]) => this.stepService.addStepToCollectionIfMissing(steps, this.editForm.get('step')!.value)))
      .subscribe((steps: IStep[]) => (this.stepsSharedCollection = steps));
  }

  protected createFromForm(): IBlock {
    return {
      ...new Block(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      componentName: this.editForm.get(['componentName'])!.value,
      stepDefinitionId: this.editForm.get(['stepDefinitionId'])!.value,
      blockDefinitionId: this.editForm.get(['blockDefinitionId'])!.value,
      display: this.editForm.get(['display'])!.value,
      order: this.editForm.get(['order'])!.value,
      step: this.editForm.get(['step'])!.value,
    };
  }
}
