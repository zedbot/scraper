
(function() {

    var MD5=new function(){function r(r){return u(a(o(r),8*r.length))}function n(r){try{}catch(n){A=0}for(var t,e=A?"0123456789ABCDEF":"0123456789abcdef",o="",u=0;u<r.length;u++)t=r.charCodeAt(u),o+=e.charAt(t>>>4&15)+e.charAt(15&t);return o}function t(r){try{}catch(n){v=""}for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e="",o=r.length,u=0;o>u;u+=3)for(var a=r.charCodeAt(u)<<16|(o>u+1?r.charCodeAt(u+1)<<8:0)|(o>u+2?r.charCodeAt(u+2):0),c=0;4>c;c++)e+=8*u+6*c>8*r.length?v:t.charAt(a>>>6*(3-c)&63);return e}function e(r){for(var n,t,e="",o=-1;++o<r.length;)n=r.charCodeAt(o),t=o+1<r.length?r.charCodeAt(o+1):0,n>=55296&&56319>=n&&t>=56320&&57343>=t&&(n=65536+((1023&n)<<10)+(1023&t),o++),127>=n?e+=String.fromCharCode(n):2047>=n?e+=String.fromCharCode(192|n>>>6&31,128|63&n):65535>=n?e+=String.fromCharCode(224|n>>>12&15,128|n>>>6&63,128|63&n):2097151>=n&&(e+=String.fromCharCode(240|n>>>18&7,128|n>>>12&63,128|n>>>6&63,128|63&n));return e}function o(r){for(var n=Array(r.length>>2),t=0;t<n.length;t++)n[t]=0;for(var t=0;t<8*r.length;t+=8)n[t>>5]|=(255&r.charCodeAt(t/8))<<t%32;return n}function u(r){for(var n="",t=0;t<32*r.length;t+=8)n+=String.fromCharCode(r[t>>5]>>>t%32&255);return n}function a(r,n){r[n>>5]|=128<<n%32,r[(n+64>>>9<<4)+14]=n;for(var t=1732584193,e=-271733879,o=-1732584194,u=271733878,a=0;a<r.length;a+=16){var c=t,d=e,A=o,v=u;t=f(t,e,o,u,r[a+0],7,-680876936),u=f(u,t,e,o,r[a+1],12,-389564586),o=f(o,u,t,e,r[a+2],17,606105819),e=f(e,o,u,t,r[a+3],22,-1044525330),t=f(t,e,o,u,r[a+4],7,-176418897),u=f(u,t,e,o,r[a+5],12,1200080426),o=f(o,u,t,e,r[a+6],17,-1473231341),e=f(e,o,u,t,r[a+7],22,-45705983),t=f(t,e,o,u,r[a+8],7,1770035416),u=f(u,t,e,o,r[a+9],12,-1958414417),o=f(o,u,t,e,r[a+10],17,-42063),e=f(e,o,u,t,r[a+11],22,-1990404162),t=f(t,e,o,u,r[a+12],7,1804603682),u=f(u,t,e,o,r[a+13],12,-40341101),o=f(o,u,t,e,r[a+14],17,-1502002290),e=f(e,o,u,t,r[a+15],22,1236535329),t=h(t,e,o,u,r[a+1],5,-165796510),u=h(u,t,e,o,r[a+6],9,-1069501632),o=h(o,u,t,e,r[a+11],14,643717713),e=h(e,o,u,t,r[a+0],20,-373897302),t=h(t,e,o,u,r[a+5],5,-701558691),u=h(u,t,e,o,r[a+10],9,38016083),o=h(o,u,t,e,r[a+15],14,-660478335),e=h(e,o,u,t,r[a+4],20,-405537848),t=h(t,e,o,u,r[a+9],5,568446438),u=h(u,t,e,o,r[a+14],9,-1019803690),o=h(o,u,t,e,r[a+3],14,-187363961),e=h(e,o,u,t,r[a+8],20,1163531501),t=h(t,e,o,u,r[a+13],5,-1444681467),u=h(u,t,e,o,r[a+2],9,-51403784),o=h(o,u,t,e,r[a+7],14,1735328473),e=h(e,o,u,t,r[a+12],20,-1926607734),t=i(t,e,o,u,r[a+5],4,-378558),u=i(u,t,e,o,r[a+8],11,-2022574463),o=i(o,u,t,e,r[a+11],16,1839030562),e=i(e,o,u,t,r[a+14],23,-35309556),t=i(t,e,o,u,r[a+1],4,-1530992060),u=i(u,t,e,o,r[a+4],11,1272893353),o=i(o,u,t,e,r[a+7],16,-155497632),e=i(e,o,u,t,r[a+10],23,-1094730640),t=i(t,e,o,u,r[a+13],4,681279174),u=i(u,t,e,o,r[a+0],11,-358537222),o=i(o,u,t,e,r[a+3],16,-722521979),e=i(e,o,u,t,r[a+6],23,76029189),t=i(t,e,o,u,r[a+9],4,-640364487),u=i(u,t,e,o,r[a+12],11,-421815835),o=i(o,u,t,e,r[a+15],16,530742520),e=i(e,o,u,t,r[a+2],23,-995338651),t=C(t,e,o,u,r[a+0],6,-198630844),u=C(u,t,e,o,r[a+7],10,1126891415),o=C(o,u,t,e,r[a+14],15,-1416354905),e=C(e,o,u,t,r[a+5],21,-57434055),t=C(t,e,o,u,r[a+12],6,1700485571),u=C(u,t,e,o,r[a+3],10,-1894986606),o=C(o,u,t,e,r[a+10],15,-1051523),e=C(e,o,u,t,r[a+1],21,-2054922799),t=C(t,e,o,u,r[a+8],6,1873313359),u=C(u,t,e,o,r[a+15],10,-30611744),o=C(o,u,t,e,r[a+6],15,-1560198380),e=C(e,o,u,t,r[a+13],21,1309151649),t=C(t,e,o,u,r[a+4],6,-145523070),u=C(u,t,e,o,r[a+11],10,-1120210379),o=C(o,u,t,e,r[a+2],15,718787259),e=C(e,o,u,t,r[a+9],21,-343485551),t=g(t,c),e=g(e,d),o=g(o,A),u=g(u,v)}return Array(t,e,o,u)}function c(r,n,t,e,o,u){return g(d(g(g(n,r),g(e,u)),o),t)}function f(r,n,t,e,o,u,a){return c(n&t|~n&e,r,n,o,u,a)}function h(r,n,t,e,o,u,a){return c(n&e|t&~e,r,n,o,u,a)}function i(r,n,t,e,o,u,a){return c(n^t^e,r,n,o,u,a)}function C(r,n,t,e,o,u,a){return c(t^(n|~e),r,n,o,u,a)}function g(r,n){var t=(65535&r)+(65535&n),e=(r>>16)+(n>>16)+(t>>16);return e<<16|65535&t}function d(r,n){return r<<n|r>>>32-n}var A=0,v="";this.hex_md5=function(t){return n(r(e(t)))},this.b64_md5=function(n){return t(r(e(n)))}};

	var url = window.location.href.split('#')[0];
	var site = document.location.hostname.replace('www.','').replace(/\./g,'_');
	var jq = null;
  
  	var stats_query = {
    "query": {
    "term": {
      "site":site
    }
  },
		  "aggs": {
			"scraped": {
			  "value_count": {
				"field": "last_scraped"
			  }
			},
			"found": {
			  "value_count": {
				"field": "found"
			  }
			}
		}
	};

  
	var mode = null;
    var ZedBotBuilder = {
		init:function(jQuery){
			jq = jQuery;
			var iframe = jq("#page");
			var builder = this;
			iframe.attr('src', location.href);
			iframe.on('load', function(){
				//var selector = document.createElement( 'div' );
				//selector.setAttribute('id',"zedbot_selector");
				//selector.setAttribute('style', "position:absolute;top: 100px;left: 300px;border 1px solid red;width:100px;border: 1px solid red;z-index: 100;height: 40px;");
				//iframe[0].contentWindow.document.getElementsByTagName('body')[0].appendChild(selector);
				
				console.log("load", iframe[0].contentWindow.location);
        window.history.pushState({},"", iframe[0].contentWindow.location);

				jq("#zedbot_panel .url").html(iframe[0].contentWindow.location.href);
				iframe[0].contentWindow.onbeforeunload = function () {
					console.log("unload", this);
				};
				iframe[0].contentWindow.document.addEventListener("load", function(event) {
					console.log("loaded", this);
				});        
        /*
				jq(this).contents().find("body").on('mouseup', function(e) { 		
					console.log(iframe[0].contentWindow, e);
					var sel = iframe[0].contentWindow.getSelection();
					console.log("selection", sel);
					var node = null
					if(sel.type == 'Range') {
						var range = sel.getRangeAt(0);
						console.log("range", range);
						node = range.commonAncestorContainer;
						if (node.nodeName == "#text") {
						  if(node.parentNode.childNodes.length == 1) {
							node = node.parentNode;
						  } else {
							var text = node.data.substr(range.startOffset, range.endOffset).trim();
							console.log(text);
							var parenttext = node.parentNode.textContent.trim();
							var start = parenttext.indexOf(text);
							var regex = parenttext.substr(0, range.startOffset)+"(.*)"+parenttext.substr(range.endOffset);
							node = node.parentNode;
							//jq(node).data("regex", regex);
						  }
						} else {
							// nothing
						}
					} else {
						if (!e.ctrlKey) {
							e.preventDefault();			
						}
						node = e.target;
					}
					builder.getScope(node);
					selector.style.top = e.clientY - 60;
					selector.style.left = e.clientX + 40;
					jq(".zedbot_selection").removeClass("zedbot_selection");
					jq(node).addClass("zedbot_selection");
					var scope = builder.getScope(node);
					console.log("node", node, scope);
					
	  
						//builder.showSelector(e.target, sel.getRangeAt(0));

						/*
						var range = sel.getRangeAt(0);
						console.log("range", range);
						node = range.commonAncestorContainer;
						if (node.parentNode == e.target) {
							var text = node.textContent.trim();
							console.log("text", text, e.target);
						} else {
							// selected multiple nodes
						}
						* /
					
					
				});
				jq(this).contents().find("body").on('contextmenu', function(e) {
					if (!e.ctrlKey) {
						e.preventDefault();
					}
					builder.showSelector(e.target);
				})
				*/
				if(mode != null) {
          			builder.getStats();
					var script = document.createElement( 'script' );
					script.type = 'text/javascript';
					script.src = "https://crawler.zed.ee/scraper.js?_=" + new Date().getTime();
          script.id = "zedbot_scraper";
					script.setAttribute('data-classifier',mode);
					iframe[0].contentWindow.document.getElementsByTagName('head')[0].appendChild(script);
					//builder.loadSpecs();
					//jq("body").on("mouseup", function(e) {
					// var sel = window.getSelection();
					// console.log(2,sel);
					//  if(sel.type == 'Range') {
					//	var range = window.getSelection().getRangeAt(0);
					//	node = range.commonAncestorContainer;
					//	if (node.parentNode == e.target) {
					//		var text = node.textContent.trim();
					//		
					//	  }
					//	}
					//})

				}
				//builder.findTitle(iframe[0].contentWindow.document);
				
			});
      
			$("#zedbot_panel #zedbot_set_mode").click(function(e){
				e.preventDefault();
				mode = document.getElementById("zedbot_mode").value;
				iframe[0].contentWindow.location.reload();
			});
      
		},
		getScope: function(elem) {
			if(elem.hasAttribute("itemscope")) {
				return elem.getAttribute("itemtype");
			}
			else {
				var parent = elem.getParent();
				if (parent.nodeType === DOCUMENT_NODE) return null;
				else return builder.getScope(parent);
			}
		},
		showSelector: function(elem, range) {
			console.log(elem, range);
		},
		getStats:function(){
      jq.when(
        jq.ajax({url:'https://crawler.zed.ee/zedbot_links/'+mode+'/_search?search_type=count',  type:'POST', data:JSON.stringify(stats_query)}),
        jq.ajax({url:'https://crawler.zed.ee/zedbot_page/'+mode+'/_search?search_type=count',  type:'POST', data:JSON.stringify(stats_query)})
      ).then(function(links, pages) {
				jq("#zedbot_panel .stats").append("Scraped: " + pages[0].aggregations.scraped.value + ", crawled: " + links[0].aggregations.scraped.value + ', found: ' + links[0].aggregations.found.value+"<br>");
			});	  
		},
		loadSpecs:function() {
			jq.post('https://crawler.zed.ee/zedbot_site/'+mode+'/_mget',  JSON.stringify({
				ids: ['_default', site]
			  }),
			function(response){
				console.log(response);
				if(response.docs[1].found) {
					specs = jq.extend(true, {}, response.docs[0]._source, response.docs[1]._source);
				} else {
					specs = response.docs[0]._source;
					specs.enabled = false;
					specs.url = document.location.href;
					specs.canonical = jq('link[rel="canonical"]').attr('href');
				}
				if(specs.export == undefined) {
					specs.export = {}
				}
				console.log(specs);
									
			}).fail(function( jqXHR, textStatus) {
				console.log( "error",textStatus );
			});

		},
		findTitle: function(elem){
			var biggestText = null;
			var biggestArea = 0;

			function findText(node, prefix){
			  if( node.nodeType == 3) {
				var text = node.textContent.replace(/(\r\n|\n|\r| |\t)/gm,""); 
				if(text == "" || text.length < 3 || text.length > 200) return;
				if (biggestText == null){
				   biggestText = node;
				} else {
				  var biggestTxt = node.textContent.replace(/(\r\n|\n|\r| |\t)/gm,""); 
				  var p1 = biggestText.parentNode;
				  var p2 = node.parentNode;
				  var a1 = p1.clientHeight //* p1.clientWidth;
				  var a2 = p2.clientHeight //* p2.clientWidth;
				  if (a2 > a1){
					  biggestText = node;
					  console.log("biggestText", p1, p2, text, a1, a2);
				  }
				  return;
				}
			  }
			  for(var i = 0; i < node.childNodes.length; i++){
				 findText(node.childNodes[i], prefix + ' ');
			  }
			}

			findText(elem, ' ');

			console.log("biggestText !", biggestText);
		}
	};

    // leak into global namespace
    window.zedBotBuilder = ZedBotBuilder;

})();