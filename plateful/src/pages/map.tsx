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
      try {
        const response = await fetch("/api/predictions");
        const data = await response.json();

        if (data.length > 0) {
          // Use the first store as the main grocery store
          const firstRecord = data[0];
          const groceryStore: GroceryStore = {
            coords: [parseFloat(firstRecord.store_location_x), parseFloat(firstRecord.store_location_y)],
          };

          // Get unique food banks with their highest predicted weights
          const foodBankMap = new Map();
          data.forEach((record: any) => {
            const bankId = record.bank_id;
            const weight = parseFloat(record.predicted_weight);
            
            if (!foodBankMap.has(bankId) || weight > foodBankMap.get(bankId).weight) {
              foodBankMap.set(bankId, {
                coords: [parseFloat(record.bank_location_x), parseFloat(record.bank_location_y)],
                weight: weight
              });
            }
          });

          const foodBanks: FoodBank[] = Array.from(foodBankMap.values()).slice(0, 8);

          setGroceryStore(groceryStore);
          setFoodBanks(foodBanks);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
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