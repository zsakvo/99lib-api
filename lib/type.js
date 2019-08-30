var http = require("./http");
var cheerio = require("cheerio");

async function list(type, page) {
  var param = {
    type: type,
    page: page
  };
  var bookSearch = {};
  var booksArray = [];
  return http.get("/book/index.php", param).then(
    res => {
      var $ = cheerio.load(res.data);
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
        var introDiv = $("div.intro", book);
        var introP = $("p", introDiv);
        var intro = "";
        introP.each((i, p) => {
          intro += $(p).text() + "\n";
        });
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
    },
    err => {
      return err.toString();
    }
  );
}

module.exports = list;
