import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItemComponent, ItemComponent } from '../item-component.model';

import { ItemComponentService } from './item-component.service';

describe('ItemComponent Service', () => {
  let service: ItemComponentService;
  let httpMock: HttpTestingController;
  let elemDefault: IItemComponent;
  let expectedResult: IItemComponent | IItemComponent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItemComponentService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
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

    it('should create a ItemComponent', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ItemComponent()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItemComponent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItemComponent', () => {
      const patchObject = Object.assign({}, new ItemComponent());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItemComponent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
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

    it('should delete a ItemComponent', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addItemComponentToCollectionIfMissing', () => {
      it('should add a ItemComponent to an empty array', () => {
        const itemComponent: IItemComponent = { id: 123 };
        expectedResult = service.addItemComponentToCollectionIfMissing([], itemComponent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemComponent);
      });

      it('should not add a ItemComponent to an array that contains it', () => {
        const itemComponent: IItemComponent = { id: 123 };
        const itemComponentCollection: IItemComponent[] = [
          {
            ...itemComponent,
          },
          { id: 456 },
        ];
        expectedResult = service.addItemComponentToCollectionIfMissing(itemComponentCollection, itemComponent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItemComponent to an array that doesn't contain it", () => {
        const itemComponent: IItemComponent = { id: 123 };
        const itemComponentCollection: IItemComponent[] = [{ id: 456 }];
        expectedResult = service.addItemComponentToCollectionIfMissing(itemComponentCollection, itemComponent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemComponent);
      });

      it('should add only unique ItemComponent to an array', () => {
        const itemComponentArray: IItemComponent[] = [{ id: 123 }, { id: 456 }, { id: 34237 }];
        const itemComponentCollection: IItemComponent[] = [{ id: 123 }];
        expectedResult = service.addItemComponentToCollectionIfMissing(itemComponentCollection, ...itemComponentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itemComponent: IItemComponent = { id: 123 };
        const itemComponent2: IItemComponent = { id: 456 };
        expectedResult = service.addItemComponentToCollectionIfMissing([], itemComponent, itemComponent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemComponent);
        expect(expectedResult).toContain(itemComponent2);
      });

      it('should accept null and undefined values', () => {
        const itemComponent: IItemComponent = { id: 123 };
        expectedResult = service.addItemComponentToCollectionIfMissing([], null, itemComponent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemComponent);
      });

      it('should return initial array if no ItemComponent is added', () => {
        const itemComponentCollection: IItemComponent[] = [{ id: 123 }];
        expectedResult = service.addItemComponentToCollectionIfMissing(itemComponentCollection, undefined, null);
        expect(expectedResult).toEqual(itemComponentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
