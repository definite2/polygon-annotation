import './commands';
import React from 'react';
import { Provider } from 'react-redux';
import { initStore } from '../../src/store';

import { MountOptions, MountReturn, mount } from 'cypress/react18';
import { PolygonInputProps } from '../../src/lib/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount(
        component: React.ReactNode,
        options?: MountOptions & { initialPolygons?: PolygonInputProps[] },
      ): Cypress.Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  const { initialPolygons, ...mountOptions } = options;
  const reduxStore = initStore(initialPolygons);
  const wrapped = <Provider store={reduxStore}>{component}</Provider>;
  return mount(wrapped, mountOptions);
});
