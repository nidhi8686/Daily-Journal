const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const mysql=require('mysql')
const homeStartingContent = "Sometimes it's the first moment of the day that catches you off guard. That's what Wendy was thinking. She opened her window to see fire engines screeching down the street. While this wasn't something completely unheard of, it also wasn't normal. It was a sure sign of what was going to happen that day.";
const aboutContent = "Out of another, I get a lovely view of the bay and a little private wharf belonging to the estate. There is a beautiful shaded lane that runs down there from the house. I always fancy I see people walking in these numerous paths and arbors, but John has cautioned me not to give way to fancy in the least. He says that with my imaginative power and habit of story-making a nervous weakness like mine is sure to lead to all manner of excited fancies and that I ought to use my will and good sense to check the tendency.";
const contactContent = "Turning away from the ledge, he started slowly down the mountain, deciding that he would, that very night, satisfy his curiosity about the man-house. In the meantime, he would go down into the canyon and get a cool drink, after which he would visit some berry patches just over the ridge, and explore among the foothills a bit before his nap-time, which always came just after the sun had walked past the middle of the sky. ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password : "",
    database : "daily journal"
})

db.connect((err)=>{
    if(err){
        return console.error('err'+err.message);
    }
    console.log("Connected Successfully");
})

app.get('/',(req,res)=>{

    var getData='SELECT * FROM posts'
    db.query(getData,(err,result)=>{
        if(err) throw err;
        res.render('home',{homeContent : homeStartingContent,homePosts:result});
    })
    
})

app.get('/about',(req,res)=>{
    res.render('about',{aboutContentPage : aboutContent});
})

app.get('/contact',(req,res)=>{
    res.render('contact',{contactContentPage : contactContent});
})

app.get('/compose',(req,res)=>{
    res.render('compose');
})

app.get('/delete',(req,res)=>{
    res.render('delete');
})

app.get('/edit',(req,res)=>{
    res.render('edit');
})

app.get('/posts/:postTitle',(req,res)=>{
    const parameter=_.lowerCase(req.params.postTitle);
    var getData='SELECT * FROM posts';
    db.query(getData,(err,results)=>{
        if(err) throw err;
        results.forEach((result)=>{
            const postTitle=_.lowerCase(result.title);
            const orgtitle=result.title;
            const postData=result.postdata;
            if(parameter==postTitle)
            {
                res.render('post',{
                PostTitle : orgtitle,
                PostData : postData
                })
            }
        })
    })
})

app.post('/compose',(req,res)=>{

       var title = req.body.postTitle;
       var postdata = req.body.postData;

        var sendData='INSERT INTO posts(title,postdata) VALUES (?,?)'

        db.query(sendData,[title,postdata],(err,result)=>{
            if(err) throw err;
            console.log('Successfully send data');
        })

   
    res.redirect('/');
})

app.post('/delete',(req,res)=>{

    var title=req.body.title;
     var deleteData='DELETE FROM posts WHERE title=?'

     db.query(deleteData,[title],(err,result)=>{
         if(err) throw err;
         res.redirect('/');
     })
    
})

app.post('/edit',(req,res)=>{
    var newtitle=req.body.newtitle;
    var currtitle=req.body.currtitle;
    var newpost=req.body.newpost;
    var currpost=req.body.currpost;
    
    var updateData='UPDATE posts SET title=?,postdata=? WHERE title=? AND postdata=?'

    db.query(updateData,[newtitle,newpost,currtitle,currpost],(err,result)=>{
        if(err) throw err;
        res.redirect('/');
    })
})


const PORT= process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
});
