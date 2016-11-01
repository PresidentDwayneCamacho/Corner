/*
	frontend routing system
*/


// runs upon starting angular
var app = angular.module('postApp',['ngRoute','ngResource']);


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
		.when('/inbox',{
			templateUrl:'inbox.html',
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


app.run(function($http,$rootScope){

	if(sessionStorage.getItem('currentProfile') == null || sessionStorage.getItem('currentProfile') == 'Guest'){
		sessionStorage.setItem('currentProfile','Guest');
		$rootScope.authenticated = false;
	} else {
		$rootScope.authenticated = true;
	}

	// add some methods...

});


app.controller('mainController',function($scope,$http,$rootScope,$location){

	if($rootScope.authenticated){
		// add additional methods later
	} else {
		$location.path('/');
	}

});


// controls profile
app.controller('profileController',function($scope,$http,$rootScope,$location){

	// tests if authenticated
	if($rootScope.authenticated){
		// puts html response into postings, and resets posting text spaces
		var refresh = function(){
			var profileObj = JSON.parse(sessionStorage.getItem('currentProfile'));
			$http.get('/profile/'+profileObj.email).success(function(res){
				$scope.postings = res;
				$scope.posting = '';
			});
		}
		refresh();

		// sends post to backend router
		$scope.submitPost = function(){
			var profileObj = JSON.parse(sessionStorage.getItem('currentProfile'));
			$scope.posting.first = profileObj.first;
			$scope.posting.last = profileObj.last;
			$scope.posting.email = profileObj.email;
			// parse profile, add to posting, send
			$http.post('/posting/'+profileObj.email,$scope.posting).success(function(res){
				refresh();
			});
		}

		// delete a specific post
		$scope.deletePost = function(id){
			$http.delete('/posting/'+id).success(function(res){
				refresh();
			});
		}
	} else {
		$location.path('/');
	}

});


// controls the posting hub
app.controller('hubController',function($scope,$http,$rootScope,$location){

	$scope.messageHeader = '';
	$scope.messageRecipient = '';
	$scope.messageBody = '';

	// resets postings
	var refresh = function(){
		$http.get('/posting').success(function(res){
			$scope.postings = res;
			$scope.posting = '';
		});
	}
	refresh();

	$scope.sampleMessage = 'Hello';

	if($rootScope.authenticated){

		// begin writing a message to another user
		$scope.beginMessage = function(posting){
			// how does one return this to page?
			$http.post('/beginMessage',posting).success(function(res){
				$rootScope.outline = {
					header: 'RE: '+res.header,
					recipient: res.recipient,
					textbody: res.textbody
				};
				$location.path('/inbox');
			});
		}

		// send user message
		$scope.sendMessage = function(){
			var senderProfile = JSON.parse(sessionStorage.getItem('currentProfile'));
			var message = {
				header: $rootScope.outline.header,
				sender: {
					email: senderProfile.email,
					first: senderProfile.first,
					last: senderProfile.last
				},
				recipient: $rootScope.outline.recipient,
				textbody: $rootScope.outline.textbody
			};
			//console.log('frontend router sendMessage ' + message.recipient + ' ' + message.sender.email);
			
			$http.post('sendMessage',message).success(function(res){
				// if success, empty the $rootScope.outline.textbody / header / recipient

			});
		}

	} else {
		$location.path('/');
	}

});


// controls authentication procedure
app.controller('authController',function($scope,$http,$rootScope,$location){

	// indicate user is signed in to router
	var setProfile = function(auth,profile){
		sessionStorage.setItem('currentProfile',profile);
		$rootScope.authenticated = auth;
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
				var profileJSON = JSON.stringify(res.profile);
				setProfile(true,profileJSON);
				$location.path('/profile');
			} // else send an error message
			refresh();
		});
	}

	// register, reset blanks
	$scope.register = function(){
		$http.post('/register',$scope.profile).success(function(res){
			if(res.state == 'success'){
				var profileJSON = JSON.stringify(res.profile);
				setProfile(true,profileJSON);
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
		//refresh();
		$location.path('/');
	}

});

