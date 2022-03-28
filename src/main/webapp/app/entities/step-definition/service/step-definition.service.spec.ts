import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStepDefinition, StepDefinition } from '../step-definition.model';

import { StepDefinitionService } from './step-definition.service';

describe('StepDefinition Service', () => {
  let service: StepDefinitionService;
  let httpMock: HttpTestingController;
  let elemDefault: IStepDefinition;
  let expectedResult: IStepDefinition | IStepDefinition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StepDefinitionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      label: 'AAAAAAA',
      display: false,
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

    it('should create a StepDefinition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new StepDefinition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StepDefinition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          label: 'BBBBBB',
          display: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StepDefinition', () => {
      const patchObject = Object.assign({}, new StepDefinition());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StepDefinition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          label: 'BBBBBB',
          display: true,
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

    it('should delete a StepDefinition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addStepDefinitionToCollectionIfMissing', () => {
      it('should add a StepDefinition to an empty array', () => {
        const stepDefinition: IStepDefinition = { id: 123 };
        expectedResult = service.addStepDefinitionToCollectionIfMissing([], stepDefinition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stepDefinition);
      });

      it('should not add a StepDefinition to an array that contains it', () => {
        const stepDefinition: IStepDefinition = { id: 123 };
        const stepDefinitionCollection: IStepDefinition[] = [
          {
            ...stepDefinition,
          },
          { id: 456 },
        ];
        expectedResult = service.addStepDefinitionToCollectionIfMissing(stepDefinitionCollection, stepDefinition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StepDefinition to an array that doesn't contain it", () => {
        const stepDefinition: IStepDefinition = { id: 123 };
        const stepDefinitionCollection: IStepDefinition[] = [{ id: 456 }];
        expectedResult = service.addStepDefinitionToCollectionIfMissing(stepDefinitionCollection, stepDefinition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stepDefinition);
      });

      it('should add only unique StepDefinition to an array', () => {
        const stepDefinitionArray: IStepDefinition[] = [{ id: 123 }, { id: 456 }, { id: 86942 }];
        const stepDefinitionCollection: IStepDefinition[] = [{ id: 123 }];
        expectedResult = service.addStepDefinitionToCollectionIfMissing(stepDefinitionCollection, ...stepDefinitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const stepDefinition: IStepDefinition = { id: 123 };
        const stepDefinition2: IStepDefinition = { id: 456 };
        expectedResult = service.addStepDefinitionToCollectionIfMissing([], stepDefinition, stepDefinition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stepDefinition);
        expect(expectedResult).toContain(stepDefinition2);
      });

      it('should accept null and undefined values', () => {
        const stepDefinition: IStepDefinition = { id: 123 };
        expectedResult = service.addStepDefinitionToCollectionIfMissing([], null, stepDefinition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stepDefinition);
      });

      it('should return initial array if no StepDefinition is added', () => {
        const stepDefinitionCollection: IStepDefinition[] = [{ id: 123 }];
        expectedResult = service.addStepDefinitionToCollectionIfMissing(stepDefinitionCollection, undefined, null);
        expect(expectedResult).toEqual(stepDefinitionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
