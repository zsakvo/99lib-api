const express = require("express");
const bodyParser = require("body-parser");
var search = require("./lib/search");
var detail = require("./lib/detail");
var content = require("./lib/content");
var type = require("./lib/type");
var review = require("./lib/review");
var config = require("./config");

var app = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.listen(config.port);

app.get("/book/search", async function(req, res) {
  var keyword = req.query.keyword;
  var page = req.query.page;
  res.json(await search(keyword, page));
  res.end();
});

app.get(/^\/book\/(\d+)\/index\.htm$/, async function(req, res) {
  var bid = req.url.split("/")[2];
  res.json(await detail(bid));
  res.end();
});

app.get(/^\/book\/(\d+)\/(\d+)\.htm$/, async function(req, res) {
  var bid = req.url.split("/")[2];
  var cid = req.url.split("/")[3];
  res.json(await content(bid, cid));
  res.end();
});

app.get("/book/index.php", async function(req, res) {
  var type = req.query.type;
  var page = req.query.page;
  res.json(await type(type, page));
  res.end();
});

app.get("/review/index.php", async function(req, res) {
  var sort = req.query.type;
  var page = req.query.page;
  res.json(await review(sort, page));
  res.end();
});
