import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BlockTransitionService } from '../service/block-transition.service';

import { BlockTransitionComponent } from './block-transition.component';

describe('BlockTransition Management Component', () => {
  let comp: BlockTransitionComponent;
  let fixture: ComponentFixture<BlockTransitionComponent>;
  let service: BlockTransitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BlockTransitionComponent],
    })
      .overrideTemplate(BlockTransitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlockTransitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BlockTransitionService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.blockTransitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
