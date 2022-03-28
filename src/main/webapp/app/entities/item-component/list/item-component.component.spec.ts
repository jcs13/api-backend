import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ItemComponentService } from '../service/item-component.service';

import { ItemComponentComponent } from './item-component.component';

describe('ItemComponent Management Component', () => {
  let comp: ItemComponentComponent;
  let fixture: ComponentFixture<ItemComponentComponent>;
  let service: ItemComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ItemComponentComponent],
    })
      .overrideTemplate(ItemComponentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemComponentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemComponentService);

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
    expect(comp.itemComponents?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
