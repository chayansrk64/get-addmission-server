const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hkduy2w.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();


    const collegeCollection = client.db("addmissionDB").collection("college");
    const studentCollection = client.db("addmissionDB").collection("student");
    const reviewCollection = client.db("addmissionDB").collection("reviews");
    const userCollection = client.db("addmissionDB").collection("users");


    // users api
    app.post('/users', async(req, res) => {
       const user = req.body;
        
       const query =  {email: user.email}
       const existingUser = await userCollection.findOne(query);
        
       if(existingUser){
        return res.send({message: 'User Already Exists'})
       }
       const result = await userCollection.insertOne(user);
       res.send(result)
    })

    app.get('/users/:email', async(req, res) => {
        const email = req.params.email;
        const user = await userCollection.findOne({email})
        if(!user){
          return res.send({message: 'user not found'})
        }
        res.send(user)
    })

  // get all college data
    app.get('/college', async(req, res) => {
        const result = await collegeCollection.find().toArray();
        res.send(result)
    })


    // api with search query

    // app.get('/college', async(req, res) => {
    //     const search = req.query.search;
        
    //     const query = {college_name: {$regex: search, $options: "i"} }
    //     const cursor =  collegeCollection.find(query);
    //     const result = await cursor.toArray();
    //     res.send(result)
    // })



    // get a single college data
    app.get('/college/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await collegeCollection.findOne(query);
        res.send(result);
    })

    // create students details
    app.post('/students', async(req, res) => {
        const student = req.body;
        const result = await studentCollection.insertOne(student)
        res.send(result)

    })
    // get student details
    app.get('/students', async(req, res) => {
        const result = await studentCollection.find().toArray();
        res.send(result)
    })

    // create review api
    app.post('/reviews', async(req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review)
        res.send(result)
    })

    // get review api
    app.get('/reviews', async(req, res) => {
        const result = await reviewCollection.find().toArray();
        res.send(result)
    })



















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING')
})

app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON ${port}`)
})