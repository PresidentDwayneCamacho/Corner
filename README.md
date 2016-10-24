Running a test with mocha is accomplished by typing:

> npm test

in the base directory.



# Corner

Server/Router for the cs480 project.


Start project by:

Ensure node.js and mongodb are installed on your system.

Set command prompt to the base file.

Enter commands:

> npm install

and once that's done:

> mongod

Do not close that window, it is running mongo!
In a separate window, enter command:

> node server

or, if you want the server to automatically restart when the back end is edited automatically, enter:

> nodemon server

This is extremely helpful, by the way.


This should get it going, open browser to local host 3000.


There are two collections in the same database associated with this web service. Each collection is represented by the different schema, one called Posting, one called Profile.
These two can be treated independently.  The front end, angular-based router is in public/controllers, called controller.js.
The back end controller is in routes called api.js.


I would recommend reading up on angularjs to learn how to use the interface.  Learning the ng-controller, ng-click, ng-repeat, and $scope, $rootScope, $http attributes would be probably most helpful.
