import { MongoClient } from 'mongodb';



let db;

async function connectToDb(cb) {
    //for connecting to local host
    //const client = new MongoClient('mongodb://127.0.0.1:27017');
    
    //to connect to MongoDB Atlas
    const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster1.hlb1wy8.mongodb.net/`);
    await client.connect();
    db = client.db('react-blog-db');
    cb();
}

export {
    db,
    connectToDb,
};


//After giving the connection do the same as you did 
//for Local mongodb. Open the Mongo Shell by clicking on
// databse in atlas and selecting shell and follow the steps.
//And then inside the shll open react-blog-db database
//And then db.articles.insertMany([{
//     name:'learn-react',
// ... upvotes:0,
// ... comments:[],
// ... },{
// ... name:'learn-node',
// ... upvotes:0,
// ... comments:[],
// ... },{
// ... name:'mongodb',
// ... upvotes:0,
// ... comments:[]
// ... }])
// }])    and then exit the shell....