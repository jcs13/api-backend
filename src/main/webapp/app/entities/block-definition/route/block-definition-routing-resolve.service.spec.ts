import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IBlockDefinition, BlockDefinition } from '../block-definition.model';
import { BlockDefinitionService } from '../service/block-definition.service';

import { BlockDefinitionRoutingResolveService } from './block-definition-routing-resolve.service';

describe('BlockDefinition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BlockDefinitionRoutingResolveService;
  let service: BlockDefinitionService;
  let resultBlockDefinition: IBlockDefinition | undefined;

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
    routingResolveService = TestBed.inject(BlockDefinitionRoutingResolveService);
    service = TestBed.inject(BlockDefinitionService);
    resultBlockDefinition = undefined;
  });

  describe('resolve', () => {
    it('should return IBlockDefinition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBlockDefinition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBlockDefinition).toEqual({ id: 123 });
    });

    it('should return new IBlockDefinition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBlockDefinition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBlockDefinition).toEqual(new BlockDefinition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BlockDefinition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBlockDefinition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBlockDefinition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
