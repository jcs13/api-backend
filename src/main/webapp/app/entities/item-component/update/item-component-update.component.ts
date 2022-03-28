import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IItemComponent, ItemComponent } from '../item-component.model';
import { ItemComponentService } from '../service/item-component.service';

@Component({
  selector: 'jhi-item-component-update',
  templateUrl: './item-component-update.component.html',
})
export class ItemComponentUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
  });

  constructor(protected itemComponentService: ItemComponentService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemComponent }) => {
      this.updateForm(itemComponent);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemComponent = this.createFromForm();
    if (itemComponent.id !== undefined) {
      this.subscribeToSaveResponse(this.itemComponentService.update(itemComponent));
    } else {
      this.subscribeToSaveResponse(this.itemComponentService.create(itemComponent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemComponent>>): void {
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

  protected updateForm(itemComponent: IItemComponent): void {
    this.editForm.patchValue({
      id: itemComponent.id,
      name: itemComponent.name,
    });
  }

  protected createFromForm(): IItemComponent {
    return {
      ...new ItemComponent(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
