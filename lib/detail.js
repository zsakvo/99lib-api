var cheerio = require("cheerio");
var http = require("./http");

async function bd(bid) {
  var bookDetail = {};
  var chapters = [];
  return http.get("/book/" + bid + "/index.htm").then(
    res => {
      var $ = cheerio.load(res.data);
      var book_info = $("#book_info");
      var name = $("h2", book_info).text();
      var coverImg =
        "https:" +
        $("img", book_info)
          .first()
          .attr("src");
      var introDiv = $("div.intro", book_info);
      var introP = $("p", introDiv);
      var intro = "";
      introP.each((i, p) => {
        intro += $(p).text() + "\n";
      });
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
      return bookDetail;
    },
    err => {
      return {
        err: err.toString()
      };
    }
  );
}

module.exports = bd;
