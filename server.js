var Blog = require('./models/model.js')
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();

var MONGOLAB_URI = 'mongodb://localhost/Todo';

// var MONGOLAB_URI = 'mongodb://akki:1111111@ds149382.mlab.com:49382/myblog'
// mongoose.connect(process.env.MONGOLAB_URI, function(err,response){
mongoose.connect(MONGOLAB_URI, function(err,response){
  if(err){
    console.log('falied to connect');
  }
  else {
    console.log('connected to db' +MONGOLAB_URI );
  }
})

var router = express.Router();

// get

router.get('/api/users',function(req,res){
  Blog.find({},function(err,users){
    if(err){
      res.status(404).send(err);
    }else {
      res.status(200).send(users)
    }
  })
})

app.use('/',router);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(morgan('dev'));

// app.get('/',function(req,res){
//   res.send('hello');
// })

app.post('/api/blogpost',createPost);
app.get('/api/allblogpost',allblogpost);
app.delete('/api/removeblog/:id',removeblog);
app.get('/api/getPostById/:id',getPostById);
app.put('/api/editpost/:id',editPost);

function editPost(req,res){
var post = req.body
console.log(post);
var id = req.params.id;
// Blog.update
        // var id=req.params.id;
        Blog.findOne({"_id":id},

             function(err,blog){
                        if(err){
                          res.status(404).send("Error Occurred");
                        }
                        else{
                             if(!blog){
                                 res.status(404).send("No bookmark found with id "+id);
                               }
                             else{
                               blog.title=req.body.title;
                               blog.description=req.body.description;
                              //  blog.tags=req.body.tags

                               blog.save(function(err,updatedBlog){
                                         if(err){
                                           res.status(500).send("Error Occurred while updating record");
                                         }
                                         else{
                                           res.status(200).send(updatedBlog);
                                         }
                                       });
                             }
                            }
                      });


}

function getPostById(req,res){
  var id = req.params.id;
  console.log(id);
  Blog.findById(id,function(err,blog){
    if(err){
      console.log(err);
    }else {
      res.send(blog);
    }
  })
}

function removeblog(req,res){
  var id=req.params.id;
  Blog.findOneAndRemove({"_id":id},
   function(err){
                 if(err){
                     console.log("Error : "+err);
                     return res.status(404).send("Blog not found");
                     }
                 return res.status(200).send("Blog deleted Successfully");
                });

}

function createPost(req,res){
  // console.log('hello');
  // console.log('request',req.body);
  var post = req.body;
  var blog = new Blog()
  blog.title=req.body.title;
  blog.description=req.body.description;
  blog.coverImage = req.body.coverImage
  // blog.createdDate = new Date();
  blog.save(function(err,savedBlog){
       if(err){
         res.status(400).send('Error occurred while creating bookmark');
       }else{
        //  console.log(savedBlog);
         res.status(201).send(savedBlog);
       }
   });
  // blog.save()

}

function allblogpost(req,res){

  Blog.find().sort('-createdDate').exec(function(err,posts){
    if(err){
      console.log(err);
    }else{
      console.log(posts);
      res.send(posts);
    }
  })
}



app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000, function(){
  console.log('listening at port 3000');
})
