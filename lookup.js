// https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/
// {
//   $lookup:
//     {
//        from: <collection to join>,
//        let: { <var_1>: <expression>, …, <var_n>: <expression> },
//        pipeline: [ <pipeline to execute on the joined collection> ],  // Cannot include $out or $merge
//        as: <output array field>
//     }
// }


const MongoClient = require('mongodb').MongoClient;
const sampleAttendees = require('./Attendees_samples.js')
var client = undefined;
var collection = undefined;
const uri = "mongodb+srv://kenny:Password1@cluster0.quwup.mongodb.net/"

MongoClient.connect(uri,{ useUnifiedTopology:true })
// create new DB
.then(mongoClient=>{
  // >>>>>>> Create new DB and Collection 
  client = mongoClient;
  const newDB = client.db("lookup");

  let classCollection = newDB.collection("classes"); 
  classCollection.insertMany( [
    { title: "Reading is ...", enrollmentlist: [ "giraffe2", "pandabear", "artie" ], days: ["M", "W", "F"] },
    { title: "But Writing ...", enrollmentlist: [ "giraffe1", "artie" ], days: ["T", "F"] }
  ])

  let membersCollection = newDB.collection("members"); 
  membersCollection.insertMany( [
    { name: "artie", joined: new Date("2016-05-01"), status: "A" },
    { name: "giraffe", joined: new Date("2017-05-01"), status: "D" },
    { name: "giraffe1", joined: new Date("2017-10-01"), status: "A" },
    { name: "panda", joined: new Date("2018-10-11"), status: "A" },
    { name: "pandabear", joined: new Date("2018-12-01"), status: "A" },
    { name: "giraffe2", joined: new Date("2018-12-01"), status: "D" }
  ])

  return classCollection.aggregate([
    {
       $lookup:
          {
             from: "members",
             localField: "enrollmentlist",
             foreignField: "name",
             as: "enrollee_info"
         }
    }
  ]).toArray()

})
.then(results=>{

  console.log("=========== Result ============")
  console.log(JSON.stringify(results, null,2 ))
  console.log("===============================")
})
//Delete all documents
.then(()=>{
  //clean collection
  client.db("lookup").collection("classes").deleteMany({})
  return client.db("lookup").collection("members").deleteMany({})

})
.then(()=>{
  client.close()
})
.catch(error=>{
  console.log("error: ", error);
})