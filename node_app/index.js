/*
 * Primary file for the API
 */

// Dependencies

const http = require("node:http");
const https = require('node:https')
const url = require("node:url");
//const { StringDecoder } = require("node:string_decoder");
const config = require('./config');
const fs = require('fs');
const path = require("node:path");
const handler = require('./lib/handlers');




const routers = {
  users: handler.users,
};

// server should respond to all HTTP request
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
});

httpServer.listen(config.httpPort, () => {
  console.log(`Server is listening on port ${config.httpPort} in ${config.envName} mode`);
});

const httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, 'https', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'https', 'cert.pem'))
}

//server should response to all HTTPS request
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res)
})

httpsServer.listen(config.httpsPort, () => {
  console.log(`Server is listening on port ${config.httpsPort} in ${config.envName} mode`);
});


function unifiedServer(req, res){

  // Get the URL and parse it. the true param tells node to parse the query string
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string object
  const queryStringObj = parsedUrl.query;

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the HTTP header
  const headers = req.headers;

  //const decoder = new StringDecoder('utf-8');
  let buffer = "";
  req.setEncoding("utf-8");
  req.on("data", (chunk) => {
    buffer += chunk; //decoder.write(chunk);
  });

  req.on("end", () => {
    // buffer += decoder.end();
    const body = JSON.parse(buffer);
    console.log(`data was sent, the body is ${buffer}`);

    const data = {
      body,
      headers,
      method,
      queryStringObj,
      trimmedPath,
    };

    const routeHandler = routers[trimmedPath] ?? handler.notFound;

    routeHandler(data, function (statusCode, payload = {}) {
      res.setHeader("content-type", "application/json" )
      res
        .writeHead(statusCode)
        .end(JSON.stringify(payload));
    });
  });
}
