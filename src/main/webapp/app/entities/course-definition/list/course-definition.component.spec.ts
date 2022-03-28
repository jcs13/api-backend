import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CourseDefinitionService } from '../service/course-definition.service';

import { CourseDefinitionComponent } from './course-definition.component';

describe('CourseDefinition Management Component', () => {
  let comp: CourseDefinitionComponent;
  let fixture: ComponentFixture<CourseDefinitionComponent>;
  let service: CourseDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CourseDefinitionComponent],
    })
      .overrideTemplate(CourseDefinitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CourseDefinitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CourseDefinitionService);

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
    expect(comp.courseDefinitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
