import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IStepDefinition, StepDefinition } from '../step-definition.model';
import { StepDefinitionService } from '../service/step-definition.service';

import { StepDefinitionRoutingResolveService } from './step-definition-routing-resolve.service';

describe('StepDefinition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: StepDefinitionRoutingResolveService;
  let service: StepDefinitionService;
  let resultStepDefinition: IStepDefinition | undefined;

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
    routingResolveService = TestBed.inject(StepDefinitionRoutingResolveService);
    service = TestBed.inject(StepDefinitionService);
    resultStepDefinition = undefined;
  });

  describe('resolve', () => {
    it('should return IStepDefinition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultStepDefinition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultStepDefinition).toEqual({ id: 123 });
    });

    it('should return new IStepDefinition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultStepDefinition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultStepDefinition).toEqual(new StepDefinition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as StepDefinition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultStepDefinition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultStepDefinition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
