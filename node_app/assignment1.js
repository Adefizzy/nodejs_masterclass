const http = require("node:http");
const url = require("node:url");

const handlers = {};

handlers.hello = function (data, callback) {
  callback(200, data);
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

    routeHandler(header, function (statusCode, payload = {}) {
      console.log({ header });
      res.setHeader("content-type", "application/json");

      res.writeHead(statusCode).end(JSON.stringify(payload));
    });
  });
});

server.listen(6000, () => {
  console.log(`Server now listening on port ${6000}`);
});
