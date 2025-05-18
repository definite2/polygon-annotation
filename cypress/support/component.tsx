import './commands';
import React from 'react';
import { mount } from 'cypress/react18';
import { PolygonProvider } from '../../src/lib/context/PolygonContext';
import { PolygonInputProps } from '../../src/lib/types';

import { MountOptions, MountReturn } from 'cypress/react18';

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
  const wrapped = <PolygonProvider initialPolygons={initialPolygons}>{component}</PolygonProvider>;
  return mount(wrapped, mountOptions);
});
