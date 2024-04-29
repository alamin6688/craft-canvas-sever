const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const dotEnv = require("dotenv");
dotEnv.config();
const port = process.env.PORT || 5000;
const app = express();

//middleware middle
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended:true}));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrlryfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollections = client.db("craftCanvus").collection("users");
    const craftCollections = client.db("craftCanvus").collection("crafts");
    const categoryCollections = client
      .db("craftCanvus")
      .collection("categories");

    //** Operations */

    //  Post a User to mongodb
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollections.insertOne(user);
      res.send(result);
    });

    //get users
    app.get("/users", async (req, res) => {
      const cursor = userCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get specified user
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollections.findOne(query);
      res.send(result);
    });

    //post a cradt item
    app.post("/crafts", async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollections.insertOne(newCraft);
      res.send(result);
    });

    //get all crafts
    app.get("/crafts", async (req, res) => {
      const cursor = craftCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get a craft by id
    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollections.findOne(query);
      res.send(result);
    });

    // update specific Tourists spot
    app.put("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const craft = {
        $set: {
          itemName: updatedCraft.itemName,
          subCategoryName: updatedCraft.subCategoryName,
          rating: updatedCraft.rating,
          description: updatedCraft.description,
          price: updatedCraft.price,
          customization: updatedCraft.customization,
          processingTime: updatedCraft.processingTime,
          stocStatus: updatedCraft.stocStatus,
          name: updatedCraft.name,
          email: updatedCraft.email,
          image: updatedCraft.image,
        },
      };
      const result = await craftCollections.updateOne(filter, craft, options);
      res.send(result);
    });

    //delete specific craft
    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollections.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is listening");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
