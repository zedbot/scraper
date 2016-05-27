"use strict";
var replace = function(script){
  console.log("script",script);
  var html = require('./loader.html');

  document.open();
  document.write(html.replace("[url]", script));
  document.close();
  
}

module.exports = replace