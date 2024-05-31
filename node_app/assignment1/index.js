const http = require("node:http");
const url = require("node:url");
const config = require('./config');

const handlers = {};

handlers.hello = function (data, callback) {
  callback(200, {message: 'Wellcome and thank you for reaching out.'});
};

handlers.notFound = function (data, callback) {
  callback(404);
};

const routes = {
  hello: handlers.hello,
};

const server = http.createServer((req, res) => {
  const parsedPath = url.parse(req.url, true);

  const endpoint = parsedPath.pathname.replace(/^\/+|\/+$/g, "");

  const query = parsedPath.query;

  const method = req.method;

  const headers = req.headers;

  let body = "";

  req.setEncoding("utf8");

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const header = {
      endpoint,
      query,
      method,
      headers,
      body: JSON.parse(body),
    };

    const routeHandler = Object.keys(routes).includes(endpoint)
      ? routes[endpoint]
      : handlers.notFound;

    routeHandler(header, function (statusCode, payload={}) {
      res.setHeader("content-type", "application/json");
      res.writeHead(statusCode).end(JSON.stringify(payload));
    });
  });
});

server.listen(config.port, () => {
  console.log(`Server now listening on port ${config.port}`);
});
