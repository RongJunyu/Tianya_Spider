var fs = require("fs");
var thunkify = require("thunkify");
var co = require("co");
var Crawler = require("crawler");
var Extractor = require("./extractor.js");

var args = process.argv.slice(2);
if (args.length !== 2) {
  console.log("Arguments ERROR");
  return ;
}

var startURL = args[0];
var outputFile = args[1];

var extractor = new Extractor();

var writeFile = function* (filename, dataArray) {
  if (dataArray.length === 0) {
    return;
  }
  yield thunkify(fs.writeFile)(filename, "版权归原作者所有\n");
  for (var i = 0; i < dataArray.length; i++) {
    yield thunkify(fs.appendFile)(filename, dataArray[i]);
  }
}

var c = new Crawler({
  maxConnections : 1,
  
  
  callback : function (error, res, done) {
    if(error) {
      console.log(error);
    } else {
      var dataArray = extractor.extractData(res);
      var nextUrl = extractor.getNextPageURL(res);
      var curPage = extractor.getCurPage(res);
    }

    co(writeFile(outputFile + ".page" + curPage, dataArray));
    
    done();
    
    if (nextUrl != null) {
      c.queue(nextUrl);
      console.log(nextUrl);
    }

  }
});


c.queue(startURL);
console.log(startURL);