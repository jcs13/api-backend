import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICourseDefinition, CourseDefinition } from '../course-definition.model';

import { CourseDefinitionService } from './course-definition.service';

describe('CourseDefinition Service', () => {
  let service: CourseDefinitionService;
  let httpMock: HttpTestingController;
  let elemDefault: ICourseDefinition;
  let expectedResult: ICourseDefinition | ICourseDefinition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CourseDefinitionService);
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

    it('should create a CourseDefinition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new CourseDefinition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CourseDefinition', () => {
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

    it('should partial update a CourseDefinition', () => {
      const patchObject = Object.assign({}, new CourseDefinition());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CourseDefinition', () => {
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

    it('should delete a CourseDefinition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCourseDefinitionToCollectionIfMissing', () => {
      it('should add a CourseDefinition to an empty array', () => {
        const courseDefinition: ICourseDefinition = { id: 123 };
        expectedResult = service.addCourseDefinitionToCollectionIfMissing([], courseDefinition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(courseDefinition);
      });

      it('should not add a CourseDefinition to an array that contains it', () => {
        const courseDefinition: ICourseDefinition = { id: 123 };
        const courseDefinitionCollection: ICourseDefinition[] = [
          {
            ...courseDefinition,
          },
          { id: 456 },
        ];
        expectedResult = service.addCourseDefinitionToCollectionIfMissing(courseDefinitionCollection, courseDefinition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CourseDefinition to an array that doesn't contain it", () => {
        const courseDefinition: ICourseDefinition = { id: 123 };
        const courseDefinitionCollection: ICourseDefinition[] = [{ id: 456 }];
        expectedResult = service.addCourseDefinitionToCollectionIfMissing(courseDefinitionCollection, courseDefinition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(courseDefinition);
      });

      it('should add only unique CourseDefinition to an array', () => {
        const courseDefinitionArray: ICourseDefinition[] = [{ id: 123 }, { id: 456 }, { id: 39814 }];
        const courseDefinitionCollection: ICourseDefinition[] = [{ id: 123 }];
        expectedResult = service.addCourseDefinitionToCollectionIfMissing(courseDefinitionCollection, ...courseDefinitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const courseDefinition: ICourseDefinition = { id: 123 };
        const courseDefinition2: ICourseDefinition = { id: 456 };
        expectedResult = service.addCourseDefinitionToCollectionIfMissing([], courseDefinition, courseDefinition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(courseDefinition);
        expect(expectedResult).toContain(courseDefinition2);
      });

      it('should accept null and undefined values', () => {
        const courseDefinition: ICourseDefinition = { id: 123 };
        expectedResult = service.addCourseDefinitionToCollectionIfMissing([], null, courseDefinition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(courseDefinition);
      });

      it('should return initial array if no CourseDefinition is added', () => {
        const courseDefinitionCollection: ICourseDefinition[] = [{ id: 123 }];
        expectedResult = service.addCourseDefinitionToCollectionIfMissing(courseDefinitionCollection, undefined, null);
        expect(expectedResult).toEqual(courseDefinitionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
