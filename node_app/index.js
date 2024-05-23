/*
 * Primary file for the API
 */

// Dependencies

const http = require("http");
const url = require("url");

// server should respond to all request with a string

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')
    console.log({trimmedPath})
  res.end("Hello WOrld\n");
});

// Start the server and listen to port 8000
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
