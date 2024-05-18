import React from 'react';
import { Canvas } from '../../src/lib/Canvas';
import type { PolygonInputProps } from '../../src/lib/types';
import yellow from '../assets/yellow.webp';

describe('Canvas', () => {
  let _initialPolygons: PolygonInputProps[];

  beforeEach(() => {
    cy.viewport(800, 800);
    cy.fixture('polygons.json').then((polygons) => {
      _initialPolygons = polygons;
      cy.mount(<Canvas imageSource={yellow} imageSize={{ width: 622, height: 622 }} />);
    });
  });

  it('renders', () => {
    cy.get('canvas').should('be.visible');
  });

  it('canvas image width set correctly', () => {
    cy.wait(1000).then(() => {
      cy.get('canvas').should('have.attr', 'width', '622');
      cy.get('canvas').should('have.attr', 'height', '622');
    });
  });
  it('renders initial polygons', () => {
    cy.mount(
      <Canvas imageSource={yellow} imageSize={{ width: 622, height: 622 }} maxPolygons={3} />,
      {
        initialPolygons: _initialPolygons,
      },
    );
    cy.wait(1000).then(() => {
      cy.get('canvas').then((canvas) => {
        const ctx = canvas[0].getContext('2d');
        if (!ctx) {
          throw new Error('Canvas not found');
        }
        // Verify initial polygons
        _initialPolygons.forEach((polygon) => {
          polygon.points.forEach(([x, y]) => {
            const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
            // color of vertex
            expect(r).to.be.eq(255);
            expect(g).to.be.eq(1);
            expect(b).to.be.eq(154);
            expect(a).to.be.eq(255);
          });
        });
      });
    });
  });
  it('adds a polygon', () => {
    cy.wait(1000);
    cy.get('canvas')
      .trigger('mousedown', 582, 75)
      .trigger('mouseup')
      .trigger('mousemove', 453, 199);
    cy.get('canvas')
      .trigger('mousedown', 453, 199)
      .trigger('mouseup')
      .trigger('mousemove', 464, 269);
    cy.get('canvas')
      .trigger('mousedown', 464, 269)
      .trigger('mouseup')
      .trigger('mousemove', 604, 229);
    cy.get('canvas')
      .trigger('mousedown', 604, 229)
      .trigger('mouseup')
      .trigger('mousemove', 582, 75);
    cy.get('canvas').trigger('mousedown', 582, 75).trigger('mouseup').screenshot();
  });
  it('prevent to add new polygon if maxPolygon', () => {
    cy.mount(<Canvas imageSource={yellow} maxPolygons={0} />);
    const point = [600, 75];
    cy.get('canvas').trigger('mousedown', point).trigger('mouseup');

    cy.wait(1000).then(() => {
      cy.get('canvas').then((canvas) => {
        const ctx = canvas[0].getContext('2d');
        const imageData = ctx?.getImageData(0, 0, canvas[0].width, canvas[0].height);

        if (imageData) {
          const pixelIndex = (point[1] * canvas[0].width + point[0]) * 4;
          const [r, g, b, a] = imageData.data.slice(pixelIndex, pixelIndex + 4);
          expect(r).to.be.eq(250);
          expect(g).to.be.eq(215);
          expect(b).to.be.eq(106);
          expect(a).to.be.eq(255);
        } else {
          throw new Error('Canvas not found');
        }
      });
    });
  });
});
