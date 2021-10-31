const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleaware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xohwd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();
        const database = client.db('takeoff-with-zam');
        const packagesCollection = database.collection('packages');
        const orderCollection = database.collection('orders');

        //GET API
        app.get('/packages', async (req, res) => {
            const result = packagesCollection.find({});
            const services = await result.toArray();
            res.send(services);

        });
        //get
        app.get('/packages/:id', async (req, res) => {
            const packageDetails = await packagesCollection.findOne({ _id: ObjectId(req.params.id) });
            res.send(packageDetails);

        })

        //POST new package
        app.post("/packages", async (req, res) => {
            const newPackage = (req.body);
            const result = await packagesCollection.insertOne(newPackage);
            console.log(result);
            res.json(result);
        })

        //POST API -booking orders
        app.post('/orders', async (req, res) => {
            const orders = await orderCollection.insertOne(req.body);
            res.json(orders);
        });

        //POST users selected packages
        app.post('/orders/add', async (req, res) => {
            const item = req.body;
        })


        //GET API-booking orders
        app.get('/orders', async (req, res) => {
            const orders = await orderCollection.find({}).toArray();
            res.send(orders);
        });


        //Delete API- delete order
        app.delete('/orders/:id', async (req, res) => {
            const deletedOrder = await orderCollection.deleteOne({ _id: ObjectId(req.params.id) });
            res.json(deletedOrder)
        });

        // Update user status
        app.put('/orders/:id', async (req, res) => {
            const order = req.body;
            const options = { upsert: true };
            const updatedOrder = {
                $set: { status: order.status }
            };

            const updateStatus = await orderCollection.updateOne({ _id: ObjectId(req.params.id) }, updatedOrder, options,)
            console.log(req.body);
            res.json(updateStatus);
        })
        //UPDATE API - booking orders status property
        // app.put('/orders/:id', async (req, res) => {
        //     const order = req.body;
        //     const options = { upsert: true };
        //     const updatedOrder = {
        //         $set: { status: order.status }
        //     };
        //     const updateStatus = await orderCollection.updateOne({ _id: ObjectId(req.params.id) }, updatedOrder, options);

        //     res.json(updateStatus);
        // });



    } finally {
        //await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(' server is running');
});

app.listen(port, () => {
    console.log('server running at port', port);
});