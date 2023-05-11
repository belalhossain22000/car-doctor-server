const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middleware

app.use(cors());
app.use(express.json());

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dp3om9f.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    //------------------------------start from here my work------------------------
    const database = client.db("carDoctor");
    const carDoctorCollectons = database.collection("services");
    const bookigCollections = database.collection("booking");

    //get all data
    app.get("/services", async (req, res) => {
      const cursor = carDoctorCollectons.find();
      const results = await cursor.toArray();
      res.send(results);
    });
    //get single data by id

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, price: 1, img: 1, service_id: 1 },
      };

      const results = await carDoctorCollectons.findOne(query, options);
      res.send(results);
    });


    //post data booking service 

    app.post("/booking", async (req, res)=>{
        const boking = req.body;
        const result = await bookigCollections.insertOne(boking);
        res.send(result);

    })
    //------------------------------end  from here my work------------------------

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
  res.send("car doctor is running");
});

app.listen(port, () => {
  console.log(`car doctor listening on ${port}`);
});
