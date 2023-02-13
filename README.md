# DeezNodes

DeezNodes is a simple, light-weight, Node server companion that automatically restarts your server on file save. 
This is my first CLI app that I developed while learning JavaScript, I wanted to build something that I could use.

## Installation

```node
npm i deeznodes 
```

or

```node
npm i deeznodes --save-dev //install as development dependency
```

## Usage
As of v1.0.0, DeezNodes has 2 features
- Automatic Restarts
- Manual Restarts

DeezNodes will run your app and listen for changes. You can start your server with

```
deeznodes [yourApp.js]
```

If using DeezNodes in a development enviornment, include it as a script in ```package.json```

```
  "scripts": {
    "devStart": "deeznodes [yourApp.js]"
  },
```

To manually restart your server, use ```rs```

## Plans
- Monitor multiple directories
- Implement non-node script compatibility

