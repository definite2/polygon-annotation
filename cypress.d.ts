import { MountOptions, MountReturn } from 'cypress/react18';
import { PolygonInputProps } from './src/lib/types';

declare global {
  namespace Cypress {
    interface Chainable {
      mount(
        component: React.ReactNode,
        options?: MountOptions & { initialPolygons?: PolygonInputProps[] },
      ): Cypress.Chainable<MountReturn>;
    }
  }
}
