import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStepTransition, StepTransition } from '../step-transition.model';

import { StepTransitionService } from './step-transition.service';

describe('StepTransition Service', () => {
  let service: StepTransitionService;
  let httpMock: HttpTestingController;
  let elemDefault: IStepTransition;
  let expectedResult: IStepTransition | IStepTransition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StepTransitionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      transition: 0,
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

    it('should create a StepTransition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new StepTransition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StepTransition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transition: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StepTransition', () => {
      const patchObject = Object.assign({}, new StepTransition());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StepTransition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transition: 1,
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

    it('should delete a StepTransition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addStepTransitionToCollectionIfMissing', () => {
      it('should add a StepTransition to an empty array', () => {
        const stepTransition: IStepTransition = { id: 123 };
        expectedResult = service.addStepTransitionToCollectionIfMissing([], stepTransition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stepTransition);
      });

      it('should not add a StepTransition to an array that contains it', () => {
        const stepTransition: IStepTransition = { id: 123 };
        const stepTransitionCollection: IStepTransition[] = [
          {
            ...stepTransition,
          },
          { id: 456 },
        ];
        expectedResult = service.addStepTransitionToCollectionIfMissing(stepTransitionCollection, stepTransition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StepTransition to an array that doesn't contain it", () => {
        const stepTransition: IStepTransition = { id: 123 };
        const stepTransitionCollection: IStepTransition[] = [{ id: 456 }];
        expectedResult = service.addStepTransitionToCollectionIfMissing(stepTransitionCollection, stepTransition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stepTransition);
      });

      it('should add only unique StepTransition to an array', () => {
        const stepTransitionArray: IStepTransition[] = [{ id: 123 }, { id: 456 }, { id: 33974 }];
        const stepTransitionCollection: IStepTransition[] = [{ id: 123 }];
        expectedResult = service.addStepTransitionToCollectionIfMissing(stepTransitionCollection, ...stepTransitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const stepTransition: IStepTransition = { id: 123 };
        const stepTransition2: IStepTransition = { id: 456 };
        expectedResult = service.addStepTransitionToCollectionIfMissing([], stepTransition, stepTransition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stepTransition);
        expect(expectedResult).toContain(stepTransition2);
      });

      it('should accept null and undefined values', () => {
        const stepTransition: IStepTransition = { id: 123 };
        expectedResult = service.addStepTransitionToCollectionIfMissing([], null, stepTransition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stepTransition);
      });

      it('should return initial array if no StepTransition is added', () => {
        const stepTransitionCollection: IStepTransition[] = [{ id: 123 }];
        expectedResult = service.addStepTransitionToCollectionIfMissing(stepTransitionCollection, undefined, null);
        expect(expectedResult).toEqual(stepTransitionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
