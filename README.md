## TEST FLYKUBE API DUMMY
Creation of an app for Technical Assessments.

### Technologies used
- node.js
- Typescript
- Express
- MongoDB
- Mongoose

### API web (Backend)
It was an API Dummy for testing "Activities operations"
[http://fakerestapi.azurewebsites.net](http://fakerestapi.azurewebsites.net/Help)

### Access database (secret.js)
For getting access to the MongoDb, **you need to create .ts file with the name "secret.ts"**. The content of this file must be:
export const dbAccess = {
    "URI": "mongodb+srv://< username >:< password >@mymongo-8ndql.mongodb.net/test?retryWrites=true&w=majority"
}

### Run the app | port 3000
###### Directly from Typescript for developers
"dev": "nodemon src/app.ts"
###### Build the app in javascript ES6
"build": "tsc -p ."
###### Run the app previously created
"start": "node dist/app.js"
###### If you want to clean the app folder for new testing
"clean": "del dist"

### Endpoints
**endpoint**: /place
**Action**: query ID number for looking data in the API
**Method**: 'POST' for getting sending the data to the API
This proccess also call a function with the method 'GET' for getting the data of the API and sending back all the info to the MongoDB
**Sample JSON**: { "ID": 6 } **The value must be integer from 1 to 30 only**
**Response**: Object data { success: 'new data with ID (ID) was added' }

**endpoint**: /placelist
**Action**: Retrive all the data form the DB
**Method**: 'GET'
**Response**: 
{ "_id": "5e1a5d2103fd334a7ca19bef",
"ID": 6,
"DueDate": "2020-01-12T05:41:21.884Z",
"Completed": true
"__v": 0
}