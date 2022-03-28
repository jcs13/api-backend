import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StepDefinitionDetailComponent } from './step-definition-detail.component';

describe('StepDefinition Management Detail Component', () => {
  let comp: StepDefinitionDetailComponent;
  let fixture: ComponentFixture<StepDefinitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepDefinitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ stepDefinition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StepDefinitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StepDefinitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load stepDefinition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.stepDefinition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
