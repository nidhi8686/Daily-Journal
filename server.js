const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const mysql=require('mysql')
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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
