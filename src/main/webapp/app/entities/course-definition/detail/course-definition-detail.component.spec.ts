import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CourseDefinitionDetailComponent } from './course-definition-detail.component';

describe('CourseDefinition Management Detail Component', () => {
  let comp: CourseDefinitionDetailComponent;
  let fixture: ComponentFixture<CourseDefinitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseDefinitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ courseDefinition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CourseDefinitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CourseDefinitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load courseDefinition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.courseDefinition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
