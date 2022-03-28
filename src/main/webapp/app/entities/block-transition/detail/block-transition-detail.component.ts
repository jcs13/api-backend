import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBlockTransition } from '../block-transition.model';

@Component({
  selector: 'jhi-block-transition-detail',
  templateUrl: './block-transition-detail.component.html',
})
export class BlockTransitionDetailComponent implements OnInit {
  blockTransition: IBlockTransition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blockTransition }) => {
      this.blockTransition = blockTransition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
