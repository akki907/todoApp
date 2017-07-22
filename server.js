var Todo = require('./models/model.js')
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();

var MONGOLAB_URI = 'mongodb://localhost/Todo';


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
  Todo.find({},function(err,users){
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

app.post('/api/createtodo',createtodo);
app.get('/api/allTodos',allTodos);
app.delete('/api/removeTodo/:id',removeTodo);
app.get('/api/getTodoById/:id',getTodoById);
app.put('/api/editTodo/:id',editTodo);

function editTodo(req,res){
var post = req.body
var id = req.params.id;
        Todo.findOne({"_id":id},
             function(err,todo){
                        if(err){
                          res.status(404).send("Error Occurred");
                        }
                        else{
                             if(!todo){
                                 res.status(404).send("No todo found with id "+id);
                               }
                             else{
                               todo.title=req.body.title;
                               todo.save(function(err,updatedTodo){
                                         if(err){
                                           res.status(500).send("Error Occurred while updating record");
                                         }
                                         else{
                                           res.status(200).send(updatedTodo);
                                         }
                                       });
                             }
                            }
                      });


}

function getTodoById(req,res){
  var id = req.params.id;
  Todo.findById(id,function(err,todo){
    if(err){
      console.log(err);
    }else {
      res.send(todo);
    }
  })
}

function removeTodo(req,res){
  var id=req.params.id;
  Todo.findOneAndRemove({"_id":id},
   function(err){
                 if(err){
                     console.log("Error : "+err);
                     return res.status(404).send("Todo not found");
                     }
                 return res.status(200).send("Todo deleted Successfully");
                });

}

function createtodo(req,res){
  // var todo = req.body;
  var todo = new Todo()
  todo.title=req.body.title;
  todo.save(function(err,savedTodo){
       if(err){
         res.status(400).send('Error occurred while creating bookmark');
       }else{
         res.status(201).send(savedTodo);
       }
   });
}

function allTodos(req,res){

  Todo.find().sort('-createdDate').exec(function(err,posts){
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
