import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBlockDefinition } from '../block-definition.model';

@Component({
  selector: 'jhi-block-definition-detail',
  templateUrl: './block-definition-detail.component.html',
})
export class BlockDefinitionDetailComponent implements OnInit {
  blockDefinition: IBlockDefinition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blockDefinition }) => {
      this.blockDefinition = blockDefinition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
