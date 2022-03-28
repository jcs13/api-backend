import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BlockDefinitionService } from '../service/block-definition.service';
import { IBlockDefinition, BlockDefinition } from '../block-definition.model';
import { IItemComponent } from 'app/entities/item-component/item-component.model';
import { ItemComponentService } from 'app/entities/item-component/service/item-component.service';

import { BlockDefinitionUpdateComponent } from './block-definition-update.component';

describe('BlockDefinition Management Update Component', () => {
  let comp: BlockDefinitionUpdateComponent;
  let fixture: ComponentFixture<BlockDefinitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let blockDefinitionService: BlockDefinitionService;
  let itemComponentService: ItemComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BlockDefinitionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BlockDefinitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlockDefinitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blockDefinitionService = TestBed.inject(BlockDefinitionService);
    itemComponentService = TestBed.inject(ItemComponentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call itemComponent query and add missing value', () => {
      const blockDefinition: IBlockDefinition = { id: 456 };
      const itemComponent: IItemComponent = { id: 29335 };
      blockDefinition.itemComponent = itemComponent;

      const itemComponentCollection: IItemComponent[] = [{ id: 42707 }];
      jest.spyOn(itemComponentService, 'query').mockReturnValue(of(new HttpResponse({ body: itemComponentCollection })));
      const expectedCollection: IItemComponent[] = [itemComponent, ...itemComponentCollection];
      jest.spyOn(itemComponentService, 'addItemComponentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blockDefinition });
      comp.ngOnInit();

      expect(itemComponentService.query).toHaveBeenCalled();
      expect(itemComponentService.addItemComponentToCollectionIfMissing).toHaveBeenCalledWith(itemComponentCollection, itemComponent);
      expect(comp.itemComponentsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const blockDefinition: IBlockDefinition = { id: 456 };
      const itemComponent: IItemComponent = { id: 62227 };
      blockDefinition.itemComponent = itemComponent;

      activatedRoute.data = of({ blockDefinition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(blockDefinition));
      expect(comp.itemComponentsCollection).toContain(itemComponent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlockDefinition>>();
      const blockDefinition = { id: 123 };
      jest.spyOn(blockDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blockDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blockDefinition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(blockDefinitionService.update).toHaveBeenCalledWith(blockDefinition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlockDefinition>>();
      const blockDefinition = new BlockDefinition();
      jest.spyOn(blockDefinitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blockDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blockDefinition }));
      saveSubject.complete();

      // THEN
      expect(blockDefinitionService.create).toHaveBeenCalledWith(blockDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlockDefinition>>();
      const blockDefinition = { id: 123 };
      jest.spyOn(blockDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blockDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blockDefinitionService.update).toHaveBeenCalledWith(blockDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackItemComponentById', () => {
      it('Should return tracked ItemComponent primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackItemComponentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
