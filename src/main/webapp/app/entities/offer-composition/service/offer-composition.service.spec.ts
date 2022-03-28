import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOfferComposition, OfferComposition } from '../offer-composition.model';

import { OfferCompositionService } from './offer-composition.service';

describe('OfferComposition Service', () => {
  let service: OfferCompositionService;
  let httpMock: HttpTestingController;
  let elemDefault: IOfferComposition;
  let expectedResult: IOfferComposition | IOfferComposition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OfferCompositionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      inheritanceOrder: 0,
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

    it('should create a OfferComposition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new OfferComposition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OfferComposition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          inheritanceOrder: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OfferComposition', () => {
      const patchObject = Object.assign({}, new OfferComposition());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OfferComposition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          inheritanceOrder: 1,
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

    it('should delete a OfferComposition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOfferCompositionToCollectionIfMissing', () => {
      it('should add a OfferComposition to an empty array', () => {
        const offerComposition: IOfferComposition = { id: 123 };
        expectedResult = service.addOfferCompositionToCollectionIfMissing([], offerComposition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offerComposition);
      });

      it('should not add a OfferComposition to an array that contains it', () => {
        const offerComposition: IOfferComposition = { id: 123 };
        const offerCompositionCollection: IOfferComposition[] = [
          {
            ...offerComposition,
          },
          { id: 456 },
        ];
        expectedResult = service.addOfferCompositionToCollectionIfMissing(offerCompositionCollection, offerComposition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OfferComposition to an array that doesn't contain it", () => {
        const offerComposition: IOfferComposition = { id: 123 };
        const offerCompositionCollection: IOfferComposition[] = [{ id: 456 }];
        expectedResult = service.addOfferCompositionToCollectionIfMissing(offerCompositionCollection, offerComposition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offerComposition);
      });

      it('should add only unique OfferComposition to an array', () => {
        const offerCompositionArray: IOfferComposition[] = [{ id: 123 }, { id: 456 }, { id: 55353 }];
        const offerCompositionCollection: IOfferComposition[] = [{ id: 123 }];
        expectedResult = service.addOfferCompositionToCollectionIfMissing(offerCompositionCollection, ...offerCompositionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const offerComposition: IOfferComposition = { id: 123 };
        const offerComposition2: IOfferComposition = { id: 456 };
        expectedResult = service.addOfferCompositionToCollectionIfMissing([], offerComposition, offerComposition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offerComposition);
        expect(expectedResult).toContain(offerComposition2);
      });

      it('should accept null and undefined values', () => {
        const offerComposition: IOfferComposition = { id: 123 };
        expectedResult = service.addOfferCompositionToCollectionIfMissing([], null, offerComposition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offerComposition);
      });

      it('should return initial array if no OfferComposition is added', () => {
        const offerCompositionCollection: IOfferComposition[] = [{ id: 123 }];
        expectedResult = service.addOfferCompositionToCollectionIfMissing(offerCompositionCollection, undefined, null);
        expect(expectedResult).toEqual(offerCompositionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
