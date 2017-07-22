var app = angular.module('todoApp', ['ui.bootstrap']);

app.controller('myCtrl', function($scope,$http,$uibModal,$rootScope) {

  $scope.todoPost = function(todo){
    $http.post('/api/createtodo',todo)
    .then(function(response){
                $scope.modalInstance.close(response);
                $scope.getAllTodos();
                $scope.todo = "";
              });
  }

  $scope.todoCreateModal=function(){
    $scope.modalInstance = $uibModal.open({
     templateUrl: 'add-todo-modal.html',
     controller: 'myCtrl',
     scope: $scope
   });
   $scope.modalInstance.result.then(function () {
      $scope.getAllTodos();
   }, function () {

   });

 }



// update modal
 $scope.updateModal=function(id){

    $rootScope.todoId = id;
     $scope.modalInstance = $uibModal.open({
    templateUrl: 'edit-todo-modal.html',
    animation: true,
    scope: $scope,
    controller: 'myCtrl',
  });
  $scope.modalInstance.result.then(function (selectedItem) {
      $scope.getAllTodos();
  }, function () {
  });

}

// close of modal
$scope.cancel = function () {
    $scope.modalInstance.close();
};


$scope.initUpdate = function(){
 var id = $scope.todoId;
  $http.get('/api/getTodoById/'+id)
  .success(function(todo){
    $scope.todo = todo;
  })
}

// list of todos
$scope.getAllTodos = function(){
    $http.get('/api/allTodos')
         .success(function(todos){
           $scope.todos = todos;
         });
  }

  $scope.removeTodo = function(id){
    $http.delete('/api/removeTodo/'+id)
    .then(function(response){
                $scope.getAllTodos();
              });
  }



  $scope.editTodo = function(todo){
    $http.put('/api/editTodo/'+todo._id,todo)
    .then(function(response){
      $scope.modalInstance.close(response);
      $scope.getAllTodos();
      $scope.todo = "";
    })
  }

});
