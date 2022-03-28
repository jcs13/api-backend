import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOfferComposition, getOfferCompositionIdentifier } from '../offer-composition.model';

export type EntityResponseType = HttpResponse<IOfferComposition>;
export type EntityArrayResponseType = HttpResponse<IOfferComposition[]>;

@Injectable({ providedIn: 'root' })
export class OfferCompositionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offer-compositions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offerComposition: IOfferComposition): Observable<EntityResponseType> {
    return this.http.post<IOfferComposition>(this.resourceUrl, offerComposition, { observe: 'response' });
  }

  update(offerComposition: IOfferComposition): Observable<EntityResponseType> {
    return this.http.put<IOfferComposition>(
      `${this.resourceUrl}/${getOfferCompositionIdentifier(offerComposition) as number}`,
      offerComposition,
      { observe: 'response' }
    );
  }

  partialUpdate(offerComposition: IOfferComposition): Observable<EntityResponseType> {
    return this.http.patch<IOfferComposition>(
      `${this.resourceUrl}/${getOfferCompositionIdentifier(offerComposition) as number}`,
      offerComposition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOfferComposition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOfferComposition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOfferCompositionToCollectionIfMissing(
    offerCompositionCollection: IOfferComposition[],
    ...offerCompositionsToCheck: (IOfferComposition | null | undefined)[]
  ): IOfferComposition[] {
    const offerCompositions: IOfferComposition[] = offerCompositionsToCheck.filter(isPresent);
    if (offerCompositions.length > 0) {
      const offerCompositionCollectionIdentifiers = offerCompositionCollection.map(
        offerCompositionItem => getOfferCompositionIdentifier(offerCompositionItem)!
      );
      const offerCompositionsToAdd = offerCompositions.filter(offerCompositionItem => {
        const offerCompositionIdentifier = getOfferCompositionIdentifier(offerCompositionItem);
        if (offerCompositionIdentifier == null || offerCompositionCollectionIdentifiers.includes(offerCompositionIdentifier)) {
          return false;
        }
        offerCompositionCollectionIdentifiers.push(offerCompositionIdentifier);
        return true;
      });
      return [...offerCompositionsToAdd, ...offerCompositionCollection];
    }
    return offerCompositionCollection;
  }
}
