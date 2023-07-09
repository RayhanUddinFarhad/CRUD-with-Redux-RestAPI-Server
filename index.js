const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());



app.get('/', (req, res) => {


    res.send('Welcome to crud operations')
})




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9qpxu0o.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();
        // Send a ping to confirm a successful connection

        const users = client.db("Users")
        const userInfo = users.collection("UserInfo");




        app.get('/users', async (req, res) => {

            const result = await userInfo.find().toArray()


            res.send(result)
        })



        app.post('/users', async (req, res) => {

            const body = req.body;


            const query = {


                name: body.name,
                email: body.email,
                phone: body.phone,


            }

            const result = await userInfo.insertOne(query)

            res.send(result)



        })


        app.delete('/users/:id', async (req, res) => {


            const id = req.params.id

            const itemId = { _id: new ObjectId(id) }

            const result = await userInfo.deleteOne(itemId)

            res.send(result)

        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
          
            try {
              const isValidObjectId = ObjectId.isValid(id);
              if (!isValidObjectId) {
                return res.status(400).json({ message: 'Invalid ID format' });
              }
          
              const filter = { _id: new ObjectId(id) };
              const updateDoc = {
                $set: {
                  name: body.name,
                  email: body.email,
                  phone: body.phone,
                },
              };
              const result = await userInfo.updateOne(filter, updateDoc);
              res.send(result);
            } catch (error) {
              console.error(error);
              res.status(500).json({ message: 'An error occurred while updating the user' });
            }
          });
          
          

        app.get('/users/:id', async (req, res) => {



            const id = req.params.id
            const query = {

                _id: new ObjectId(id)
            }




            const result = await userInfo.findOne(query)

            res.send (result)
         })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, (req, res) => {

    console.log(`Listening on ${port}`);
})