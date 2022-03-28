import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBlockTransition, BlockTransition } from '../block-transition.model';

import { BlockTransitionService } from './block-transition.service';

describe('BlockTransition Service', () => {
  let service: BlockTransitionService;
  let httpMock: HttpTestingController;
  let elemDefault: IBlockTransition;
  let expectedResult: IBlockTransition | IBlockTransition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BlockTransitionService);
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

    it('should create a BlockTransition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new BlockTransition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BlockTransition', () => {
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

    it('should partial update a BlockTransition', () => {
      const patchObject = Object.assign({}, new BlockTransition());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BlockTransition', () => {
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

    it('should delete a BlockTransition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBlockTransitionToCollectionIfMissing', () => {
      it('should add a BlockTransition to an empty array', () => {
        const blockTransition: IBlockTransition = { id: 123 };
        expectedResult = service.addBlockTransitionToCollectionIfMissing([], blockTransition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blockTransition);
      });

      it('should not add a BlockTransition to an array that contains it', () => {
        const blockTransition: IBlockTransition = { id: 123 };
        const blockTransitionCollection: IBlockTransition[] = [
          {
            ...blockTransition,
          },
          { id: 456 },
        ];
        expectedResult = service.addBlockTransitionToCollectionIfMissing(blockTransitionCollection, blockTransition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BlockTransition to an array that doesn't contain it", () => {
        const blockTransition: IBlockTransition = { id: 123 };
        const blockTransitionCollection: IBlockTransition[] = [{ id: 456 }];
        expectedResult = service.addBlockTransitionToCollectionIfMissing(blockTransitionCollection, blockTransition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blockTransition);
      });

      it('should add only unique BlockTransition to an array', () => {
        const blockTransitionArray: IBlockTransition[] = [{ id: 123 }, { id: 456 }, { id: 5041 }];
        const blockTransitionCollection: IBlockTransition[] = [{ id: 123 }];
        expectedResult = service.addBlockTransitionToCollectionIfMissing(blockTransitionCollection, ...blockTransitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const blockTransition: IBlockTransition = { id: 123 };
        const blockTransition2: IBlockTransition = { id: 456 };
        expectedResult = service.addBlockTransitionToCollectionIfMissing([], blockTransition, blockTransition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blockTransition);
        expect(expectedResult).toContain(blockTransition2);
      });

      it('should accept null and undefined values', () => {
        const blockTransition: IBlockTransition = { id: 123 };
        expectedResult = service.addBlockTransitionToCollectionIfMissing([], null, blockTransition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blockTransition);
      });

      it('should return initial array if no BlockTransition is added', () => {
        const blockTransitionCollection: IBlockTransition[] = [{ id: 123 }];
        expectedResult = service.addBlockTransitionToCollectionIfMissing(blockTransitionCollection, undefined, null);
        expect(expectedResult).toEqual(blockTransitionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
