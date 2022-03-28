import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItemComponent } from '../item-component.model';

@Component({
  selector: 'jhi-item-component-detail',
  templateUrl: './item-component-detail.component.html',
})
export class ItemComponentDetailComponent implements OnInit {
  itemComponent: IItemComponent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemComponent }) => {
      this.itemComponent = itemComponent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
