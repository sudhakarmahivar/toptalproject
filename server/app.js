var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
const fs = require("fs");
const https = require("https");

var timeSheetRouter = require("./routes/timeSheet");
var userRouter = require("./routes/user");
var authRouter = require("./routes/auth");
var indexRouter = require("./routes/index");
var DBInitializer = require("./middleware/dbInitializer");
var contextBuilder = require("./middleware/contextBuilder");
var serviceErrorHandler = require("./middleware/serviceErrorHandler");
var debug = require("debug")("server:server");
var http = require("http");
var httpContext = require("express-http-context");

var app = express();

//Framework middlewares
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/*
    Sevice related middlewares
*/
//context sharing
app.use(httpContext.middleware);
//app.use(contextBuilder);

//initialize database [ done on app start.]
new DBInitializer().init();

//Services routes - Log only high level routes, while individual routes handle next level routing

app.use("/timesheet", contextBuilder, timeSheetRouter);
app.use("/user", contextBuilder, userRouter);
app.use("/auth", authRouter);
app.use("/", indexRouter);
//Handle all exceptions here
app.use(serviceErrorHandler);

var port = normalizePort(process.env.PORT || "6002");
app.set("port", port);

/**
 * Create HTTP server.
 */

let key = fs.readFileSync("./server.key"); //Set path relative to specific services and NOT relative to current file.
let cert = fs.readFileSync("./server.cert");

// we will pass our 'app' to 'https' server
var server = https.createServer(
  {
    key,
    cert,
    passphrase: "",
    requestCert: false,
    rejectUnauthorized: false,
  },
  app
);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
module.exports = app;
