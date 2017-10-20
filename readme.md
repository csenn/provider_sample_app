index.js is our entry point using nodejs and express. Data
is stored in mongoDB. We use express with callbacks and
traditional import style. This file connects to the DB,
links incoming requests with routes, and starts the server.

downloadData.js contains the code used to download the csv and
translate it to json. This is then uploaded to a mongoDB database
through the /bootstrap endpoint. Costs in the form of strings are transformed into numbers when added into the DB.

model.js contains the mongoose schema that defines the provider model.
There are indexes added for the params we query, and the costs
are translated back into strings (although generally costs should probably not
be represented as strings).

routes.js contains code for implementing the logic that interacts with
the DB. Usually I would split this into at least 2 layers (for instance
a validation layer and db layer) but this pattern works fine for this project.

'npm test' will run the tests. This is a very simple test implementation, and
certainly would not be good enough for a production environment, but
gets the job done for this small project.

There are a few extra properties in the response
on the github page. I'm not sure if they should be removed, but it would be
trivial to do so.

Paginantion was included using the optional 'limit' and 'skip' parameters,
although in a real app we would probably want to name those differently.

There are 5 endpoints to make dev simpler, although in a real app
we certainly would not expose endpoints to drop or load the DB.

curl -X GET http://localhost:8000
curl -X GET http://localhost:8000/providers
curl -X GET http://localhost:8000/providers-size
curl -X POST http://localhost:8000/bootstrap
curl -X POST http://localhost:8000/drop-db