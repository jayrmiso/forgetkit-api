#!/usr/bin/env node

import debugFactory from "debug";
import http from "node:http";
import { env } from "./config/env";
import app from "./app";

const debug = debugFactory("forgetkit-api:server");
const port = env.PORT;

app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error: NodeJS.ErrnoException): never | void {
  if (error.syscall !== "listen") throw error;

  const bind = `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const address = server.address();
  const bind = typeof address === "string" ? `pipe ${address}` : `port ${address?.port}`;
  debug(`Listening on ${bind}`);
}
