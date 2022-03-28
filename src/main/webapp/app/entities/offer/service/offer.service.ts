import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffer, getOfferIdentifier } from '../offer.model';

export type EntityResponseType = HttpResponse<IOffer>;
export type EntityArrayResponseType = HttpResponse<IOffer[]>;

@Injectable({ providedIn: 'root' })
export class OfferService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offer: IOffer): Observable<EntityResponseType> {
    return this.http.post<IOffer>(this.resourceUrl, offer, { observe: 'response' });
  }

  update(offer: IOffer): Observable<EntityResponseType> {
    return this.http.put<IOffer>(`${this.resourceUrl}/${getOfferIdentifier(offer) as number}`, offer, { observe: 'response' });
  }

  partialUpdate(offer: IOffer): Observable<EntityResponseType> {
    return this.http.patch<IOffer>(`${this.resourceUrl}/${getOfferIdentifier(offer) as number}`, offer, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOffer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOfferToCollectionIfMissing(offerCollection: IOffer[], ...offersToCheck: (IOffer | null | undefined)[]): IOffer[] {
    const offers: IOffer[] = offersToCheck.filter(isPresent);
    if (offers.length > 0) {
      const offerCollectionIdentifiers = offerCollection.map(offerItem => getOfferIdentifier(offerItem)!);
      const offersToAdd = offers.filter(offerItem => {
        const offerIdentifier = getOfferIdentifier(offerItem);
        if (offerIdentifier == null || offerCollectionIdentifiers.includes(offerIdentifier)) {
          return false;
        }
        offerCollectionIdentifiers.push(offerIdentifier);
        return true;
      });
      return [...offersToAdd, ...offerCollection];
    }
    return offerCollection;
  }
}
