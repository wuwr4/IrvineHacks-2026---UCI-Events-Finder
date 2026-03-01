
// The sidebar panel on top of the map 
import 'bootstrap/dist/css/bootstrap.min.css';

function Panel({campus_events, selectedEvent, setSelectedEvent, setRouteEvent}) {
  return (

    // Positioning attributes
      <div style={{
        position: "absolute",
        width: "30%",      // 30% of map width
        height: "95%",    // 95% of map height
        top: 0,
        right: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)",  // semi-transparent
        padding: "20px",
        margin: "20px",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.3)",
        borderRadius: "10px",
        zIndex: 1000,      // ensures it's on top of map
        overflowY: "auto"
      }}>

        <h1> Campus Events </h1>
        <h2> (March 1 - 8) </h2>    

        <div className="events_list mt-3">
        {Object.values(campus_events).map(event => (
          <div
            key={event.name}
            className="card mb-3"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedEvent(event)}
          >
            <div className="card-body">
              {event.name}
            </div>
          </div>
        ))}
        {selectedEvent && (

          // Card with more info
          <div className="selectedEvent text-center"> 
          <div className="card border-secondary">
            <div className="card-body">
              <h5>Selected Event:</h5>
              {selectedEvent.name}
            </div>
          </div>
            <button className="btn btn-primary mt-3"
                    onClick={() => setRouteEvent(selectedEvent)}>Show Route</button>
          </div>
          
        )}

        </div>

      </div>
  );
}

export default Panel;
