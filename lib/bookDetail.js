var rp = require("request-promise");
var cheerio = require("cheerio");
var config = require("../config");
var SocksProxyAgent = require("socks-proxy-agent");

async function bd(bid) {
  var url = "http://www.99lib.net/book/" + bid + "/index.htm";
  var opt = {};
  opt["uri"] = url;
  opt["timeout"] = config.timeout;
  opt["User-Agent"] = config.ua;
  if (config.proxy.includes("http://")) {
    opt["proxy"] = config.proxy;
  } else {
    opt["agent"] = new SocksProxyAgent(config.proxy);
  }
  return rp(opt)
    .then(res => {
      var $ = cheerio.load(res);
      $("#nav").remove();
      var book_info = $("#book_info");
      var dir = $("#dir");
      var page = book_info.toString() + dir.toString();
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

module.exports = bd;
