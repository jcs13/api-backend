import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICourseDefinition, CourseDefinition } from '../course-definition.model';
import { CourseDefinitionService } from '../service/course-definition.service';

@Injectable({ providedIn: 'root' })
export class CourseDefinitionRoutingResolveService implements Resolve<ICourseDefinition> {
  constructor(protected service: CourseDefinitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICourseDefinition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((courseDefinition: HttpResponse<CourseDefinition>) => {
          if (courseDefinition.body) {
            return of(courseDefinition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CourseDefinition());
  }
}
