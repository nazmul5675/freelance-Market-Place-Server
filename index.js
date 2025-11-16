require('dotenv').config();

const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000

//middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS}@cluster0.sdwdb9q.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('server is running')
})
// Create a MongoClient with a MongoClientOptions object to set the Stable API version


async function run() {
    try {
        await client.connect();

        const db = client.db('freelanceMarketPlace');
        const jobsCollection = db.collection('jobCollections');
        //get all jobs data from db and showing in ui
        app.get('/allJobs', async (req, res) => {
            const cursor = jobsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/allJobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.findOne(query);
            res.send(result);
        })
        app.post('/addJob', async (req, res) => {
            const newJob = req.body;
            const result = await jobsCollection.insertOne(newJob);
            res.send(result);
        })





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {


    }
}
run().catch(console.dir);












app.listen(port, () => {
    console.log(`Freelance Service listening on port ${port}`)
})
