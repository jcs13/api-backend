import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BlockDefinitionDetailComponent } from './block-definition-detail.component';

describe('BlockDefinition Management Detail Component', () => {
  let comp: BlockDefinitionDetailComponent;
  let fixture: ComponentFixture<BlockDefinitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockDefinitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ blockDefinition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BlockDefinitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BlockDefinitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load blockDefinition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.blockDefinition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
