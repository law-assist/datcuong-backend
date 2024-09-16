const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://devtest:dev123@law.tfz4t8e.mongodb.net/?retryWrites=true&w=majority&appName=Law";

const localUri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
//check connect
client.connect((err: any) => {
  if (err) {
    console.log("Error occurred while connecting to MongoDB Atlas...\n", err);
  }
  console.log("Connected to MongoDB Atlas...");
});

const saveData = async function (data: any) {
  try {
    // const client = await run();
    const db = client.db("law_dev");
    const collection = db.collection("lawData");
    const existingData = await collection.findOne({
      name: data.name,
    });
    if (existingData) {
      console.log("Văn bản này đã được crawl", data.name);
      return;
    }
    await collection.insertOne(data);
    console.log("Data saved to MongoDB:");
  } catch (error) {
    console.error("Error occurred while saving data to MongoDB:", error);
    throw error;
  }
};

//check if the data is already in the database
const checkLink = async function (link: string) {
  try {
    const db = client.db("law_dev");
    const collection = db.collection("lawData");
    const existingLink = await collection.findOne({
      pdf_link: link,
    });
    if (existingLink) {
      return existingLink;
    }
    return false;
  } catch (error) {
    console.error("Error occurred while checking data in MongoDB:", error);
    throw error;
  }
};

export { saveData, checkLink, client };