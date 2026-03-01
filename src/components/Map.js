
// Displaying the map
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Displaying routes
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Displaying the side panel
import Panel from "./Panel";

// Handling clicks
import { useState } from "react";

// Dummy data
const events = {
  meeting: {name: "ICS Club Meeting", lat: 33.64409248179911, lon: -117.84189430873124},
  speaker: {name: "Taco Tuesday", lat: 33.64541181255151, lon: -117.83930633900609},
  fair: {name: "Guest Speaker", lat: 33.64898834262725, lon: -117.84224909764187},
  movie: {name: "Screen on the Green", lat: 33.6461, lon: -117.8427},
};

const landmarks = {
  park: {name: "Screen on the Green", lat: 33.6461, lon: -117.8427},
  dorms: {name: "Home", lat: 33.6452401375453, lon: -117.83732909889765}
};

// Pin icons
const location_pin = L.icon({
  iconUrl: "location_pin.png", 
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32] 
});

const home_pin = L.icon({
  iconUrl: "home_icon.png", 
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32] 
});

// Used to draw a route from two locations
function Routing({ start, end }) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      // position: null,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "foot"  
      }),
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      // position: null,
      itinerary: false,
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      createMarker: () => null,
      lineOptions: {
      styles: [{ color: "blue", weight: 4 }]
  }
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
}

// Returns the map
function Map() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [routeEvent, setRouteEvent] = useState(null);

  // Clear the route whenever a new event is selected
  useEffect(() => {
    setRouteEvent(null);
  }, [selectedEvent]);

  const center_location = [landmarks.park.lat, landmarks.park.lon + 0.0015];

  return (

    // A full screen div that contains the map and sidebar
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      
      {/* Displays the map */}
      <MapContainer 

        center={center_location} 
        zoom={16.5} 
        style={{ width: "100%", height: "100%" }}
      >
          
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Displays a pin for the home location */}
      <Marker key={landmarks.dorms.name} position={[landmarks.dorms.lat, landmarks.dorms.lon]} icon={home_pin}> 
        <Popup>{landmarks.dorms.name}</Popup>
      </Marker>

      {/* Displays a pin for each event */}
      {Object.values(events).map(location => (
        <Marker key={location.name} 
                position={[location.lat, location.lon]} icon={location_pin}
                eventHandlers={{
                  click: () => setSelectedEvent(location)
                }}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}

      {routeEvent && (
        <Routing
          start={[landmarks.dorms.lat, landmarks.dorms.lon]}
          end={[routeEvent.lat, routeEvent.lon]}
        />
      )}

      </MapContainer>

      <Panel campus_events={events} 
             selectedEvent={selectedEvent} 
             setSelectedEvent={setSelectedEvent}
             setRouteEvent={setRouteEvent}/>
    </div>
  );
}

export default Map;
