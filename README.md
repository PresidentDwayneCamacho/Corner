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


This should get it going, open browser to local host 3000.
You will notice that the project looks super crappy so far. This will be remedied, of course.


There are two collections in the same database associated with this web service. Each collection is represented by the different schema, one called Posting, one called Profile.
These two can be treated independently.  The profile.js router will output all the information associated with registered users.
This is merely for testing purposes, and will obviously not be included in the final project.



        B   R   O   N   C   O

        C   O   R   N   E   R
        




How to use the routing system with the user interface:

If you have a <form> tag in html/ejs,  the action and method are of critical importance ins transmitting http to the router.

Say you have a tag like 


        <form action="/examplepage" method="post">
        
                <input name="example_attribute">
        
        </form>.  


The 'action' variable refers to the router parameter.  The 'method' variable refers to the action carried out by the http request.  This form will trigger a method if it looks like:


        router.post('/examplepage', function(req, res, next){
                /* code goes here */ 
        });


For the inner tag <input name="example_attribute">, the contents of the http request can be assigned to a variale in the above function with with the code:

        var attr = req.body.example_attribute

