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
      var page = $("div#right");
      return (
        '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN" dir="ltr"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head>' +
        page.toString() +
        "</html>"
      );
    })
    .catch(e => {
      return e.toString();
    });
}

module.exports = gs;
