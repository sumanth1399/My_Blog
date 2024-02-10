// To fucking open mongoshell start the services and then run mongosh command 
import express from 'express';
import { db, connectToDb } from './db.js';
import fs from'fs';
import admin from 'firebase-admin';

//Begin of episode 7(for hostin the project)
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname =  path.dirname(__filename);
//npm install dotenv to import env  variablesf or hosting in atlas
import 'dotenv/config';

const credentials = JSON.parse( //To connect backend with firebase
    fs.readFileSync('./credentials_firebase.json')
);
admin.initializeApp({
    credential:admin.credential.cert(credentials),
});


const app = express();
// To  parse the JSON bodies (req.body) when you enter data in postman
app.use(express.json());

//Begin of episode 7(for hosting the project)
app.use(express.static(path.join(__dirname,"../build")));
app.get(/^(?!\/api).+/,(req,res)=>{
    res.sendFile(path.join(__dirname,'../build/index.html'));
})
//end

app.use(async(req,res,next)=>{
    const {authtoken}=req.headers;
    if(authtoken){
        try{
            req.user=await admin.auth().verifyIdToken(authtoken);
        }catch(e){
            return res.sendStatus(400);
        }}

        req.user=req.user || {};
        next();
});



// To connect with MongoDb 
app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const{uid}=req.user;//for firebase
// used db.collection as it is node.js or else we could just call it as db.articles.

    const article = await db.collection('articles').findOne({ name });

    if (article) {
    
        const upvoteIds=article.upvoteIds || [];
        article.canUpvote=uid && !upvoteIds.includes(uid);//for firebase, to get endpoints

        res.json(article);
    } else {
        res.sendStatus(404);
    }
    // can use res.send as well. But, just to make sure correct headers are sent using res.json
});

//Protecting upvote and comment endpoints
app.use((req,res,next)=>{
    if(req.user){
        next();
    }else{
        res.sendStatus(401);
    }
})


// To add upvotes
app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const{uid}=req.user;//for firebase
    // removed connection to mongo db here and declared it in db.js file for reuse

if(article) {
    
    const upvoteIds=article.upvoteIds || [];
    const canUpvote=uid && !upvoteIds.includes(uid);//for firebase, to get endpoints

    if(canUpvote){
        await db.collection('articles').updateOne({ name }, {
            //  $inc operator increases the value of field by a specified amount.
            // $set operator sets the limit for those increments i.e, increments till it reaches 100
            $inc: { upvotes: 1 },
            $push: { upvoteIds: uid },
        });
    }
    const updatedArticle = await db.collection('articles').findOne({ name });
    res.json(updatedArticle);
    // article.upvotes += 1
    } else {
        res.send('That article doesn\'t exist');
    }
});


// To add comments
app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { text } = req.body;
    const {email}=req.user;

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy:email, text } },
       // $push: { comments: {  email,text } },
    });
     // const article= articlesinfo.find(a=> a.name===name);
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        // article.comments.push({postedBy,text});
        res.json(article);
    } else {
        res.send('That article doesn\'t exist!');
    }
});


// app.post('/hello',(req,res)=>{
//     console.log(req.body);
// res.send('Hello'+ req.body.name +"!");
// });

// app.get('/hello/:name',(req,res)=>{
//     // const name= req.params.name;             or
//     const {name} = req.params;
//     res.send('Hello ' + name + '!!');
// });

//For hosting begin
const PORT = process.env.PORT || 8000;
//end


connectToDb(() => {
    console.log('Successfully connected to database!');
    app.listen(8000, () => {
        console.log('Server is listening on port 8000');
    });
})