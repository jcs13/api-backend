import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBlockDefinition, BlockDefinition } from '../block-definition.model';
import { BlockDefinitionService } from '../service/block-definition.service';
import { IItemComponent } from 'app/entities/item-component/item-component.model';
import { ItemComponentService } from 'app/entities/item-component/service/item-component.service';

@Component({
  selector: 'jhi-block-definition-update',
  templateUrl: './block-definition-update.component.html',
})
export class BlockDefinitionUpdateComponent implements OnInit {
  isSaving = false;

  itemComponentsCollection: IItemComponent[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    display: [null, [Validators.required]],
    itemComponent: [],
  });

  constructor(
    protected blockDefinitionService: BlockDefinitionService,
    protected itemComponentService: ItemComponentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blockDefinition }) => {
      this.updateForm(blockDefinition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const blockDefinition = this.createFromForm();
    if (blockDefinition.id !== undefined) {
      this.subscribeToSaveResponse(this.blockDefinitionService.update(blockDefinition));
    } else {
      this.subscribeToSaveResponse(this.blockDefinitionService.create(blockDefinition));
    }
  }

  trackItemComponentById(index: number, item: IItemComponent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlockDefinition>>): void {
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

  protected updateForm(blockDefinition: IBlockDefinition): void {
    this.editForm.patchValue({
      id: blockDefinition.id,
      name: blockDefinition.name,
      label: blockDefinition.label,
      display: blockDefinition.display,
      itemComponent: blockDefinition.itemComponent,
    });

    this.itemComponentsCollection = this.itemComponentService.addItemComponentToCollectionIfMissing(
      this.itemComponentsCollection,
      blockDefinition.itemComponent
    );
  }

  protected loadRelationshipsOptions(): void {
    this.itemComponentService
      .query({ filter: 'blockdefinition-is-null' })
      .pipe(map((res: HttpResponse<IItemComponent[]>) => res.body ?? []))
      .pipe(
        map((itemComponents: IItemComponent[]) =>
          this.itemComponentService.addItemComponentToCollectionIfMissing(itemComponents, this.editForm.get('itemComponent')!.value)
        )
      )
      .subscribe((itemComponents: IItemComponent[]) => (this.itemComponentsCollection = itemComponents));
  }

  protected createFromForm(): IBlockDefinition {
    return {
      ...new BlockDefinition(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      display: this.editForm.get(['display'])!.value,
      itemComponent: this.editForm.get(['itemComponent'])!.value,
    };
  }
}
