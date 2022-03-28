import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOffer, Offer } from '../offer.model';

import { OfferService } from './offer.service';

describe('Offer Service', () => {
  let service: OfferService;
  let httpMock: HttpTestingController;
  let elemDefault: IOffer;
  let expectedResult: IOffer | IOffer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OfferService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      label: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Offer', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Offer()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Offer', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          label: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Offer', () => {
      const patchObject = Object.assign(
        {
          label: 'BBBBBB',
        },
        new Offer()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Offer', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          label: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Offer', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOfferToCollectionIfMissing', () => {
      it('should add a Offer to an empty array', () => {
        const offer: IOffer = { id: 123 };
        expectedResult = service.addOfferToCollectionIfMissing([], offer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offer);
      });

      it('should not add a Offer to an array that contains it', () => {
        const offer: IOffer = { id: 123 };
        const offerCollection: IOffer[] = [
          {
            ...offer,
          },
          { id: 456 },
        ];
        expectedResult = service.addOfferToCollectionIfMissing(offerCollection, offer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Offer to an array that doesn't contain it", () => {
        const offer: IOffer = { id: 123 };
        const offerCollection: IOffer[] = [{ id: 456 }];
        expectedResult = service.addOfferToCollectionIfMissing(offerCollection, offer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offer);
      });

      it('should add only unique Offer to an array', () => {
        const offerArray: IOffer[] = [{ id: 123 }, { id: 456 }, { id: 12394 }];
        const offerCollection: IOffer[] = [{ id: 123 }];
        expectedResult = service.addOfferToCollectionIfMissing(offerCollection, ...offerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const offer: IOffer = { id: 123 };
        const offer2: IOffer = { id: 456 };
        expectedResult = service.addOfferToCollectionIfMissing([], offer, offer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offer);
        expect(expectedResult).toContain(offer2);
      });

      it('should accept null and undefined values', () => {
        const offer: IOffer = { id: 123 };
        expectedResult = service.addOfferToCollectionIfMissing([], null, offer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offer);
      });

      it('should return initial array if no Offer is added', () => {
        const offerCollection: IOffer[] = [{ id: 123 }];
        expectedResult = service.addOfferToCollectionIfMissing(offerCollection, undefined, null);
        expect(expectedResult).toEqual(offerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
