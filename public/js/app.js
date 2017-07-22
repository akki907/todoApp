var app = angular.module('todoApp', ['ui.bootstrap']);

app.controller('myCtrl', function($scope,$http,$uibModal,$rootScope) {

  $scope.blogPost = function(post){
    // console.log(post);
    $http.post('/api/blogpost',post)
    .then(function(response){

                $scope.modalInstance.close(response);
                $scope.getAllBlogs();
                $scope.post = "";
              });
  }

  $scope.todoCreateModal=function(){
    $scope.modalInstance = $uibModal.open({
     templateUrl: 'add-todo-modal.html',
     controller: 'myCtrl',
     scope: $scope
   });
   $scope.modalInstance.result.then(function () {
      $scope.getAllBlogs();
   }, function () {

   });

 }

 $scope.cancel = function () {
   $uibModalInstance.dismiss('cancel');
 };



 $scope.updateModal=function(id){
  //  console.log(id);
  // $scope.initUpdate(id);
  $rootScope.todoId = id;

     $scope.modalInstance = $uibModal.open({
    templateUrl: 'edit-todo-modal.html',
    animation: true,
    scope: $scope,
    controller: 'myCtrl',
  });
  $scope.modalInstance.result.then(function (selectedItem) {
      $scope.getAllBlogs();
  }, function () {
   //  $log.info('Modal dismissed at: ' + new Date());
  });

}

$scope.cancel = function () {
    $scope.modalInstance.close();
};


$scope.initUpdate = function(){
 var id = $scope.todoId;
  $http.get('/api/getPostById/'+id)
  .success(function(post){
    $scope.post = post;
  })
}

 // $scope.cancel = function() {
 //  //  $uibModalInstance.dismiss('cancel');
 //  $scope.modalInstance.close();
 // };



$scope.getAllBlogs = function(){
    $http.get('/api/allblogpost')
         .success(function(posts){
           $scope.posts = posts;
         });
  }
$scope.showEdit = false;

  $scope.removeBlog = function(id){
    // console.log(id);

    $http.delete('/api/removeblog/'+id)
    .then(function(response){
                // $scope.deleteBookmarkModal.hide();
                // toaster.pop("success","Bookmark deleted successfully");
                // setTimeout(function(){$scope.getAllBlogs();},2000);
                $scope.getAllBlogs();
              });
  }



  $scope.editPost = function(post){
    $http.put('/api/editpost/'+post._id,post)
    .then(function(response){
      $scope.modalInstance.close(response);
      $scope.getAllBlogs();
      $scope.post = "";
    })
  }

});
