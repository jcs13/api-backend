import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStepDefinition } from '../step-definition.model';
import { StepDefinitionService } from '../service/step-definition.service';
import { StepDefinitionDeleteDialogComponent } from '../delete/step-definition-delete-dialog.component';

@Component({
  selector: 'jhi-step-definition',
  templateUrl: './step-definition.component.html',
})
export class StepDefinitionComponent implements OnInit {
  stepDefinitions?: IStepDefinition[];
  isLoading = false;

  constructor(protected stepDefinitionService: StepDefinitionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.stepDefinitionService.query().subscribe({
      next: (res: HttpResponse<IStepDefinition[]>) => {
        this.isLoading = false;
        this.stepDefinitions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IStepDefinition): number {
    return item.id!;
  }

  delete(stepDefinition: IStepDefinition): void {
    const modalRef = this.modalService.open(StepDefinitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.stepDefinition = stepDefinition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
