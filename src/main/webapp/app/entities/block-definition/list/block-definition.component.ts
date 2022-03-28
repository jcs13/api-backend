import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlockDefinition } from '../block-definition.model';
import { BlockDefinitionService } from '../service/block-definition.service';
import { BlockDefinitionDeleteDialogComponent } from '../delete/block-definition-delete-dialog.component';

@Component({
  selector: 'jhi-block-definition',
  templateUrl: './block-definition.component.html',
})
export class BlockDefinitionComponent implements OnInit {
  blockDefinitions?: IBlockDefinition[];
  isLoading = false;

  constructor(protected blockDefinitionService: BlockDefinitionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.blockDefinitionService.query().subscribe({
      next: (res: HttpResponse<IBlockDefinition[]>) => {
        this.isLoading = false;
        this.blockDefinitions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBlockDefinition): number {
    return item.id!;
  }

  delete(blockDefinition: IBlockDefinition): void {
    const modalRef = this.modalService.open(BlockDefinitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.blockDefinition = blockDefinition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
