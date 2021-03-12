const express = require("express");
const helmet = require("helmet");
const path = require("path");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// API routes
const hello = require("./nextjs-app/.next/serverless/pages/api/hello");
// App pages
const home = require("./nextjs-app/.next/serverless/pages/index");

const dev = process.env.NODE_ENV !== "production";

const createServer = () => {
  const server = express();

  // Running an Express app behind a proxy, so set the application variable "trust proxy" to tell the app whether it is https or http
  server.set("trust proxy", true);

  server.use(
    "/_next",
    express.static(path.join(__dirname, "./nextjs-app/.next"))
  );

  server.use(helmet());
  server.use(awsServerlessExpressMiddleware.eventContext());

  server.get("/api/hello", (req, res) => {
    hello.default(req, res);
  });
  server.get("*", (req, res) => {
    home.render(req, res);
  });

  return server;
};

const serverInstance = createServer();

if (!process.env.LAMBDA) {
  serverInstance.listen(3000, (err) => {
    if (err) throw err;
    // eslint-disable-next-line
    console.log(`> Ready on http://localhost:3000`);
  });
}

exports.server = serverInstance;
