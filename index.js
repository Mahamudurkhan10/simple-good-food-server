const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT||5000;
app.use(cors());
app.use(express.json())
 


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
    const menusCollections = db.collection('menu')
    app.get('/menus',async(req,res)=>{
       const result = await menusCollections.find().toArray()
       res.send(result)
    })
    app.post('/menus',async(req,res)=>{
     const body = req.body;
      const result = await menusCollections.insertOne(body)
      res.send(result)
   })
   app.get('/menu/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await menusCollections.findOne(query)
        res.send(result)
   })
   app.put('/menuUpdate/:id', async(req,res)=>{
     const id = req.params.id;
     const query = { _id: new ObjectId(id) };
     const options = { upsert: true };
     const updateMenu = req.body;
     const updated = {
       $set: {
          foodName : updateMenu.foodName,
          image : updateMenu.image,
          price : updateMenu.price,
          protein : updateMenu.protein,
          carbs : updateMenu.carbs,
          fat : updateMenu.fat,
          description : updateMenu.description,
          ingredients : updateMenu.ingredients,
          instructions : updateMenu.instructions,
          category : updateMenu.category,
          meal : updateMenu.meal
       }
     };
     const result = await menusCollections.updateOne(query, updated, options);
     res.send(result);
   })
   app.delete('/menuDelete/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await menusCollections.deleteOne(query)
        res.send(result)
   })
     
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

