import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IItemComponent } from '../item-component.model';
import { ItemComponentService } from '../service/item-component.service';
import { ItemComponentDeleteDialogComponent } from '../delete/item-component-delete-dialog.component';

@Component({
  selector: 'jhi-item-component',
  templateUrl: './item-component.component.html',
})
export class ItemComponentComponent implements OnInit {
  itemComponents?: IItemComponent[];
  isLoading = false;

  constructor(protected itemComponentService: ItemComponentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.itemComponentService.query().subscribe({
      next: (res: HttpResponse<IItemComponent[]>) => {
        this.isLoading = false;
        this.itemComponents = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IItemComponent): number {
    return item.id!;
  }

  delete(itemComponent: IItemComponent): void {
    const modalRef = this.modalService.open(ItemComponentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.itemComponent = itemComponent;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
