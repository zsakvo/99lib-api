var http = require("./http");
var cheerio = require("cheerio");

async function review(sort, page) {
  var param = {
    sort: sort,
    page: page
  };
  var reviewArray = [];
  return http.get("/review/index.php", param).then(
    res => {
      var $ = cheerio.load(res.data);
      var ulList = $("ul.list_box");
      var reviews = $("li", ulList);
      reviews.each((i, r) => {
        var bookUrl = $("a", r).attr("href");
        var bookTitle = $("a", r).attr("title");
        var bookCover =
          "https:" +
          $("img", r)
            .first()
            .attr("src");
        var noteT = $("div.note_t", r);
        var reviewUrl = $("a", "h3", noteT).attr("href");
        var reviewTitle = $("a", "h3", noteT).text();
        var response = $("span", noteT).text();
        var noteA = $("div.note_a", r);
        var reviewAuthor = $($("a", noteA).get(0)).text();
        var reviewIntro = "";
        var introP = $("p", "div.intro", r);
        introP.each((i, c) => {
          if ($(c).text().length > 1) {
            reviewIntro +=
              $(c)
                .text()
                .trim() + "\n";
          }
        });
        reviewArray.push({
          bookUrl: bookUrl,
          bookTitle: bookTitle,
          bookCover: bookCover,
          reviewUrl: reviewUrl,
          reviewTitle: reviewTitle,
          response: response,
          reviewAuthor: reviewAuthor,
          reviewIntro: reviewIntro
        });
      });
      return {
        reviews: reviewArray
      };
    },
    err => {
      return {
        err: err.toString()
      };
    }
  );
}

module.exports = review;
