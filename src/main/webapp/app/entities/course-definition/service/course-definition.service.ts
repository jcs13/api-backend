import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICourseDefinition, getCourseDefinitionIdentifier } from '../course-definition.model';

export type EntityResponseType = HttpResponse<ICourseDefinition>;
export type EntityArrayResponseType = HttpResponse<ICourseDefinition[]>;

@Injectable({ providedIn: 'root' })
export class CourseDefinitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/course-definitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(courseDefinition: ICourseDefinition): Observable<EntityResponseType> {
    return this.http.post<ICourseDefinition>(this.resourceUrl, courseDefinition, { observe: 'response' });
  }

  update(courseDefinition: ICourseDefinition): Observable<EntityResponseType> {
    return this.http.put<ICourseDefinition>(
      `${this.resourceUrl}/${getCourseDefinitionIdentifier(courseDefinition) as number}`,
      courseDefinition,
      { observe: 'response' }
    );
  }

  partialUpdate(courseDefinition: ICourseDefinition): Observable<EntityResponseType> {
    return this.http.patch<ICourseDefinition>(
      `${this.resourceUrl}/${getCourseDefinitionIdentifier(courseDefinition) as number}`,
      courseDefinition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICourseDefinition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICourseDefinition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCourseDefinitionToCollectionIfMissing(
    courseDefinitionCollection: ICourseDefinition[],
    ...courseDefinitionsToCheck: (ICourseDefinition | null | undefined)[]
  ): ICourseDefinition[] {
    const courseDefinitions: ICourseDefinition[] = courseDefinitionsToCheck.filter(isPresent);
    if (courseDefinitions.length > 0) {
      const courseDefinitionCollectionIdentifiers = courseDefinitionCollection.map(
        courseDefinitionItem => getCourseDefinitionIdentifier(courseDefinitionItem)!
      );
      const courseDefinitionsToAdd = courseDefinitions.filter(courseDefinitionItem => {
        const courseDefinitionIdentifier = getCourseDefinitionIdentifier(courseDefinitionItem);
        if (courseDefinitionIdentifier == null || courseDefinitionCollectionIdentifiers.includes(courseDefinitionIdentifier)) {
          return false;
        }
        courseDefinitionCollectionIdentifiers.push(courseDefinitionIdentifier);
        return true;
      });
      return [...courseDefinitionsToAdd, ...courseDefinitionCollection];
    }
    return courseDefinitionCollection;
  }
}
