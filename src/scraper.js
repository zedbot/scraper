"use strict";
var css = require('../scraper.css');
//var scraper = require('scraper.js');
var $ = require('jquery');
var crypto = require('crypto');
window.zedbot_data = {};
 
window.zedbot_script = $("#zedbot_scraper").attr("src");
window.zedbot_base = window.zedbot_script.substr(0, window.zedbot_script.lastIndexOf("/"));
window.zedbot_page_id =  crypto.createHash('md5').update(location.href).digest('hex');
window.zedbot_site = (window.zedbot_hostname || document.location.hostname).replace('www.','').replace(/[.-]/g,'_');

if($("#zedbot_scraper").length > 0) {
  var conf = $("#zedbot_scraper").data();
  console.log("zedbot loading ....", zedbot_script, zedbot_base, zedbot_page_id, conf);
  var mode = conf["mode"] || "web";
    console.log("---------------- "+ mode +"----------------");
  if(mode == "web") {
    localStorage.setItem("zedbot_script", window.zedbot_script);
    localStorage.setItem("zedbot_scraper", window.zedbot_base);
    localStorage.setItem("zedbot_mode", "iframe");
    localStorage.setItem("zedbot_dataset", conf.dataset);
    localStorage.setItem("zedbot_endpoint_url", conf.endpoint);
    localStorage.setItem("zedbot_specs_url", conf.specs_url);
    
    require('./loader.js')(window.zedbot_script );
      
  } else if(mode == "iframe") {
    require('./specs.js')(window.zedbot_base, function(specs){
      require('./annotator.js')(specs);
    });
  }
}
