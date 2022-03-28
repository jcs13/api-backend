import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ICourseDefinition, CourseDefinition } from '../course-definition.model';
import { CourseDefinitionService } from '../service/course-definition.service';

import { CourseDefinitionRoutingResolveService } from './course-definition-routing-resolve.service';

describe('CourseDefinition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CourseDefinitionRoutingResolveService;
  let service: CourseDefinitionService;
  let resultCourseDefinition: ICourseDefinition | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(CourseDefinitionRoutingResolveService);
    service = TestBed.inject(CourseDefinitionService);
    resultCourseDefinition = undefined;
  });

  describe('resolve', () => {
    it('should return ICourseDefinition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCourseDefinition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCourseDefinition).toEqual({ id: 123 });
    });

    it('should return new ICourseDefinition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCourseDefinition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCourseDefinition).toEqual(new CourseDefinition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CourseDefinition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCourseDefinition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCourseDefinition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
