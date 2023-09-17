import { useUndoRedo } from 'lib/useDrawHistory';
import { useGetPolygonData } from 'lib/useGetPolygonData';
import './Toolbar.css';
import { PolygonStyleProps } from 'lib';

const Toolbar = ({
  maxPolygons,
  setMaxPolygons,
  config,
  setConfig,
}: {
  maxPolygons: number;
  config: PolygonStyleProps;

  setMaxPolygons: (maxPolygons: number) => void;
  setConfig: (config: PolygonStyleProps) => void;
}) => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { polygons } = useGetPolygonData();
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
          onChange={(e) =>
            setConfig({ ...config, vertexColor: e.target.value })
          }
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
          placeholder="Enter polygon fill color"
          value={config.vertexRadius}
          onChange={(e) =>
            setConfig({ ...config, vertexRadius: +e.target.value })
          }
        />
      </div>
      <div>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
      <div>Points: </div>
      <div className="points-wrapper">
        {polygons.map((polygon, index) => (
          <div key={index}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(polygon.points)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
