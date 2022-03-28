import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StepDefinitionService } from '../service/step-definition.service';

import { StepDefinitionComponent } from './step-definition.component';

describe('StepDefinition Management Component', () => {
  let comp: StepDefinitionComponent;
  let fixture: ComponentFixture<StepDefinitionComponent>;
  let service: StepDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StepDefinitionComponent],
    })
      .overrideTemplate(StepDefinitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StepDefinitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StepDefinitionService);

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
    expect(comp.stepDefinitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
