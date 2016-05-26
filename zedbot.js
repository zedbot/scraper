if(document.getElementById("zedbot_scraper") != undefined) {

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



