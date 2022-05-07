const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// -----connect with database-----


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yqit7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const warehouseCollection = client.db('warehouse').collection('products');
        const myItemsCollection = client.db('warehouse').collection('myItems');

        //--------data load or data read----
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = warehouseCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
        // --------my Items----
        app.get('/myItems', async (req, res) => {
            const query = {};
            const cursor = myItemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        // ----userAuthentication by JWT token-------
        app.post('/getToken', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: '2d' })
            res.send({ token })
        })
        // ----single data Load---------
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await warehouseCollection.findOne(query);
            res.send(product);
        });
        // -----Post or Create data -----
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await warehouseCollection.insertOne(newProduct)
            res.send(result);
        })
        // ----Delete api----------
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await warehouseCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}


run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Is my grocery warehouse going on? yeah, it is.')
})




app.listen(port, () => {
    console.log('successful port', port);
})