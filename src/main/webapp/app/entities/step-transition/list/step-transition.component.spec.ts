import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StepTransitionService } from '../service/step-transition.service';

import { StepTransitionComponent } from './step-transition.component';

describe('StepTransition Management Component', () => {
  let comp: StepTransitionComponent;
  let fixture: ComponentFixture<StepTransitionComponent>;
  let service: StepTransitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StepTransitionComponent],
    })
      .overrideTemplate(StepTransitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StepTransitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StepTransitionService);

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
    expect(comp.stepTransitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
