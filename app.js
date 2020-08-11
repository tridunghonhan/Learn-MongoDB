const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://kenny:Password1@cluster0.quwup.mongodb.net/sample_weatherdata?retryWrites=true&w=majority"
const client = new MongoClient(uri,{ useUnifiedTopology:true });

async function getCollection(){
   await client.connect();
   const database = client.db('sample_airbnb');
   return database.collection('listingsAndReviews');
}

async function closeDB(){
   await client.close();
}

function executePipePromise(pipe,collection){
   return new Promise((resolve,reject)=>{
      collection.aggregate(pipe,(error,cursor)=>{
         console.log("done")
         cursor.toArray()
         .then(array=>{
            resolve(array)
         })
      })
   }) 
}

async function main(){
   let airBnB = await getCollection();

   var from_date = new Date('2019-01-01 00:00:00')
   var to_date = new Date('2019-02-01 00:00:00')
   
   // https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
   const matchQ = {
      $match:{
         "bedrooms":{
            $gte: 2
         },
         "last_review":{
            "$gte": from_date,
            "$lte": to_date
        }

      }
   } 

   const addFieldsQ = { 
      $addFields: {
         location: "$address.location.coordinates",
      }
   }

   const unwindReviewsQ = {
      $unwind:"$reviews"
   }


   // { $filter: { input: <array>, as: <string>, cond: <expression> } }
   const priceFilterQ = {
      $filter: {
         input: "$reviews",
         as: "reviews",
         cond: { $gte: [ "$$reviews.date", new Date('2019-01-20 00:00:00') ] }
      }
   }

   const projectQ = {
      $project:{
         bedrooms:1,
         host:{
            host_name:1,
            host_location:1
         },
         "location":1,
         reviews:priceFilterQ,
      }
   }

   const sortQ = {
      $sort: {
         "bedrooms": 1 //1:ascending, -1:descending //limit 100 to see the differences
     }
   }

   
   const limitQ = { $limit: 100 };

   let pipe = [matchQ, projectQ, sortQ, limitQ]


   executePipePromise(pipe,airBnB)
   .then(array=>{
      console.log(JSON.stringify(array, null, 2))
      console.log("=================================")
      console.log("Number of Documents: ", array.length)

      closeDB();
   })
   .catch(error=>{
      console.log("error: ", error)
      closeDB();
   })
} 


main()