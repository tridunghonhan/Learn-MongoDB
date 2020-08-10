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

   const matchQ = {
      $match:{
         "bedrooms":{
            $gte: 2
         }
      }
   } 

   const addFieldsQ = { 
      $addFields: {
         location: "$address.location.coordinates",
         averageReviewScores: {
            "$avg": "$review_scores"
        }
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
      }
   }

   const limitQ = { $limit: 3 };
   let pipe = [matchQ, addFieldsQ, projectQ, limitQ]



   executePipePromise(pipe,airBnB)
   .then(array=>{
      console.log(array)
      closeDB();
   })
   .catch(error=>{
      console.log("error: ", error)
      closeDB();
   })
} 


main()