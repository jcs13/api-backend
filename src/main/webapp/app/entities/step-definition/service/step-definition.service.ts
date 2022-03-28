import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStepDefinition, getStepDefinitionIdentifier } from '../step-definition.model';

export type EntityResponseType = HttpResponse<IStepDefinition>;
export type EntityArrayResponseType = HttpResponse<IStepDefinition[]>;

@Injectable({ providedIn: 'root' })
export class StepDefinitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/step-definitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(stepDefinition: IStepDefinition): Observable<EntityResponseType> {
    return this.http.post<IStepDefinition>(this.resourceUrl, stepDefinition, { observe: 'response' });
  }

  update(stepDefinition: IStepDefinition): Observable<EntityResponseType> {
    return this.http.put<IStepDefinition>(`${this.resourceUrl}/${getStepDefinitionIdentifier(stepDefinition) as number}`, stepDefinition, {
      observe: 'response',
    });
  }

  partialUpdate(stepDefinition: IStepDefinition): Observable<EntityResponseType> {
    return this.http.patch<IStepDefinition>(
      `${this.resourceUrl}/${getStepDefinitionIdentifier(stepDefinition) as number}`,
      stepDefinition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStepDefinition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStepDefinition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStepDefinitionToCollectionIfMissing(
    stepDefinitionCollection: IStepDefinition[],
    ...stepDefinitionsToCheck: (IStepDefinition | null | undefined)[]
  ): IStepDefinition[] {
    const stepDefinitions: IStepDefinition[] = stepDefinitionsToCheck.filter(isPresent);
    if (stepDefinitions.length > 0) {
      const stepDefinitionCollectionIdentifiers = stepDefinitionCollection.map(
        stepDefinitionItem => getStepDefinitionIdentifier(stepDefinitionItem)!
      );
      const stepDefinitionsToAdd = stepDefinitions.filter(stepDefinitionItem => {
        const stepDefinitionIdentifier = getStepDefinitionIdentifier(stepDefinitionItem);
        if (stepDefinitionIdentifier == null || stepDefinitionCollectionIdentifiers.includes(stepDefinitionIdentifier)) {
          return false;
        }
        stepDefinitionCollectionIdentifiers.push(stepDefinitionIdentifier);
        return true;
      });
      return [...stepDefinitionsToAdd, ...stepDefinitionCollection];
    }
    return stepDefinitionCollection;
  }
}
