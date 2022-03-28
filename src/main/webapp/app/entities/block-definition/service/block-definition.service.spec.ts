import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBlockDefinition, BlockDefinition } from '../block-definition.model';

import { BlockDefinitionService } from './block-definition.service';

describe('BlockDefinition Service', () => {
  let service: BlockDefinitionService;
  let httpMock: HttpTestingController;
  let elemDefault: IBlockDefinition;
  let expectedResult: IBlockDefinition | IBlockDefinition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BlockDefinitionService);
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

    it('should create a BlockDefinition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new BlockDefinition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BlockDefinition', () => {
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

    it('should partial update a BlockDefinition', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          label: 'BBBBBB',
          display: true,
        },
        new BlockDefinition()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BlockDefinition', () => {
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

    it('should delete a BlockDefinition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBlockDefinitionToCollectionIfMissing', () => {
      it('should add a BlockDefinition to an empty array', () => {
        const blockDefinition: IBlockDefinition = { id: 123 };
        expectedResult = service.addBlockDefinitionToCollectionIfMissing([], blockDefinition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blockDefinition);
      });

      it('should not add a BlockDefinition to an array that contains it', () => {
        const blockDefinition: IBlockDefinition = { id: 123 };
        const blockDefinitionCollection: IBlockDefinition[] = [
          {
            ...blockDefinition,
          },
          { id: 456 },
        ];
        expectedResult = service.addBlockDefinitionToCollectionIfMissing(blockDefinitionCollection, blockDefinition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BlockDefinition to an array that doesn't contain it", () => {
        const blockDefinition: IBlockDefinition = { id: 123 };
        const blockDefinitionCollection: IBlockDefinition[] = [{ id: 456 }];
        expectedResult = service.addBlockDefinitionToCollectionIfMissing(blockDefinitionCollection, blockDefinition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blockDefinition);
      });

      it('should add only unique BlockDefinition to an array', () => {
        const blockDefinitionArray: IBlockDefinition[] = [{ id: 123 }, { id: 456 }, { id: 62141 }];
        const blockDefinitionCollection: IBlockDefinition[] = [{ id: 123 }];
        expectedResult = service.addBlockDefinitionToCollectionIfMissing(blockDefinitionCollection, ...blockDefinitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const blockDefinition: IBlockDefinition = { id: 123 };
        const blockDefinition2: IBlockDefinition = { id: 456 };
        expectedResult = service.addBlockDefinitionToCollectionIfMissing([], blockDefinition, blockDefinition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blockDefinition);
        expect(expectedResult).toContain(blockDefinition2);
      });

      it('should accept null and undefined values', () => {
        const blockDefinition: IBlockDefinition = { id: 123 };
        expectedResult = service.addBlockDefinitionToCollectionIfMissing([], null, blockDefinition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blockDefinition);
      });

      it('should return initial array if no BlockDefinition is added', () => {
        const blockDefinitionCollection: IBlockDefinition[] = [{ id: 123 }];
        expectedResult = service.addBlockDefinitionToCollectionIfMissing(blockDefinitionCollection, undefined, null);
        expect(expectedResult).toEqual(blockDefinitionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
