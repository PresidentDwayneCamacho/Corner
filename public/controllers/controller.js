/*
	frontend routing system
*/


// hcooper@cpp.edu
var app = angular.module('postApp',['ngRoute','ngResource'])
	.run(function($http,$rootScope){
		if(sessionStorage.getItem('currentProfile') == undefined){
			sessionStorage.setItem('currentProfile','guest');
			sessionStorage.setItem('authenticated',false);
			$rootScope.currentProfile = 'guest';
			$rootScope.authenticated = false;
		}
	});


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


app.controller('profileController',function($scope,$http,$rootScope,$location){

	if(!sessionStorage.getItem('authenticated')){
		$location.path('/');
	}

	var refresh = function(){
		$http.get('/profile/'+$scope.currentProfile).success(function(res){
			$scope.postings = res;
			$scope.posting = '';
		});
	}
	refresh();

	$scope.submitPost = function(){
		$http.post('/posting/'+$scope.currentProfile,$scope.posting).success(function(res){
			refresh();
		});
	}
});


app.controller('hubController',function($scope,$http,$rootScope,$location){

	if(!sessionStorage.getItem('authenticated')){
		$location.path('/');
	}

	var refresh = function(){
		$http.get('/posting').success(function(res){
			$scope.postings = res;
			$scope.posting = '';
		});
	}
	refresh();
});


app.controller('authController',function($scope,$http,$rootScope,$location){

	var setProfile = function(auth,email){
		sessionStorage.setItem('authenticated',auth);
		sessionStorage.setItem('currentProfile',email);
		$rootScope.authenticated = auth;
		$rootScope.currentProfile = email;
	}

	var refresh = function(){
		$scope.profile = '';
		$scope.email = '';
	}
	
	$scope.login = function(){
		$http.post('/login',$scope.profile).success(function(res){
			if(res.state == 'success'){
				setProfile(true,res.profile.email);
				console.log(sessionStorage.getItem('currentProfile'));
				$location.path('/profile');
				
			}
			refresh();
		});
	}

	$scope.register = function(){
		$http.post('/register',$scope.profile).success(function(res){
			if(res.state == 'success'){
				setProfile(true,res.profile.email);
				$location.path('/profile');
			}
			refresh();
		});
	}

	$scope.signout = function(){
		setProfile(false,'guest');
		refresh();
	}
});

