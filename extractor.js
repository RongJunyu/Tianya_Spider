
var fs = require("fs");

module.exports = class Extractor {
  constructor () {
  }
  
  getNextPageURL(res) {
    var $ = res.$;
    var urlSuffix = $(".js-keyboard-next").first().attr("href");
    if (urlSuffix === undefined) {
      return null;
    }
    var url = "http://bbs.tianya.cn" + urlSuffix;
    return url;
  }

  getCurPage(res) {
    return res.$(".atl-pages").find("strong").first().text();
  }

  extractData(res) {
    var $ = res.$;
    var allContentLines = [];
    
    var host = $("#post_head").find(".atl-info").find("span").find("a").text();
    var curPage = this.getCurPage(res);

    if (curPage === "1") { //first page
      //Topic
      var topic = $(".s_title").text();
      allContentLines.push(topic + "\n");

      allContentLines.push("作者: " + host + "\n");
      //Source URL
      var sourceURL = res.options.uri;
      allContentLines.push("原文地址: " + sourceURL + "\n\n");  
      
      var mainPost = $(".bbs-content").first().text();
      allContentLines.push(mainPost);
    }
     
    $(".atl-item").each(function (index, element) {
      var author = $(element).find(".atl-head").find("span").find("a").text();
      if (author !== host) {
        return true ;
      } 
        
      var bbsContent = $(element).find(".bbs-content").contents().each(function(index, element) {
        if (element.data !== undefined) {
          var bbsContent = $(element).text();
          allContentLines.push(bbsContent);
        }
      });
    })
    
    return allContentLines;
  }
  
};
