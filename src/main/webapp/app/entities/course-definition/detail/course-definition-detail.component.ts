import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICourseDefinition } from '../course-definition.model';

@Component({
  selector: 'jhi-course-definition-detail',
  templateUrl: './course-definition-detail.component.html',
})
export class CourseDefinitionDetailComponent implements OnInit {
  courseDefinition: ICourseDefinition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courseDefinition }) => {
      this.courseDefinition = courseDefinition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
