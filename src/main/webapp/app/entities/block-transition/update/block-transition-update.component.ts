import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBlockTransition, BlockTransition } from '../block-transition.model';
import { BlockTransitionService } from '../service/block-transition.service';
import { IStepDefinition } from 'app/entities/step-definition/step-definition.model';
import { StepDefinitionService } from 'app/entities/step-definition/service/step-definition.service';
import { ICourseDefinition } from 'app/entities/course-definition/course-definition.model';
import { CourseDefinitionService } from 'app/entities/course-definition/service/course-definition.service';
import { IBlockDefinition } from 'app/entities/block-definition/block-definition.model';
import { BlockDefinitionService } from 'app/entities/block-definition/service/block-definition.service';

@Component({
  selector: 'jhi-block-transition-update',
  templateUrl: './block-transition-update.component.html',
})
export class BlockTransitionUpdateComponent implements OnInit {
  isSaving = false;

  stepDefinitionsCollection: IStepDefinition[] = [];
  courseDefinitionsCollection: ICourseDefinition[] = [];
  currentsCollection: IBlockDefinition[] = [];
  nextsCollection: IBlockDefinition[] = [];

  editForm = this.fb.group({
    id: [],
    transition: [null, [Validators.required]],
    stepDefinition: [],
    courseDefinition: [],
    current: [],
    next: [],
  });

  constructor(
    protected blockTransitionService: BlockTransitionService,
    protected stepDefinitionService: StepDefinitionService,
    protected courseDefinitionService: CourseDefinitionService,
    protected blockDefinitionService: BlockDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blockTransition }) => {
      this.updateForm(blockTransition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const blockTransition = this.createFromForm();
    if (blockTransition.id !== undefined) {
      this.subscribeToSaveResponse(this.blockTransitionService.update(blockTransition));
    } else {
      this.subscribeToSaveResponse(this.blockTransitionService.create(blockTransition));
    }
  }

  trackStepDefinitionById(index: number, item: IStepDefinition): number {
    return item.id!;
  }

  trackCourseDefinitionById(index: number, item: ICourseDefinition): number {
    return item.id!;
  }

  trackBlockDefinitionById(index: number, item: IBlockDefinition): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlockTransition>>): void {
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

  protected updateForm(blockTransition: IBlockTransition): void {
    this.editForm.patchValue({
      id: blockTransition.id,
      transition: blockTransition.transition,
      stepDefinition: blockTransition.stepDefinition,
      courseDefinition: blockTransition.courseDefinition,
      current: blockTransition.current,
      next: blockTransition.next,
    });

    this.stepDefinitionsCollection = this.stepDefinitionService.addStepDefinitionToCollectionIfMissing(
      this.stepDefinitionsCollection,
      blockTransition.stepDefinition
    );
    this.courseDefinitionsCollection = this.courseDefinitionService.addCourseDefinitionToCollectionIfMissing(
      this.courseDefinitionsCollection,
      blockTransition.courseDefinition
    );
    this.currentsCollection = this.blockDefinitionService.addBlockDefinitionToCollectionIfMissing(
      this.currentsCollection,
      blockTransition.current
    );
    this.nextsCollection = this.blockDefinitionService.addBlockDefinitionToCollectionIfMissing(this.nextsCollection, blockTransition.next);
  }

  protected loadRelationshipsOptions(): void {
    this.stepDefinitionService
      .query({ filter: 'blocktransition-is-null' })
      .pipe(map((res: HttpResponse<IStepDefinition[]>) => res.body ?? []))
      .pipe(
        map((stepDefinitions: IStepDefinition[]) =>
          this.stepDefinitionService.addStepDefinitionToCollectionIfMissing(stepDefinitions, this.editForm.get('stepDefinition')!.value)
        )
      )
      .subscribe((stepDefinitions: IStepDefinition[]) => (this.stepDefinitionsCollection = stepDefinitions));

    this.courseDefinitionService
      .query({ filter: 'blocktransition-is-null' })
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

    this.blockDefinitionService
      .query({ filter: 'blocktransition-is-null' })
      .pipe(map((res: HttpResponse<IBlockDefinition[]>) => res.body ?? []))
      .pipe(
        map((blockDefinitions: IBlockDefinition[]) =>
          this.blockDefinitionService.addBlockDefinitionToCollectionIfMissing(blockDefinitions, this.editForm.get('current')!.value)
        )
      )
      .subscribe((blockDefinitions: IBlockDefinition[]) => (this.currentsCollection = blockDefinitions));

    this.blockDefinitionService
      .query({ filter: 'blocktransition-is-null' })
      .pipe(map((res: HttpResponse<IBlockDefinition[]>) => res.body ?? []))
      .pipe(
        map((blockDefinitions: IBlockDefinition[]) =>
          this.blockDefinitionService.addBlockDefinitionToCollectionIfMissing(blockDefinitions, this.editForm.get('next')!.value)
        )
      )
      .subscribe((blockDefinitions: IBlockDefinition[]) => (this.nextsCollection = blockDefinitions));
  }

  protected createFromForm(): IBlockTransition {
    return {
      ...new BlockTransition(),
      id: this.editForm.get(['id'])!.value,
      transition: this.editForm.get(['transition'])!.value,
      stepDefinition: this.editForm.get(['stepDefinition'])!.value,
      courseDefinition: this.editForm.get(['courseDefinition'])!.value,
      current: this.editForm.get(['current'])!.value,
      next: this.editForm.get(['next'])!.value,
    };
  }
}
