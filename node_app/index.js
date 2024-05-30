/*
 * Primary file for the API
 */

// Dependencies

const http = require("node:http");
const url = require("node:url");
const { StringDecoder } = require("node:string_decoder");

const handler = {};

handler.user = function (data, callback) {
  console.log({ data });
  callback(406, { name: "adefisayo" });
};

handler.notFound = function (data, callback) {
  console.log({ data });
  callback(404);
};

const routers = {
  user: handler.user,
};

// server should respond to all request with a string
const server = http.createServer((req, res) => {
  console.log({ url: req.url });
  // Get the URL and parse it. the true param tells node to parse the query string
  const parsedUrl = url.parse(req.url, true);
  console.log({ url: req.url, parsedUrl });
  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string object
  const queryStringObj = parsedUrl.query;

  // Get the HTTP Method
  const method = req.method.toUpperCase();

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
      buffer,
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
});

// Start the server and listen to port 8000
const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
