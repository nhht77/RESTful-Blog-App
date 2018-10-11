const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// MODEL CONFIG
const Schema = mongoose.Schema;
 
const BlogSchema = new Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

const Blog =  mongoose.model('Blog', BlogSchema);

// Blog.create({
//     title: 'First post',
//     image: 'https://images.unsplash.com/photo-1523057530100-383d7fbc77a1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cff1b2c9744c71e84145dd78928513fc&auto=format&fit=crop&w=1049&q=80',
//     body:'This is the first blog post'
// }, blogs => {
    // console.log(blogs);
// })

// RESTful ROUTES
app.get("/", (req, res) => {
    res.redirect('/blogs');
})

// INDEX ROUTE
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render('index.ejs', {blogs: blogs});
        }
    })
    
})

// NEW ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new.ejs");
});

// CREATE ROUTE
app.post("/blogs", (req, res)=> {
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
    
})

// SHOW ROUTE
app.get("/blogs/:id", (req, res) =>{
    Blog.findById(req.params.id, (err, foundBlog) =>{
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
 });

app.listen(PORT, () => {
    console.log('RESTful Blog App Server is running on port: ' + PORT);
})