loadSpecs = function(baseurl, callback){
  var jq = require('jquery');
  
  jq.getScript(baseurl + "/specs/load.js", function( data, textStatus, jqxhr ) {
    zedbot_loadspecs(jq, baseurl+"/specs/", function(zedbot_specs){
      callback(zedbot_specs);
    });
  })
  
  var endpoint_url = localStorage.getItem("zedbot_endpoint_url");
  console.log("loadSpecs", baseurl, endpoint_url);
  return;
  jq.getScript( "https://crawler.zed.ee/specs/load_specs.js", function( data, textStatus, jqxhr ) {
      zedbot_loadspecs(jq, function(zedbot_specs){
        //console.log("default specs: ", zedbot_specs, window.zedbot_specs )
        jq.post('https://crawler.zed.ee/zedbot_site/'+type+'/_mget',  JSON.stringify({
          ids: [site]
        }),
        function(response){
              console.log("mget",response);
          if(response.docs[0].found) {
            //specs = jq.extend(true, {}, response.docs[0]._source, response.docs[1]._source);
            specs = jq.extend(true, {}, zedbot_specs, response.docs[0]._source);
          } else {
            //specs = response.docs[0]._source;
            specs = zedbot_specs;
            specs.enabled = false;
            specs.url = document.location.href;
            specs.canonical = jq('link[rel="canonical"]').attr('href');
          }
          callback(specs);
        })
      })
  })
};

module.exports = loadSpecs;