/*
 * Primary file for the API
 */

// Dependencies

const http = require("http");

// server should respond to all request with a string

const server = http.createServer((req, res) => {
  res.end("Hello WOrld\n");
});

// Start the server and listen to port 8000
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
