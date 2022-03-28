import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStepTransition, getStepTransitionIdentifier } from '../step-transition.model';

export type EntityResponseType = HttpResponse<IStepTransition>;
export type EntityArrayResponseType = HttpResponse<IStepTransition[]>;

@Injectable({ providedIn: 'root' })
export class StepTransitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/step-transitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(stepTransition: IStepTransition): Observable<EntityResponseType> {
    return this.http.post<IStepTransition>(this.resourceUrl, stepTransition, { observe: 'response' });
  }

  update(stepTransition: IStepTransition): Observable<EntityResponseType> {
    return this.http.put<IStepTransition>(`${this.resourceUrl}/${getStepTransitionIdentifier(stepTransition) as number}`, stepTransition, {
      observe: 'response',
    });
  }

  partialUpdate(stepTransition: IStepTransition): Observable<EntityResponseType> {
    return this.http.patch<IStepTransition>(
      `${this.resourceUrl}/${getStepTransitionIdentifier(stepTransition) as number}`,
      stepTransition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStepTransition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStepTransition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStepTransitionToCollectionIfMissing(
    stepTransitionCollection: IStepTransition[],
    ...stepTransitionsToCheck: (IStepTransition | null | undefined)[]
  ): IStepTransition[] {
    const stepTransitions: IStepTransition[] = stepTransitionsToCheck.filter(isPresent);
    if (stepTransitions.length > 0) {
      const stepTransitionCollectionIdentifiers = stepTransitionCollection.map(
        stepTransitionItem => getStepTransitionIdentifier(stepTransitionItem)!
      );
      const stepTransitionsToAdd = stepTransitions.filter(stepTransitionItem => {
        const stepTransitionIdentifier = getStepTransitionIdentifier(stepTransitionItem);
        if (stepTransitionIdentifier == null || stepTransitionCollectionIdentifiers.includes(stepTransitionIdentifier)) {
          return false;
        }
        stepTransitionCollectionIdentifiers.push(stepTransitionIdentifier);
        return true;
      });
      return [...stepTransitionsToAdd, ...stepTransitionCollection];
    }
    return stepTransitionCollection;
  }
}
