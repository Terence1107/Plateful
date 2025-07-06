import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import NewHeader from "@/components/volunteer/NewHeader";
import Footer from "../components/home/Footer";
import Papa from "papaparse";

const DynamicMap = dynamic(() => import("../components/volunteer/DynamicMap"), {
  ssr: false, // This line ensures the component is only rendered on the client side
});

interface FoodBank {
  coords: [number, number];
  weight: number;
}

interface GroceryStore {
  coords: [number, number];
}

const MapPage = () => {
  const initialCenter: [number, number] = [44.23, -76.5]; // Set to Kingston Ontario
  const relativeCenter: [number, number] = [44.2312, -76.4860]; // Coordinates used to simulate foodbanks around Kingston 
  const [groceryStore, setGroceryStore] = useState<GroceryStore>({ coords: initialCenter });
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/store_bank_predictions.csv");
      const csvData = await response.text();
      const parsed = Papa.parse(csvData, { header: true });
      const data = parsed.data as any[];

      const groceryStore: GroceryStore = {
        coords: initialCenter,
      };

      const scalingFactor = 0.0002; // used to keep the demo foodbanks within range

      const foodBanks: FoodBank[] = data.slice(7, 15).map((row) => ({
        // Coordinates have calculations to simulate the foodbanks within Kingston region
        coords: [ 
            relativeCenter[0] + (parseFloat(row.Bank_Location_X) - initialCenter[0]) * scalingFactor + 0.005, 
            relativeCenter[1] + (parseFloat(row.Bank_Location_Y) - initialCenter[1]) * scalingFactor - 0.04
        ],
        weight: parseFloat(row.Predicted_Weight),
      }));

      setGroceryStore(groceryStore);
      setFoodBanks(foodBanks);
    };

    fetchData();
  }, []);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <NewHeader toggleVisibility={toggleVisibility}/>
      <div style={{ flex: 1, width: "100%" }}>
        <DynamicMap groceryStore={groceryStore} foodBanks={foodBanks} initialCenter={initialCenter} visible={visible} />
      </div>
      <Footer />
    </div>
  );
};

export default MapPage;