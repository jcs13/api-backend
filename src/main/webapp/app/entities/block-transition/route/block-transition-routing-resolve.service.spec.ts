import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IBlockTransition, BlockTransition } from '../block-transition.model';
import { BlockTransitionService } from '../service/block-transition.service';

import { BlockTransitionRoutingResolveService } from './block-transition-routing-resolve.service';

describe('BlockTransition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BlockTransitionRoutingResolveService;
  let service: BlockTransitionService;
  let resultBlockTransition: IBlockTransition | undefined;

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
    routingResolveService = TestBed.inject(BlockTransitionRoutingResolveService);
    service = TestBed.inject(BlockTransitionService);
    resultBlockTransition = undefined;
  });

  describe('resolve', () => {
    it('should return IBlockTransition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBlockTransition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBlockTransition).toEqual({ id: 123 });
    });

    it('should return new IBlockTransition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBlockTransition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBlockTransition).toEqual(new BlockTransition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BlockTransition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBlockTransition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBlockTransition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
