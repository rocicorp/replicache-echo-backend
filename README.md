# Replicache Echo Backend

This is maybe the simplest possible example of a Replicache backend.

It's completely in-memory. All state will be lost when it exits.

To learn more about the Replicache protocol, and how to connect to your own backend, see [Replicache Server Setup](https://github.com/rocicorp/replicache/blob/main/SERVER_SETUP.md).

For a more real-life example of a backend integration, see [replicache-sample-todo](https://github.com/rocicorp/replicache-sample-todo).

## Setup

```
npm install
```

## Run

```
node run
```

Your Replicache endpoints are:

* `http://localhost:3001/replicache-client-view`
* `http://localhost:3001/replicache-batch`

### Example Usage

```
curl -X POST -d '{"clientID":"1", "mutations":[{"id":1,"name":"foo","args":"42"}]}' -H "Content-type: application/json" http://localhost:3001/replicache-batch
curl -X POST -d '{"clientID":"1", "mutations":[{"id":2,"name":"bar","args":"true"}]}' -H "Content-type: application/json" http://localhost:3001/replicache-batch

curl -X POST -d '{"clientID":"1"}' -H "Content-type: application/json" http://localhost:3001/replicache-client-view
```
