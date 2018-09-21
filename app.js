const express = require("express");
const bodyParser = require("body-parser");
var gs = require("./lib/getSearch");
var bd = require("./lib/bookDetail");
var gc = require("./lib/getContent");
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
  res.write(await gs(keyword, page));
  res.end();
});

app.get(/^\/book\/(\d+)\/index\.htm$/, async function(req, res) {
  var bid = req.url.split("/")[2];
  res.write(await bd(bid));
  res.end();
});

app.get(/^\/book\/(\d+)\/(\d+)\.htm$/, async function(req, res) {
  var bid = req.url.split("/")[2];
  var cid = req.url.split("/")[3];
  res.write(await gc(bid, cid));
  res.end();
});
