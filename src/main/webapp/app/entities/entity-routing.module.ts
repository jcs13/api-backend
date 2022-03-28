import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'simulation',
        data: { pageTitle: 'Simulations' },
        loadChildren: () => import('./simulation/simulation.module').then(m => m.SimulationModule),
      },
      {
        path: 'course',
        data: { pageTitle: 'Courses' },
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
      },
      {
        path: 'step',
        data: { pageTitle: 'Steps' },
        loadChildren: () => import('./step/step.module').then(m => m.StepModule),
      },
      {
        path: 'block',
        data: { pageTitle: 'Blocks' },
        loadChildren: () => import('./block/block.module').then(m => m.BlockModule),
      },
      {
        path: 'business-unit',
        data: { pageTitle: 'BusinessUnits' },
        loadChildren: () => import('./business-unit/business-unit.module').then(m => m.BusinessUnitModule),
      },
      {
        path: 'offer',
        data: { pageTitle: 'Offers' },
        loadChildren: () => import('./offer/offer.module').then(m => m.OfferModule),
      },
      {
        path: 'offer-composition',
        data: { pageTitle: 'OfferCompositions' },
        loadChildren: () => import('./offer-composition/offer-composition.module').then(m => m.OfferCompositionModule),
      },
      {
        path: 'course-definition',
        data: { pageTitle: 'CourseDefinitions' },
        loadChildren: () => import('./course-definition/course-definition.module').then(m => m.CourseDefinitionModule),
      },
      {
        path: 'step-definition',
        data: { pageTitle: 'StepDefinitions' },
        loadChildren: () => import('./step-definition/step-definition.module').then(m => m.StepDefinitionModule),
      },
      {
        path: 'step-transition',
        data: { pageTitle: 'StepTransitions' },
        loadChildren: () => import('./step-transition/step-transition.module').then(m => m.StepTransitionModule),
      },
      {
        path: 'block-definition',
        data: { pageTitle: 'BlockDefinitions' },
        loadChildren: () => import('./block-definition/block-definition.module').then(m => m.BlockDefinitionModule),
      },
      {
        path: 'item-component',
        data: { pageTitle: 'ItemComponents' },
        loadChildren: () => import('./item-component/item-component.module').then(m => m.ItemComponentModule),
      },
      {
        path: 'block-transition',
        data: { pageTitle: 'BlockTransitions' },
        loadChildren: () => import('./block-transition/block-transition.module').then(m => m.BlockTransitionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
