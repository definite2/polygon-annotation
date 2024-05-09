import React from 'react';
import { useUndoRedo, useGetPolygons, PolygonStyleProps } from '../src/lib';
import './Toolbar.css';

const Toolbar = ({
  maxPolygons,
  showLabel,
  setMaxPolygons,
  setShowLabel,
  config,
  setConfig,
}: {
  maxPolygons: number;
  config: PolygonStyleProps;
  showLabel: boolean;
  setMaxPolygons: (maxPolygons: number) => void;
  setConfig: (config: PolygonStyleProps) => void;
  setShowLabel: (showLabel: boolean) => void;
}) => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { polygons, updateLabel } = useGetPolygons();

  const exportData = () => {
    const data = JSON.stringify(polygons);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'polygon-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  console.log('Toolbar', polygons);
  return (
    <div className="toolbar-wrapper">
      <div>
        <label htmlFor="maxPolygons">Max Polygon Number: </label>
        <input
          id="maxPolygons"
          type="number"
          placeholder="Enter max number of polygons"
          value={maxPolygons}
          onChange={(e) => setMaxPolygons(+e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lineColor">Polygon Line Color: </label>
        <input
          id="lineColor"
          type="color"
          placeholder="Enter polygon line color"
          value={config.lineColor}
          onChange={(e) => setConfig({ ...config, lineColor: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="vertexColor">Vertex Fill Color: </label>
        <input
          id="vertexColor"
          type="color"
          placeholder="Enter polygon vertex color"
          value={config.vertexColor}
          onChange={(e) => setConfig({ ...config, vertexColor: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="vertexColor">Polygon Fill Color: </label>
        <input
          id="fillColor"
          type="text"
          placeholder="Enter polygon fill color"
          value={config.fillColor}
          onChange={(e) => setConfig({ ...config, fillColor: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="vertexRad">Vertex Radius: </label>
        <input
          id="vertexRad"
          type="number"
          placeholder="Enter a value"
          value={config.vertexRadius}
          onChange={(e) => setConfig({ ...config, vertexRadius: +e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="vertexStroke">Vertex Stroke Width: </label>
        <input
          id="vertexStroke"
          type="number"
          placeholder="Enter a value"
          value={config.vertexStrokeWidth}
          onChange={(e) => setConfig({ ...config, vertexStrokeWidth: +e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="showLabel">Show Labels: </label>
        <input
          id="showLabel"
          type="checkbox"
          checked={showLabel}
          onChange={(e) => setShowLabel(e.target.checked)}
        />
      </div>
      {showLabel &&
        polygons.map((p) => (
          <div key={p.id}>
            <label htmlFor={`label-${p.id}`}>Label </label>
            <input
              id={`label-${p.id}`}
              type="text"
              placeholder="Enter a value"
              value={p.label}
              onChange={(e) => {
                updateLabel({ id: p.id, label: e.target.value });
              }}
            />
          </div>
        ))}
      <div>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
      <div>
        <button disabled={!polygons.length} onClick={exportData}>
          Export Data
        </button>
      </div>
      <div className="points-wrapper">
        {polygons.map((polygon) => (
          <div key={polygon.id}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              label:{JSON.stringify(polygon.label)}
              <br />
              points:{JSON.stringify(polygon.points)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
