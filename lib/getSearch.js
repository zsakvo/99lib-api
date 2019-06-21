var rp = require("request-promise");
var cheerio = require("cheerio");
var config = require("../config");
var SocksProxyAgent = require("socks-proxy-agent");

async function gs(keyword, page) {
  var url =
    "http://www.99lib.net/book/search.php?type=all&keyword=" +
    encodeURI(keyword) +
    "&page=" +
    page;
  var opt = {};
  var bookSearch = {};
  var booksArray = [];
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
      var page = $("ul.list_box");
      var books = $("li", page);
      books.each(function(i, book) {
        var bookJson = {};
        var name = $("h2", book).text();
        var bookUrl = $("a", book).attr("href");
        var cover =
          "https:" +
          $("img", book)
            .first()
            .attr("src");
        var h4 = $("h4", book);
        var author = $("a", h4.get(0))
          .first()
          .text();
        var category = $("a", h4.get(1))
          .first()
          .text();
        var intro = $("div.intro", book).text();
        bookJson.bookName = name;
        bookJson.author = author;
        bookJson.cover = cover;
        bookJson.bookUrl = bookUrl;
        bookJson.category = category;
        bookJson.intro = intro;
        booksArray.push(bookJson);
      });
      bookSearch.books = booksArray;
      return bookSearch;
    })
    .catch(e => {
      return e.toString();
    });
}

module.exports = gs;
