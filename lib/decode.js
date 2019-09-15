var cheerio = require("cheerio");
var client;

var base64 = {
  map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  decode: function(a) {
    var binary = ""
    var b = (binary = "");
    for (var i = 0; i < a.length; i++) {
      if (a.substr(i, 1) == "=") {
        break;
      }
      var c = this.map.indexOf(a.charAt(i)).toString(2);
      binary +=
        { 1: "00000", 2: "0000", 3: "000", 4: "00", 5: "0", 6: "" }[c.length] +
        c;
    }
    binary = binary.match(/[0-1]{8}/g);
    for (var i = 0; i < binary.length; i++) {
      b += String.fromCharCode(parseInt(binary[i], 2));
    }
    return b;
  }
};

var content = {
  init: function(a) {
    this.star = 0;
    this.childNode = [];
    this.box = a;
    for (var i = 0; i < this.box.children().length; i++) {
      if (this.box.children()[i].name == "h2") {
        this.star = i + 1;
      }
      if (
        this.box.children()[i].name == "DIV" &&
        this.box.children()[i].attribs.class != "chapter"
      ) {
        break;
      }
    }
    this.load();

    return this.result;
  },

  load: function() {
    var e = base64.decode(client).split(/[A-Z]+%/);
    var j = 0;
    for (var i = 0; i < e.length; i++) {
      if (e[i] < 3) {
        this.childNode[e[i]] = this.box
          .children()
          .eq(i + this.star)
          .text();
        j++;
      } else {
        this.childNode[e[i] - j] = this.box
          .children()
          .eq(i + this.star)
          .text();
        j = j + 2;
      }
    }
    this.result = "";
    for (var s = 0; s < this.childNode.length; s++) {
      this.result += this.childNode[s] + "\n\n";
    }
  }
};

function decode(a, b) {
  var $ = cheerio.load(a, { decodeEntities: false });
  $(
    "strike,acronym,bdo,big,site,code,dfn,kbd,q,s,samp,tt,u,var,cite,mark,details,figure,footer"
  ).remove();
  client = b;
  return content.init($("#content"));
}

module.exports = decode;
