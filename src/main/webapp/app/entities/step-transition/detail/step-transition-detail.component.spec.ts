import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StepTransitionDetailComponent } from './step-transition-detail.component';

describe('StepTransition Management Detail Component', () => {
  let comp: StepTransitionDetailComponent;
  let fixture: ComponentFixture<StepTransitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepTransitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ stepTransition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StepTransitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StepTransitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load stepTransition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.stepTransition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
