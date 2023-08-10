////////////////////////////////////////////////
import { client } from "./constEquip_mg.DB_ACCESS";

////////////////////////////////////////////////
//  connect to database
client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define the database and collection names
const dbName = "construction_equipment";
const collectionName = "cost_details";

// Define the function to get equipment data
const getEquipment = (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Implement the logic to retrieve equipment data
  collection
    .find({})
    .toArray()
    .then((equipment) => {
      res.json(equipment);
    })
    .catch((error) => {
      console.error("Error retrieving equipment data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

export default { getEquipment };
