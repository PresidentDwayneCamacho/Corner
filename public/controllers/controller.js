/*
	frontend routing system
*/


// runs upon starting angular
var app = angular.module('postApp',['ngRoute','ngResource'])
	.run(function($http,$rootScope){
		if(sessionStorage.getItem('currentProfile') === undefined){
			sessionStorage.setItem('authenticated',false);
			$rootScope.currentProfile = 'Guest';
			$rootScope.authenticated = false;
		}
	});


// attaches controllers to pages
app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl:'main.html',
			controller:'mainController'
		})
		.when('/profile',{
			templateUrl:'profile.html',
			controller:'profileController'
		})
		.when('/posthub',{
			templateUrl:'posthub.html',
			controller:'hubController'
		})
		.when('/login',{
			templateUrl:'main.html',
			controller:'authController'
		})
		.when('/register',{
			templateUrl:'register.html',
			controller:'authController'
		})
		.otherwise({
			redirectTo:'/'
		});
	});


app.factory('postService',function($resource){
	return $resource('/api/posts/:id');
});


app.controller('mainController',function($scope,$http,$rootScope,$location){
	// can be deleted if nothing to control
});


// controls profile
app.controller('profileController',function($scope,$http,$rootScope,$location){

	if(!sessionStorage.getItem('authenticated')){
		$location.path('/');
	}

	// puts html response into postings, and resets posting text spaces
	var refresh = function(){
		$http.get('/profile/'+$scope.currentProfile).success(function(res){
			$scope.postings = res;
			$scope.posting = '';
		});
	}
	refresh();

	// send post request to backend api router
	$scope.submitPost = function(){
		$http.post('/posting/'+$scope.currentProfile,$scope.posting).success(function(res){
			refresh();
		});
	}
});

// controls the posting hub
app.controller('hubController',function($scope,$http,$rootScope,$location){

	// redirect if not authenticated
	if(!sessionStorage.getItem('authenticated')){
		$location.path('/');
	}

	// restore post blanks
	var refresh = function(){
		$http.get('/posting').success(function(res){
			$scope.postings = res;
			$scope.posting = '';
		});
	}
	refresh();
});


// TODO change $scope.profile.email to simply $scope.profile
// controls authentication procedure
app.controller('authController',function($scope,$http,$rootScope,$location){

	// indicate user is signed in to router
	var setProfile = function(auth,email){
		sessionStorage.setItem('authenticated',auth);
		sessionStorage.setItem('currentProfile',email);
		$rootScope.authenticated = auth;
		$rootScope.currentProfile = email;
	}

	// resets the sign in blanks
	var refresh = function(){
		$scope.profile.email = '';
		$scope.profile.password = '';
	}
	
	// login, set username and authentication boolean
	$scope.login = function(){
		$http.post('/login',$scope.profile).success(function(res){
			if(res.state == 'success'){
				setProfile(true,res.profile.email);
				$location.path('/profile');
			} // else send an error message
			refresh();
		});
	}

	// register, reset blanks
	$scope.register = function(){
		$http.post('/register',$scope.profile).success(function(res){
			if(res.state == 'success'){
				setProfile(true,res.profile.email);
				$location.path('/profile');
			} // else send an error message
			refresh();
			$scope.profile.first = '';
			$scope.profile.last = '';
			$scope.profile.confirm = '';
		});
	}

	// unauthenticated, signs user out
	$scope.signout = function(){
		setProfile(false,'Guest');
		refresh();
	}
});

