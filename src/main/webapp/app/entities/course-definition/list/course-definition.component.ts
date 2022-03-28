import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICourseDefinition } from '../course-definition.model';
import { CourseDefinitionService } from '../service/course-definition.service';
import { CourseDefinitionDeleteDialogComponent } from '../delete/course-definition-delete-dialog.component';

@Component({
  selector: 'jhi-course-definition',
  templateUrl: './course-definition.component.html',
})
export class CourseDefinitionComponent implements OnInit {
  courseDefinitions?: ICourseDefinition[];
  isLoading = false;

  constructor(protected courseDefinitionService: CourseDefinitionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.courseDefinitionService.query().subscribe({
      next: (res: HttpResponse<ICourseDefinition[]>) => {
        this.isLoading = false;
        this.courseDefinitions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICourseDefinition): number {
    return item.id!;
  }

  delete(courseDefinition: ICourseDefinition): void {
    const modalRef = this.modalService.open(CourseDefinitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.courseDefinition = courseDefinition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
