import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlockTransition } from '../block-transition.model';
import { BlockTransitionService } from '../service/block-transition.service';
import { BlockTransitionDeleteDialogComponent } from '../delete/block-transition-delete-dialog.component';

@Component({
  selector: 'jhi-block-transition',
  templateUrl: './block-transition.component.html',
})
export class BlockTransitionComponent implements OnInit {
  blockTransitions?: IBlockTransition[];
  isLoading = false;

  constructor(protected blockTransitionService: BlockTransitionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.blockTransitionService.query().subscribe({
      next: (res: HttpResponse<IBlockTransition[]>) => {
        this.isLoading = false;
        this.blockTransitions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBlockTransition): number {
    return item.id!;
  }

  delete(blockTransition: IBlockTransition): void {
    const modalRef = this.modalService.open(BlockTransitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.blockTransition = blockTransition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
