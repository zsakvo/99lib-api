var rp = require("request-promise");
var cheerio = require("cheerio");
var config = require("../config");
var SocksProxyAgent = require("socks-proxy-agent");

async function bd(bid) {
  var url = "http://www.99lib.net/book/" + bid + "/index.htm";
  var opt = {};
  var bookDetail = {};
  var chapters = [];
  opt["uri"] = url;
  opt["timeout"] = config.timeout;
  opt["User-Agent"] = config.ua;
  if (config.proxy.includes("http://")) {
    opt["proxy"] = config.proxy;
  } else if (config.proxy.includes("socks://")) {
    opt["agent"] = new SocksProxyAgent(config.proxy);
  }
  return rp(opt)
    .then(res => {
      var $ = cheerio.load(res);
      var book_info = $("#book_info");
      var name = $("h2", book_info).text();
      var coverImg =
        "https:" +
        $("img", book_info)
          .first()
          .attr("src");
      var intro = $("div.intro", book_info).text();
      var h4 = $("h4", book_info);
      var author = $("a", h4.get(0))
        .first()
        .text();
      var category = $("a", h4.get(1))
        .first()
        .text();
      var dd = $("dd", "#dir");
      dd.each(function(i, d) {
        var chapter = {};
        chapter.name = $("a", d).text();
        chapter.url = $("a", d).attr("href");
        chapters.push(chapter);
      });
      bookDetail.bookName = name;
      bookDetail.author = author;
      bookDetail.coverImg = coverImg;
      bookDetail.intro = intro;
      bookDetail.category = category;
      bookDetail.chapters = chapters;
      // var page = book_info.toString() + dir.toString();
      return bookDetail;
    })
    .catch(e => {
      return e.toString();
    });
}

module.exports = bd;
