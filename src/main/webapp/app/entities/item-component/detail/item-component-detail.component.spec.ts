import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItemComponentDetailComponent } from './item-component-detail.component';

describe('ItemComponent Management Detail Component', () => {
  let comp: ItemComponentDetailComponent;
  let fixture: ComponentFixture<ItemComponentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemComponentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itemComponent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItemComponentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItemComponentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itemComponent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itemComponent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
