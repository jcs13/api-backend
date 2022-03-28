import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IOfferComposition, OfferComposition } from '../offer-composition.model';
import { OfferCompositionService } from '../service/offer-composition.service';

import { OfferCompositionRoutingResolveService } from './offer-composition-routing-resolve.service';

describe('OfferComposition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OfferCompositionRoutingResolveService;
  let service: OfferCompositionService;
  let resultOfferComposition: IOfferComposition | undefined;

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
    routingResolveService = TestBed.inject(OfferCompositionRoutingResolveService);
    service = TestBed.inject(OfferCompositionService);
    resultOfferComposition = undefined;
  });

  describe('resolve', () => {
    it('should return IOfferComposition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOfferComposition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOfferComposition).toEqual({ id: 123 });
    });

    it('should return new IOfferComposition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOfferComposition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOfferComposition).toEqual(new OfferComposition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as OfferComposition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOfferComposition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOfferComposition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
