import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlock } from '../block.model';
import { BlockService } from '../service/block.service';
import { BlockDeleteDialogComponent } from '../delete/block-delete-dialog.component';

@Component({
  selector: 'jhi-block',
  templateUrl: './block.component.html',
})
export class BlockComponent implements OnInit {
  blocks?: IBlock[];
  isLoading = false;

  constructor(protected blockService: BlockService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.blockService.query().subscribe({
      next: (res: HttpResponse<IBlock[]>) => {
        this.isLoading = false;
        this.blocks = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBlock): number {
    return item.id!;
  }

  delete(block: IBlock): void {
    const modalRef = this.modalService.open(BlockDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.block = block;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
