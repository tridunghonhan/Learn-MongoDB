const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://kenny:Password1@cluster0.quwup.mongodb.net/sample_weatherdata?retryWrites=true&w=majority"

const sampleAttendees = require('./Attendees_samples.js')
var client = undefined;
var collection = undefined;
const uri = "mongodb+srv://kenny:Password1@cluster0.quwup.mongodb.net/"

MongoClient.connect(uri,{ useUnifiedTopology:true })
//create new DB
// .then(mongoClient=>{
//   // >>>>>>> Create new DB and Collection 
//   client = mongoClient;
//   const newDB = client.db("TechShare");
//   return newDB.createCollection("Attendees")
// })
// >>>>>>> get Collection
.then(mongoClient=>{
  client = mongoClient;
  return client.db("TechShare").collection("Attendees")
})
//C: create documents
.then(attendeesCollection=>{
  collection = attendeesCollection;
  return collection.insertMany(sampleAttendees)
  //https://docs.mongodb.com/drivers/node/fundamentals/crud/write-operations/insert

})
//R: read documents
.then((results)=>{
  //https://docs.mongodb.com/drivers/node/fundamentals/crud/read-operations

  // batch size 
  // Specifies the number of documents to return in each batch of the response from the MongoDB instance.
  // The MongoDB server returns the query results in batches. 
  // Batch size will not exceed the maximum BSON document size. 
  // For most queries, the first batch returns 101 documents or 
  // just enough documents to exceed 1 megabyte. 
  // Subsequent batch size is 4 megabytes. 
  // To override the default size of the batch, see batchSize() and limit().
  // + cursor.next() will perform a getmore operation to retrieve the next batch.
  // + Each batch requires a round trip to the server. 
  // It can be adjusted to optimize performance and limit data transfer.
  //
  // batch size can not override MongoDB’s internal limits 
  // on the amount of data it will return to the client in a single batch
  // 4-16MB of results per batch

  return collection.find({}).toArray()
  return collection.find({age:{$gte: 30}}).toArray();
  return collection.findOne({name:"Swan"})
  return collection.findOne({'address.District':'10'})


  return collection.find({}).batchSize(2).toArray()


})
//U: update existing document
.then(results=>{

  collection.update(
    {age:{$gte: 30}},
    {$set:{
      pension: true
    }}
    )
  
  // collection.updateMany(
  //   {age:{$gte: 30}},
  //   {$set:{
  //     pension: true
  //   }}
  //   )

  return collection.find({age:{$gte: 30}}).toArray()
})
.then(results=>{

  console.log("=========== Result ============")
  console.log(results)
  console.log("===============================")
})
//Delete all documents
.then(()=>{
  //clean collection
  return collection.deleteMany({});
})
.then(()=>{
  client.close()
})
.catch(error=>{
  console.log("error: ", error);
})