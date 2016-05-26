"use strict";
var css = require('../scraper.css');
//var scraper = require('scraper.js');
var $ = require('jquery');

console.log(this, $("#zedbot_scraper"));
if($("#zedbot_scraper").length > 0) {
  var conf = $("#zedbot_scraper").data();
  console.log("zedbot loading ....", conf);
  var mode = conf["mode"] || "web";
  if(mode == "web") {
    console.log($("#zedbot_scraper").attr("src"));
    localStorage.setItem("zedbot_scraper", $("#zedbot_scraper").attr("src"));
    localStorage.setItem("zedbot_mode", "iframe");
    localStorage.setItem("zedbot_dataset", conf.dataset);
    localStorage.setItem("zedbot_endpoint", conf.endpoint);
    localStorage.setItem("zedbot_specs", conf.specs);
    
	require('./loader.js')($("#zedbot_scraper").attr("src"));
    
	console.log("----------------");
  } else if(mode == "iframe") {
	//require('./specs/load.js')($, {});
	var specs = require("../specs/document.json");
    require('./annotator.js')($, specs);
  }
}
