const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://kenny:Password1@cluster0.quwup.mongodb.net/sample_weatherdata?retryWrites=true&w=majority"


const client = new MongoClient(uri);
await client.connect();
await listDatabases(client);
