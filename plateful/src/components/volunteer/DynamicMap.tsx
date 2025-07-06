import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Circle } from "react-leaflet";
import L from "leaflet";

type Coordinate = [number, number];

interface FoodBank {
  coords: Coordinate;
  weight: number;
}

interface GroceryStore {
  coords: Coordinate;
}

interface DynamicMapProps {
  groceryStore: GroceryStore;
  foodBanks: FoodBank[];
  initialCenter: Coordinate;
  visible: boolean;
}

const getPinColor = (weight: number) => {
  if (weight > 0.65) return "green";
  if (weight > 0.45 && weight <= 0.65) return "yellow";
  if (weight > 0.2 && weight <= 0.45) return "orange";
  return "red"
};

const groceryStoreIcon = L.icon({
  iconUrl: "/images/grocery-store-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const foodBankIcon = L.icon({
  iconUrl: "/images/food-bank-icon.png",
  iconSize: [20, 33],
  iconAnchor: [10, 33],
});

const DynamicMap: React.FC<DynamicMapProps> = ({ groceryStore, foodBanks, initialCenter, visible }) => {
  return (
    <MapContainer center={[44.24, -76.5]} zoom={14} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {visible && (
        <>
          <Marker position={groceryStore.coords} icon={groceryStoreIcon} />
          {foodBanks.map((foodBank, index) => (
            <React.Fragment key={index}>
              <Marker position={foodBank.coords} icon={foodBankIcon} />
              <Circle // Circle around food bank
                center={foodBank.coords}
                radius={50} // Adjust the radius as needed
                pathOptions={{ color: getPinColor(foodBank.weight), fillColor: getPinColor(foodBank.weight), fillOpacity: 0.5 }}
              />
              <Polyline // Line from grocery store to food bank
                positions={[groceryStore.coords, foodBank.coords]}
                pathOptions={{ color: getPinColor(foodBank.weight) }}
              />
            </React.Fragment>
          ))}
        </>
      )}
      
    </MapContainer>
  );
};

export default DynamicMap;