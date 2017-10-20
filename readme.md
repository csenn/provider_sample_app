Use express with callback style for simplicity

I personally think its cleaner to use koa with async/await to deal with callback

In a real case we would definitly want to implement pagination as well.


curl -X POST http://localhost:8000/bootstrap
curl -X POST http://localhost:8000/drop-db