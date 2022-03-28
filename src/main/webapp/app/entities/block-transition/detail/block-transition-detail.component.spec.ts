import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BlockTransitionDetailComponent } from './block-transition-detail.component';

describe('BlockTransition Management Detail Component', () => {
  let comp: BlockTransitionDetailComponent;
  let fixture: ComponentFixture<BlockTransitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockTransitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ blockTransition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BlockTransitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BlockTransitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load blockTransition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.blockTransition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
