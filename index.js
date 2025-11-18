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
        // await client.connect();

        const db = client.db('freelanceMarketPlace');
        const jobsCollection = db.collection('jobCollections');
        const acceptedJobsCollection = db.collection('acceptedJobsCollection');
        //get all jobs data from db and showing in ui and also filter via email
        app.get('/allJobs', async (req, res) => {
            // console.log("Received email:", req.query.email);
            const email = req.query.email;
            const query = {};
            if (email) {
                query.userEmail = email;
            }
            // console.log("Mongo Query:", query);
            const cursor = jobsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
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
        // update
        app.patch('/allJobs/:id', async (req, res) => {
            const id = req.params.id;
            const updateJob = req.body;
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    title: updateJob.title, category: updateJob.category, summary: updateJob.summary, coverImage: updateJob.coverImage
                }
            }
            const result = await jobsCollection.updateOne(query, update)
            res.send(result)
        })
        app.delete('/allJobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.deleteOne(query);
            res.send(result)
        })

        app.post('/acceptedJobs', async (req, res) => {
            const newAcceptedJob = req.body;
            const result = await acceptedJobsCollection.insertOne(newAcceptedJob);
            res.send(result);
        })
        app.get('/acceptedJobs', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.userEmail = email;
            }
            const cursor = acceptedJobsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.delete('/acceptedJobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await acceptedJobsCollection.deleteOne(query);
            res.send(result)
        })
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Freelance Service listening on port ${port}`)
})
// const serverless = require('serverless-http');
// module.exports = serverless(app);
