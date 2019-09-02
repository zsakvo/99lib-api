var cheerio = require("cheerio");
var http = require("./http");
var decode = require("./decode");

async function gc(bid, cid) {
  var contentJson = {};
  return http.get("/book/" + bid + "/" + cid).then(
    res => {
      var $ = cheerio.load(res.data);
      var client = $("meta[name=client]").attr("content");
      var content = $("#content");
      contentJson.content = decode(
        '<div id="content">' + content.html() + "</div>",
        client
      );
      return contentJson;
    },
    err => {
      return {
        err: err.toString()
      };
    }
  );
}

module.exports = gc;
