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
			controller:'postController'
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
	
});


app.controller('postController',function($scope,$http,$rootScope,$location){

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

	$scope.submitPost = function(){
		$http.post('/posting',$scope.posting).success(function(res){
			refresh();
		});
	}
});


app.controller('authController',function($scope,$http,$rootScope,$location){

	var setProfile = function(auth,email){
		sessionStorage.setItem('authenticated',auth);
		sessionStorage.setItem('currentProfile',email);
		$rootScope.authenticated = auth;
		$rootScope.currentProfile = email;
		return $rootScope.currentProfile;
	}
	
	$scope.login = function(){
		$http.post('/login',$scope.profile).success(function(res){
			if(res.state == 'success'){
				setProfile(true,res.profile.email);
				console.log(sessionStorage.getItem('currentProfile'));
				$location.path('/profile');
			}	
		});
	}

	$scope.register = function(){
		$http.post('/register',$scope.profile).success(function(res){
			if(res.state == 'success'){
				setProfile(true,res.profile.email);
				$location.path('/profile');
			}
		});
	}

	$scope.signout = function(){
		setProfile(false,'guest');
	}
});

