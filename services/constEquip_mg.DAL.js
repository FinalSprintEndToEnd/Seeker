////////////////////////////////////////////////
const { client } = require("./constEquip_mg.DB_ACCESS");
const { ObjectId } = require("mongodb");

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
const getEquipment = async (req, res, query) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Construct the filter based on the search query
  const filter = {
    equipment_type: query,
  };

  // Fetch equipment data from the collection with the filter
  await collection
    .find(filter)
    .toArray()
    .then((equipment) => {
      // console.log(equipment);
      res.render("search.ejs", { equipment: equipment, req: req });
    })
    .catch((error) => {
      console.error("Error retrieving equipment data:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    });
};

// Define the function to delete equipment data
const deleteEquipment = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const equipmentId = req.params.id; // Assuming you're passing the equipment ID in the URL

  try {
    const deleteResult = await collection.deleteOne({
      _id: new ObjectId(equipmentId),
    });
    if (deleteResult.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Equipment data deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Equipment not found",
      });
    }
  } catch (error) {
    console.error("Error deleting equipment data:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Define the function to add equipment data
const addEquipment = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Assuming you have the equipment data in the request body
  const equipmentData = req.body;

  try {
    const insertResult = await collection.insertOne(equipmentData);
    res.status(201).json({
      success: true,
      message: "Equipment data added successfully",
      data: insertResult.ops[0], // Return the inserted equipment data
    });
  } catch (error) {
    console.error("Error adding equipment data:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

module.exports = { getEquipment, addEquipment, deleteEquipment };
