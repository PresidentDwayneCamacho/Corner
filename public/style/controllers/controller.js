/*
	frontend routing system
*/


// runs upon starting angular
var app = angular.module('postApp',['ngRoute','ngResource']);


// attaches controllers to html
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


// method runs upon startup of angular
app.run(function($http,$rootScope){
	
	// checks if a user is logged in, resets the profile name to $rootScope
	if(sessionStorage.getItem('currentProfile') == null || sessionStorage.getItem('currentProfile') == 'Guest'){
		sessionStorage.setItem('currentProfile','Guest');
		$rootScope.authenticated = false;
	} else {
		$rootScope.authenticated = true;
	}
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

		// resets the subcategory
		$scope.resetSubcategory = function(){
			$scope.posting.subcategory = '';
		}
	} else {
		$location.path('/');
	}
});


// controls the posting hub
app.controller('hubController',function($scope,$http,$rootScope,$location){

	// resets postings
	var refresh = function(){
		$http.get('/posting').success(function(res){
			$scope.postings = res;
			$scope.posting = '';
		});
	}
	refresh();

	if($rootScope.authenticated){

		// resets the inbox
		var refreshInbox = function(){
			$rootScope.outline = '';
		}

		// update the messaging inbox
		var updateInbox = function(){
			var currentProfile = JSON.parse(sessionStorage.getItem('currentProfile'));
			var email = currentProfile.email;
			//console.log('update inbox ' + email);
			$http.get('/inbox/'+email).success(function(res){
				$scope.messages = res;
			});
		}
		updateInbox();

		// begin writing a message to another user
		$scope.beginMessage = function(posting){
			$http.post('/beginMessage',posting).success(function(res){
				$rootScope.outline = {
					header: 'RE: '+res.header,
					recipient: res.recipient.email,
					profile: res.recipient,
					textbody: res.textbody
				};
				$location.path('/inbox');
				updateInbox();
			});
		}

		$scope.respondMessage = function(message){
			var currentInfo = {
				header: message.header,
				createdBy:{
					email: message.sender.email,
					first: message.sender.first,
					last: message.sender.last
				},
				textbody: ''
			};
			$scope.beginMessage(currentInfo);
			window.scrollTo(0,0);
		}

		// send message to user, logging it in database
		$scope.sendMessage = function(){
			var currentProfile = JSON.parse(sessionStorage.getItem('currentProfile'));
			var message = {
				header: $rootScope.outline.header,
				sender:{
					email: currentProfile.email,
					first: currentProfile.first,
					last: currentProfile.last
				},
				recipient:{
					email: $rootScope.outline.profile.email,
					first: $rootScope.outline.profile.first,
					last: $rootScope.outline.profile.last
				},
				textbody: $rootScope.outline.textbody
			};

			$http.post('/sendMessage',message).success(function(res){
				updateInbox();
				refreshInbox();
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
		$location.path('/');
	}
});


/*
var PostingSchema = mongoose.Schema({
    header: {type: String, required: true},
    category: {type: String, required: true},
    subcategories: [{type: String}],
    textbody: {type: String, required: true},
    createdBy: {
        email: {type: String, required: true},
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    createdAt: {type: Date, default: Date.now}
});
var MessageSchema = mongoose.Schema({
    header: {type: String},
    sender: {
        email: {type: String, required: true},
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    recipient: {
        email: {type: String, required: true},
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    textbody: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});
*/

