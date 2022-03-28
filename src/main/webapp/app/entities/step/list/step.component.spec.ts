import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StepService } from '../service/step.service';

import { StepComponent } from './step.component';

describe('Step Management Component', () => {
  let comp: StepComponent;
  let fixture: ComponentFixture<StepComponent>;
  let service: StepService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StepComponent],
    })
      .overrideTemplate(StepComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StepComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StepService);

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
    expect(comp.steps?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
