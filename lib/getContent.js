var rp = require("request-promise");
var cheerio = require("cheerio");
var decode = require("./decode");
var config = require("../config");
var SocksProxyAgent = require("socks-proxy-agent");

async function gc(bid, cid) {
  var url = "http://www.99lib.net/book/" + bid + "/" + cid;
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
      var client = $("meta[name=client]").attr("content");
      var content = $("#content");
      return decode('<div id="content">' + content.html() + "</div>", client);
    })
    .catch(e => {
      return e.toString();
    });
}

module.exports = gc;
