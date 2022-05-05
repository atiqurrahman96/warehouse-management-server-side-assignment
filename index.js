const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// -----connect with database-----

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yqit7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log('db connected');
    // perform actions on the collection object
    client.close();
});



app.get('/', (req, res) => {
    res.send('Is my grocery warehouse going on? yeah, it is.')
})




app.listen(port, () => {
    console.log('successful port', port);
})