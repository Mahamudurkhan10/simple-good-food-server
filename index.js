const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT||5000;
app.use(cors());
app.use(express.json())
 

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.6gwdl3v.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster;`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
    const db = client.db('simplefood')
    const usersCollections = db.collection('users')
    app.get('/users',async(req,res)=>{
       const result = await usersCollections.find().toArray()
       res.send(result)
    })
    app.post('/users',async(req,res)=>{
      const body = req.body;
       const result = await usersCollections.insertOne(body)
       res.send(result)
    })
    // Send a ping to confirm a successful connection

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);


app.get('/',async(req,res)=>{
     res.send('simple good foods server is running')
})
app.listen(port,async(req,res)=>{
     console.log(`simple good foods server is running on port `,port)
})

