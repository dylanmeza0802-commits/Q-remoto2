export default function FloorLayout({ floors = 1, lanes = 2 }) {
  return (
    <div className="layout-preview">
      {Array.from({ length: floors }, (_, fi) => (
        <div key={fi}>
          {floors > 1 && (
            <p className="floor-label" style={{ marginBottom:6 }}>Piso {fi + 1}</p>
          )}
          <div className="layout-floor">
            {Array.from({ length: lanes }, (_, li) => {
              const n = fi * lanes + li + 1;
              return (
                <div className="layout-lane" key={li}>
                  <p className="layout-lane-name">Fila {n}</p>
                  <p className="layout-lane-floor">Piso {fi + 1}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}