import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BlockDefinitionService } from '../service/block-definition.service';

import { BlockDefinitionComponent } from './block-definition.component';

describe('BlockDefinition Management Component', () => {
  let comp: BlockDefinitionComponent;
  let fixture: ComponentFixture<BlockDefinitionComponent>;
  let service: BlockDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BlockDefinitionComponent],
    })
      .overrideTemplate(BlockDefinitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlockDefinitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BlockDefinitionService);

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
    expect(comp.blockDefinitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
