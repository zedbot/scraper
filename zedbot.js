if(document.getElementById("zedbot_scraper") != undefined) {
function findLinks(node, prefix, depth){
  //console.log("#", depth, node);
  if( node.tagName == 'A') return [[node], depth];
  if( node.childElementCount == 1) return findLinks(node.firstElementChild, prefix, depth)
  
  var children = [];
  for(var i = 0; i < node.children.length; i++){
    if(node.children[i].tagName == 'SCRIPT') continue;
    if(node.children[i].tagName == 'META') continue;
    if(node.children[i].tagName == 'HEAD') continue;
    if(node.children[i].tagName == 'IFRAME') continue;
    if(node.children[i].tagName == 'NOSCRIPT') continue;
    //console.log('%',node.children[i]);
     children.push(node.children[i]);
  }
  //console.log("----------");
  if(children.length == 0) return; 
  var isCluster = true;
  var depth = 0;
  while(isCluster) {
    //console.log('>', depth, node);
    //for(var i = 0; i < children.length; i++){
    //  console.log(' >',children[i]);
    //}    
      var nullCount = 0;
      var notNullCount = 0;
      for(var i = 0; i < children.length; i++){
       // console.log( children[i])
        if (children[i] == null) {
          nullCount++;
        } else {
          notNullCount++;
        }
      }
    if(children[0] == null){
      nullCount--;
      children.shift();
    }
    if(children.length > 1 && children[children.length-1] == null){
      nullCount--;
      children.pop();
    }
    //console.log(nullCount, notNullCount, children.length);
      if (nullCount > 0 || children.length == 0) {
        isCluster = notNullCount < 2;
        break;
      }
    
    var sameTagCount = 0;
    var lastTag = children[0].tagName;
    var skippedTag = '';
    for(var i = 1; i < children.length; i++){
      //console.log(i, sameTagCount, skippedTag, lastTag);
      if(children[i] == null) continue;
      if(children[i].tagName == skippedTag ){
        children[i] = null;
        //console.log('skip',i);
        continue;
      }
      if(children[i].tagName == lastTag ){
        sameTagCount++;
      } else {
        skippedTag = lastTag;
        lastTag = children[i].tagName;
        if(i == 1) { // ignore first
          children[0] = null;
        } else if(i == children.length-1) {// ignore last
          children[i] = null;
        } else {
          isCluster = false;
          break;
        }
      }
    }
    //console.log(sameTagCount);
    //if(depth==1)throw 2;
    if(sameTagCount < 1){
      isCluster = false;
    } else {
      //console.log(1, node, children);
      var new_children = []
      for(var i = 0; i < children.length; i++){
        if(children[i] != null) {
         // console.log( children[i])
          new_children.push(children[i].firstElementChild);
        }
      }
      children = [].concat(new_children);
      
      depth++;
      //console.log(2, node, children);

     // throw "b";
    }
  }
  //console.log("isCluster: ", isCluster);
  
  if(!isCluster){
    for(var i = 0; i < node.children.length; i++){
      findLinks(node.children[i], prefix + ' ', depth+1);
    }
  } else {     
    var cluster = node.querySelectorAll("a");
    if(cluster.length > 0){
      clusters.push([node, cluster]);
    }
    //throw("a");
  }
  

}

  let newContent = `
    <html id="zedbot_scraper">
    <head>
      <style>
        html,body {
          margin:0;overflow:hidden;
        } 
        .zedbot_clearfix{
          clear:both;
        }
        #zedbot_panel {
          background:beige;
          margin:2px;
        }
		#zedbot_panel .block {
			float:left;
		}
        iframe{
          border:0;
          float:left;
          clear:both;
        }
        button.disabled {
          color: #aaa;
        }
      </style>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
      <script>
        var mode = 'product';
        var modeChange = false;
		var site = document.location.hostname.replace('www.','').replace(/\\./g,'_');
		
        $(function() {
          //TODO: use $.getScript or include it using script tag
			var script = document.createElement( 'script' );
			script.type = 'text/javascript';
			script.src = "https://crawler.zed.ee/builder.js?_=" + new Date().getTime();

			script.onload = function() {
				window.zedBotBuilder.init($);
			};
			document.getElementsByTagName('head')[0].appendChild(script);
			

        });
        
      </script>
    </head>
    <body>
      <div id="zedbot_panel" style="height:7%"> 
       <div class="block scrape_mode"><br>Dataset name:
        <input id="zedbot_mode"></input>
        <br>Dataset URL:
        <input id="zedbot_endpoint" size="30" value="http://localhost:9200/pages/product/">  <input type="button" id="zedbot_set_mode" value="Go">
        </div>
	  <div class="block stats"></div>
      <div class="zedbot_clearfix"></div>
      </div>
      <iframe width="100%" height="93%" id="page" sandbox="allow-same-origin allow-scripts"></iframe>
    </body>
  </html>`;
  document.open();
  document.write(newContent);
  document.close();
}



