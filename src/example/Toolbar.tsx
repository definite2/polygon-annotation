import { useUndoRedo } from 'lib/useDrawHistory';
import { useGetPolygonData } from 'lib/useGetPolygonData';
import './Toolbar.css';

const Toolbar = ({
  maxPolygons,
  setMaxPolygons,
}: {
  maxPolygons: number;
  setMaxPolygons: (maxPolygons: number) => void;
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
