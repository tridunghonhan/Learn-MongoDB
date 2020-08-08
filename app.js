const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://kenny:Password1@cluster0.quwup.mongodb.net/sample_weatherdata?retryWrites=true&w=majority"
const client = new MongoClient(uri,{ useUnifiedTopology:true });

async function getDataCollection(){
   await client.connect();
   const database = client.db('sample_weatherdata');
   return database.collection('data');
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
   let collection = await getDataCollection();

   const q1 = { $limit: 2 };
   const q1 = { $limit: 2 };
   let pipe = [q1]

   executePipePromise(pipe,collection)
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