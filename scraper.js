// Bookmark:
//<a href="javascript:(function(){var s=document.createElement('script');s.setAttribute('src','https://crawler.zed.ee/scraper.js');if(typeof zedBot=='undefined'){document.getElementsByTagName('head')[0].appendChild(s);}})();
var zedBot = new function(){
  this.product = {}
  this.specs = {}
  var product = this.product;
  var specs = this.specs;
	//this.jq = null;
	//this.es = null;
  var lastNode = null;
  var lastNodeSelected = null;
  this.site = null;
  this.type = null;
  var site = this.site;
  var type = this.type;
  var mode;
  var jq;
  var self = this;
  this.jq = function() {
    return jq;
  }
  this.init = function(_type, _mode, _jQuery, _es) {
    //console.log("init");
    site = document.location.hostname.replace('www.','').replace(/\./g,'_');
    //type = document.getElementById("zedbot_scraper").getAttribute("data-classifier");
    type = _type;
    //mode = document.getElementById("zedbot_scraper").getAttribute("data-mode");
    mode = _mode;
    es = _es;
    if(type==null) {
      alert("Bookmarki uuem vesioon minust");
    }
    if(_mode == 'web') {
      var c=document.createElement('link');c.setAttribute('rel','stylesheet');c.setAttribute('href','https://crawler.zed.ee/scraper.css?'+new Date().toString());
      document.getElementsByTagName('head')[0].appendChild(c);
    }  
    if (_jQuery == undefined) {
      var s=document.createElement('script');s.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js');
      s.onload = function(){
        //console.log('jQuery loaded', jQuery);
		/*
		jQuery.getScript("https://crawler.zed.ee/elasticsearch.jquery.min.js", function(){
			es = new jQuery.es.Client({
			  hosts: 'crawler.zed.ee:80'
			});
			//console.log(es);
			initZedBot();
		});
		*/
        jq = jQuery.noConflict( true );
        initZedBot();
      }
      document.getElementsByTagName('head')[0].appendChild(s);
    } else {
      jq = _jQuery;
      initZedBot();
    }
    
  };
  this.parse = function() {
    product.site = site;
    product.type = type;
    window.zedbot_matches = 0;
    window.zedbot_rulecount = 0;
	  extractFieldBySelector(specs, jq(window.document), product);
    product.fields_matched = window.zedbot_matches;
    product.rulecount = window.zedbot_rulecount;
    product.score = product.fields_matched / product.rulecount;
    //var links = clusterLinks();
    product.target_template = specs.template;
    product.template = 'template';//window.zedbot_links[0];
    product.links = window.zedbot_links[1];
    

	  return product;
  }
//  this.clusterLinks = function() {
//    return clusterLinks();
//  }
  
  var initZedBot = function() {
    //console.log("initZedBot");
		if(window.Prototype || window.MooTools) {
			delete Object.prototype.toJSON;
			delete Array.prototype.toJSON;
			if(Hash.prototype) delete Hash.prototype.toJSON;
			delete String.prototype.toJSON;
		}
        if (!JSON.stringify) JSON.stringify = JSON.encode;
        if (!JSON.parse) JSON.stringify = JSON.decode;
        
	jq.support.hrefNormalized = true;
	/*
	es.mget({
	  index: 'zedbot',
	  type: type,
	  body: {
		ids: ['_default', site]
	  }
	},
	*/ 
  
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
            if(specs.export == undefined) {
                specs.export = {}
            }
        if("follow_links" in specs.children)
          delete specs.children.follow_links;

          window.zedbot_links = clusterLinks(specs);
          if(specs.template === undefined){
            specs.template = window.zedbot_links[0];
          } else {
            specs.template = window.zedbot_links[0];
          }
          specs.has_microdata = jq("*[itemscope]").length >0;
          
        if("triggers" in specs){
          for (var _event in specs.triggers){
            console.log("trigger", _event, specs.triggers[_event]);
            if(_event == "click") {
              jq( specs.triggers[_event] )[0].click();
            }
          }
        }

        
        if(mode == 'web') {
          loadUI();
          jq("#zedbot_test").trigger("click");
        } else /*if(window.zedBotReady != undefined)*/{
          window.zedBotReady();
        }
      
          
    //		  //console.log(error, response);
      }).fail(function( jqXHR, textStatus) {
        //console.log( "error",textStatus );
      });
	  });
  });
/*
    //console.log("https://crawler.zed.ee/specs.php?type="+type+"&site="+site);
    jq.get("https://crawler.zed.ee/specs.php?type="+type+"&site="+site, function(s){
      specs.children = s.children;
	  specs.url = location.href;
	  s.example_urls.push(specs.url);
	  specs.example_urls = jq.unique(s.example_urls);
	  specs.ignore_urls = s.ignore_urls;
	  if(mode == 'web') {
		  loadUI();
		  jq("#zedbot_test").trigger("click");
	  } else /*if(window.zedBotReady != undefined)* /{
		  window.zedBotReady();
	  }
    });	
*/
  }
  var saveScript = function(){
	if(specs.version  == undefined) specs.version  = 0;
	specs.version += 1;
    jq.ajax({url:'https://crawler.zed.ee/zedbot_site/'+type+'/'+site+'',  type:'PUT', data:JSON.stringify(specs), success:
      function(response){
        //console.log(response);
      }
    });
    var page_id = MD5.hex_md5(specs.url);

    var page = {
      site: site,
      url: specs.url,
      path_score: 0.1,
      score:0.1,
      found: new Date().toISOString(),
    }

    jq.ajax({url:'https://crawler.zed.ee/zedbot_links/'+type+'/'+page_id+'',  type:'PUT', data:JSON.stringify(page), success:
      function(response){
        //console.log(response);
      }
    });
  }
  var getStats = function(target_el){
	  var stat_query = {
  "aggs": {
    "site": {
      "filter": {
        "term": {
          "site": site
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
    }
  }
};
    jq.ajax({url:'https://crawler.zed.ee/zedbot_page/'+type+'/_search?search_type=count',  type:'POST', data:JSON.stringify(stat_query), success:
      function(response){
        //console.log(response);
		jq(target_el).append("Scraped: " + response.aggregations.site.scraped.value + ', found: ' + response.aggregations.site.found.value+"<br>");
      }
    });	  
  }
  var loadUI = function() {
    //console.log('zedBot loaded' );

    jq("<div/>")
	.append(jq("<div/>")
      .addClass('zedbot_parser')
	  .append(jq("<span>Crawling: </span>"))
	  .append(jq("<input type='checkbox' "+(specs.enabled == true ? 'checked=checked':'')+"'; class='toggle-soft' name='zedbot_enabled'/>").change(function(){
			var exists = specs.enabled != null;
			specs.enabled = this.checked;
			saveScript();
		}))
	  .append(jq("<br>"))
//      .append(jq("<span>url:</span><span class='zedbot_url'>"+document.location.pathname+"</span><br/>"))
//      .append(jq("<span>url:</span><span class='zedbot_url_match'>"+specs.url_match+"</span><br/>"))
      .append(jq("<span>Language:</span>"))
	  .append(jq("<select>").append("<option>et<option>en<option>ru").change(function(){
		  
	  }))
	  .append(jq("<br>"))
      .append(jq("<button id='zedbot_test'>test selectors</button>").click(function(){
        //console.log("test");
        window.zedbot_matches = 0;
        window.zedbot_rulecount = 0;
        extractFieldBySelector(specs, jq(window.document), product);
        //console.log(JSON.stringify(product, null, ' '));
        console.log("matches", window.zedbot_matches);
        console.log("rules", window.zedbot_rulecount);
        console.log("template", specs.template);
        jq(".zedbot_tester").html('<pre>'+JSON.stringify(product, null, ' ')+'</pre>').show();
        
        //console.log();
      }))
	  .append(jq("<br>"))
      .append(jq("<button id='zedbot_edit'>edit script</button>").click(function(){
		  jq(".zedbot_tester").html('<textarea id="zedbot_editor">'+JSON.stringify(specs, null, 2)+'</textarea>').show();
		}))
      .append(jq("<br>"))
      .append(jq("<button id='zedbot_save'>save script</button>").click(function(){
          //extractFieldBySelector(specs, jq("html"), product);
          saveScript();        
      }))
      .append(jq("<br>"))
	  .append(jq("<span>Export: </span>"))
	  .append(jq("<input type='checkbox' "+(specs.export.dev == true ? 'checked=checked':'')+"'; class='toggle-soft' name='zedbot_export_dev'/>").change(function(){
			specs.export.dev = this.checked;
			saveScript();
		}))
	  .append(jq("<span>Dev&nbsp;</span>"))        
	  .append(jq("<input type='checkbox' "+(specs.export.live == true ? 'checked=checked':'')+"'; class='toggle-soft' name='zedbot_export_live'/>").change(function(){
			specs.export.live = this.checked;
			saveScript();
		}))
	  .append(jq("<span>Live&nbsp;</span><br>"))
	 )
      .appendTo("body")
  
    //getStats(".zedbot_parser");

    jq('<div/>')
      .click(function(e){if(e.target == this) jq(this).hide()})
      .addClass("zedbot_tester")
      .appendTo("body")
    
    jq("<div/>")
      .addClass('zedbot_classifier')
      .append(jq("<ul>"))
      .appendTo("body")
       
    jq("body").on("contextmenu", ".zedbot_url", function(e) {
      e.stopPropagation();
      e.preventDefault();
	 var sel = window.getSelection();
      if(sel.type == 'Range') {
        var range = window.getSelection().getRangeAt(0);
        node = range.commonAncestorContainer;
        if (node.parentNode == e.target) {
            var text = node.textContent.trim();
            var regex = text.substr(0, range.startOffset) + "(.*)" + text.substr(range.endOffset+1, text.length);
            jq(".zedbot_url_match").text('^'+regex+'$');
          }
        }
	})
	
    jq("body").contextmenu(function(e) {
      e.stopPropagation();
      e.preventDefault();
      if(e.button != 2) return false;
      //console.log(e);
      while(jq(".textme").length>0) {
        jq(jq(".textme")[0].firstChild).unwrap();
      } 
      jq(".selected_features").removeClass("selected_features");
      
      jq(".zedbot_classifier").css({
        top: e.pageY,
        left: e.pageX
      }).show();
      ////console.log(e);
      var sel = window.getSelection();
      var node = null;
      if(sel.type == 'Range') {
        var range = window.getSelection().getRangeAt(0);
        node = range.commonAncestorContainer;
        
        //console.log("Range", node, range);
        if (node.nodeName == "#text") {
          if(node.parentNode.childNodes.length == 1) {
            //console.log("I'm here");
            var regex = node.data.substr(0, range.startOffset)+"(.*)"+node.data.substr(range.endOffset);
            node = node.parentNode;
            jq(node).data("regex", regex);
            //console.log("regex", regex)
          } else {
            var text = node.data.substr(range.startOffset, range.endOffset).trim();
            var parenttext = node.parentNode.textContent.trim();
            var start = parenttext.indexOf(text);
            var regex = parenttext.substr(0, start)+"(.*)";
            node = node.parentNode;
            jq(node).data("regex", regex);
            //console.log("regex", regex)
          }
        }
      } else {
        node = e.target;
      }
      if(node == lastNodeSelected) {
        node = lastNode.parentNode;
      } else {
        lastNodeSelected = node;
      }
      lastNode = node;
      processNode(node);
    });
    jq(document).on("keyup", "#zedbot_editor", function(e){
			jq(this).css({border: "3px solid gray"});
      try{
        specs = JSON.parse(jq(this).val());		
        jq(this).css({border: "3px solid green"});
      }catch(e) {
        jq(this).css({border: "3px solid red"});			
      }
		
    });
    jq(document).on("click", ".zedbot_clear_scope", function(e){
      var e = jq(".selected_features");
      var field = e.data("zedbot_scope");
      e.removeClass("zedbot_"+field).removeData("zedbot_scope");
      var _scope =  jq(".selected_features").data("scope");
      delete  _scope["children"][field]["selector"];
      delete  _scope["children"][field]["features"];
      delete  _scope["children"][field]["options"]["regex"];
      jq(".zedbot_classifier").hide();
    })
    jq(document).on("click", ".zedbot_combine_scope", function(e){
      var field = e.data("zedbot_scope");
      //console.log(field);
      var _scope =  jq(".selected_features").data("scope");
      //console.log(jq(".selected_features").data("regex"));
      //console.log(_scope["children"][field]["options"]["regex"] = jq(".selected_features").data("regex"));
    });

    jq(document).on("mouseover", ".zedbot_set_scope", function(e){
		//console.log(jq(e.target).data('selector'));
		jq('.zedbot_active_selector').html(jq(e.target).data('selector'));
	});
    jq(document).on("click", ".zedbot_set_scope", function(e){
      var field = jq(e.target).text();
      //console.log(field);
      var node = jq(".selected_features")
			node.addClass("zedbot_"+field)
		  .attr("title", field)
          .data("zedbot_scope", field)
          .data("zedbot_spec", jq(e.target).data('spec'));
          
		var _scope = jq(e.target).data("scope");
		var selector = jq(e.target).data('selector');
        if(_scope["options"] && _scope["options"]["multiple"] == true) {
          var s = selector.lastIndexOf(":nth-child(");
          var v = selector.lastIndexOf(")");
          selector = selector.substr(0, s) + selector.substr(v+1, selector.length);
        }
        if(_scope["options"] && _scope["options"]["use_contains"] == true) {
          selector = selector.trim() + ":contains(" + jq(".selected_features").text().trim() + ")";
        }
        _scope["selector"] =  selector;
        _scope["features"] =  jq(".selected_features").data("features");
		if (jq(".selected_features").data("regex") != undefined) {
      if (_scope["options"] == undefined) {
        _scope["options"] = {};
      }
			_scope["options"]["regex"] =  jq(".selected_features").data("regex");
		}
        //_scope["expected_value"] =  jq(".selected_features").data("expected_value");
		if(_scope["options"] && _scope["options"]["textify"] != undefined) {
      	textifyNode(node, _scope["options"]["textify"]);
		}
		if(_scope["options"] && _scope["options"]["unflattenn"] != undefined) {
			unflattenNode(node, _scope["options"]["unflattenn"]);
		}
			
        jq(".zedbot_classifier").hide();
        
    });
    jq(document).on("click", ".zedbot_ignore_url,.zedbot_boost_url", function(e){
			var node = jq(".selected_features")
			var path = getPath(node[0]);

    var page = {
      site: site,
      template: specs.template,
      links: {}
    }
    var path_id = site + '_' + specs.template;
    page.links[path] = jq(e.target).attr('class') == 'zedbot_boost_url' ? 1: -100;

                
    jq.ajax({url:'https://crawler.zed.ee/zedbot_site/'+type+'/'+path_id+'/_update',  type:'POST', data:JSON.stringify({doc:page}), success:
      function(response){
        console.log(response);
      },error:
      function(response){
        console.log(response);
            jq.ajax({url:'https://crawler.zed.ee/zedbot_site/'+type+'/'+path_id+'',  type:'PUT', data:JSON.stringify(page), success:function(response){
              console.log(response);
            }
            });
      }
    });

    
			//specs.ignore_urls = jq.unique(specs.ignore_urls);
			jq(".zedbot_classifier").hide();
    });	
  }
/** hard work **/
function textifyNode(node, options) {
  //console.log("textifyNode",node)
 	if(jq(node).hasClass("zedbot_textified"))return;
  jq(node).contents()
      .filter(function(){return this.nodeType === 3})
      .wrap('<span class="zedbot_text" />')
  if(options.regex !== undefined) {
    jq(".zedbot_text", node).html(function(){
        var splits = this.innerHTML.match(new RegExp(options.regex));
        var result = '';
        if(splits !== null) {
          for(var i=1;i<splits.length;i++)
            result += '<span class="zedbot_subtext">'+splits[i]+'</span>';
        }
        //console.log("aaa", this, splits);
        return result;
        
    });
  }
	jq(node).addClass("zedbot_textified")
      
}
function unflattenNode(node, options) {

	if(jq(node).hasClass("zedbot_unflattened"))return;
  if(options.textify !== undefined) {
    textifyNode(node, options.textify);
  }
	var sub_obj = null;
	var split_nodes = jq(options.split, node);
	var collect_nodes = jq(options.collect, node);
    //console.log("unflattenNode",node, split_nodes, collect_nodes)
	var j = 0;
	//while (node.childNodes.length > 0 && j < split_nodes.length) {
	for(var k=0;k<collect_nodes.length;k++) {
		if(collect_nodes[k] == split_nodes[j]) {
			if(sub_obj != null) {
				sub_obj.appendTo(node);
			}
			sub_obj = node.nodeName == 'TABLE' ? jq("<tbody class='zedbot_unflattened_child'/>") :  jq("<div class='zedbot_unflattened_child'>");
			j++;
		}
		if(sub_obj != null) {
			jq(collect_nodes[k]).appendTo(sub_obj);
		}
		
	}
	if(sub_obj != null) {
		sub_obj.appendTo(node);
	}
	jq(node).addClass("zedbot_unflattened")

}
function unJsonNode(node, options) {

	if(jq(node).hasClass("zedbot_unflattened"))return;
	var sub_obj = null;
	var sub_obj2 = null;
  var re = /{([^}]+)}/g
  var re2 = /([a-z]+): "([^"]+)"/g
  var text = node.textContent;
  while (match = re.exec(text)) {
     sub_obj = jq("<div class='zedbot_unflattened_child'>");
     //console.log(match[0], match[1]);
    while (match2 = re2.exec(match[1])) {
      //console.log(match2[0], match2[1]);
     	sub_obj2 = jq("<div class='"+match2[1]+"'>"+match2[2]+"</div>");
        sub_obj2.appendTo(sub_obj);
    }
 		sub_obj.appendTo(node);
 }
  /*
	//while (node.childNodes.length > 0 && j < split_nodes.length) {
	for(var k=0;k<collect_nodes.length;k++) {
		if(collect_nodes[k] == split_nodes[j]) {
			if(sub_obj != null) {
				sub_obj.appendTo(node);
			}
			sub_obj = node.nodeName == 'TABLE' ? jq("<tbody class='zedbot_unflattened_child'/>") :  jq("<div class='zedbot_unflattened_child'>");
			j++;
		}
		if(sub_obj != null) {
			jq(collect_nodes[k]).appendTo(sub_obj);
		}
		
	}
  
	if(sub_obj != null) {
		sub_obj.appendTo(node);
	}
  */
	jq(node).addClass("zedbot_unflattened")

}
function processNode(node) {
	//var scopes = [[jq("body"), specs]];
	var parents = getAllParents(node.parentNode, 5);
	console.log("node", node, "parents", parents);
	var classifierEl = jq(".zedbot_classifier ul");
	classifierEl.html("");
	////console.log(parents.length);
  var scopes = [];
  var sub_specs = specs.children;
	for(var i = 0; i < parents.length; i++) {
		//classifierEl.append(jq("<li/>").append(jq('<a/>').text(parents[i].nodeName+' ' + jq(parents[i]).context.className)));
		var parent_scope = jq(parents[i]).data("zedbot_scope")
		//console.log('parent scope', parent_scope, sub_specs);
		if( parent_scope !== undefined) {
      ////console.log(scope["children"][jq(parents[i]).data("zedbot_scope")]);
			for(var k in sub_specs) {
        //console.log("k",k);
				if(k==parent_scope && sub_specs[k]["children"] != undefined) {
					scopes.push(parent_scope);
          sub_specs = sub_specs[k]["children"] ;
				}
			}
		}
	}
	//console.log("scopes", scopes);

	var features = []; //analyzeNodeWithParentsAndChildren(node);
	//var selector = generateSelector(node,'',1);
	
	//console.log(node);
	//console.log(jq(node));
	var li = jq("<li/>");
	//li.append(jq('<li/>').text(selector));	
	
	if(jq(node).data("zedbot_scope") == undefined && node.nodeName == "A") {
		classifierEl.append(jq('<li class="zedbot_ignore_url"/>').text("ignore this url"));	
		classifierEl.append(jq('<li class="zedbot_boost_url"/>').text("boost this url"));	
	}
	if(jq(node).data("zedbot_scope") !== undefined) {
		li.append(jq('<a class="zedbot_clear_scope"/>').text("[x]"));	
		li.append(jq('<a class="zedbot_combine_scope"/>').text("[c]"));	
	}
	classifierEl.append(li);
	classifierEl.append(jq("<li class='zedbot_active_selector'>-</li>"));
	var node_val = getNodeValue(node);
  if(jq(node).data("regex") !== undefined) {
    var match = node_val.match(new RegExp(jq(node).data("regex")));
    if(match != null) node_val = match[1];
  }
  
	classifierEl.append('<li>[' + truncate(node_val, 15,15,40)+']</li>');
	classifierEl.append(jq("<li>===========</li>"));
  printSpecs(specs.children, scopes, node, classifierEl, null);
	/*
	
	//console.log('children');
	var children = getAllChildren(node, 3);
	//console.log(children);
	classifierEl.append(jq("<li>-----------</li>"));
	for(var i = 0; i < children.length; i++) {
		classifierEl.append(jq("<li/>").append(jq('<a/>').text(children[i].nodeName+ ((children[i].nodeName[0]=="#")?'':(' ' + jq(children[i]).context.className)))));	
	}
	*/
	
  /*
  var selector = "";
  var cur_node = node;
  for(var i = parents.length-1; i >= 0; i--) {
    var parent = parents[i];
    if( jq(cur_node).data("zedbot_scope") !== undefined) break;
    if( cur_node.nodeName == 'body') break;
    selector = generateSelector(cur_node, parent) + " > " + selector;
    cur_node = parent;    
  }
  selector = selector.substr(0, selector.length - 3);
  */
	if(node.nodeName == "#text") {
		jq(node).wrap('<LABEL class="textme selected_features"/>')
	} else {
		jq(node).addClass("selected_features");
	}
	jq(".selected_features")
    .data("features", features)
    //.data("selector", selector)
    //.data("scope", scopes)
    //.data("expected_value", node_val)
  //console.log(jq(".selected_features"),jq(".selected_features").data("selector"))
};  
function printSpecs(specs, scopes, node, classifierEl, parent_scope){
  //console.log("printSpecs", specs, scopes, classifierEl);
  var scope = scopes.length > 0 ? scopes.shift() : null;
		classifierEl.append(jq("<li>-----------</li>"));
		for(var k in specs) {
		//if(specs[k]["selector"] == undefined) {
			var a = jq('<a/>').text(k);
      if (k!=scope /*specs[k]["selector"]*/) a.addClass('zedbot_set_scope');

			var multiple = specs[k]["options"] != undefined && specs[k]["options"]["multiple"] != undefined;
			
			var selector = generateSelector(node,'',1, multiple, parent_scope);
			//classifierEl.append(jq("<li class='test_selector'>"+selector+"</li>"));
			if(multiple) a.data("multiple", true);
			a.data("selector", selector);
			
			a.data("parent_scope", parent_scope);
			a.data("scope", specs[k]);
      var newEl = jq("<li/>");
      newEl.append(a);
      if (k == scope) {
        var childEl = jq("<ul/>");
        printSpecs(specs[k].children, scopes, node, childEl, k);
       // childEl.append(jq("<li>xxxxxxxxx</li>"));
        newEl.append(childEl);
        
      }
			classifierEl.append(newEl);	
      
		//}
	}

};
function countMismatches(specs, parent, product) {
        for(var x in specs["children"]) {
            if(specs["children"][x].required === true) {
              window.zedbot_rulecount++;
              if(specs["children"][x].children !== undefined){
                countMismatches(specs["children"][x]);
              }
            }
        }
}
function extractFieldBySelector(specs, parent, product) {
	//console.log("extractFieldBySelector",specs, parent, product);
      for(var x in specs["children"]) {
     // console.log("extractFieldBySelector, children",x);
       var node = null;
        if(specs["children"][x].selector !== undefined) {
          if(specs["children"][x].selector[0] == "'") {
            product[x] = specs["children"][x].selector.substr(1, specs["children"][x].selector.length-2);
            continue;
          }
          else if(specs["children"][x].selector[0] == "@") {
            var attr =specs["children"][x].selector.substr(1);
            var val = jq(parent).attr(attr);
            if(attr=="href"){
              val = jq("<a href='"+val+"'/>").get(0).href; // get full url
            }
            product[x] = val;
            continue;
          }
          else if(specs["children"][x].selector == ".") {
            //product[x] = jq(parent).text();
            //continue;
            node = jq("<span>"+jq(parent).text()+"</span>");
          }else{
            node = jq(specs["children"][x].selector, parent);
          }
		  
        } else if (specs["children"][x].itemprop !== undefined) {
          var items = jq("*[itemprop='"+specs["children"][x].itemprop+"']", parent);
          node = items;
          //console.log("itemprop", x, items);
        } else if (specs["children"][x].itemtype !== undefined) {
          var items = jq("[itemscope]:not([itemprop])", parent).filter(function(){
            return (this.getAttribute("itemtype").indexOf(specs["children"][x].itemtype) > -1);
          }); 
          if(items.length > 0) {
            node = items;
          }
			  }
        
            
       // console.log("node", node);
			

        
        if(true) {
            if(specs["children"][x].required === true) {
              window.zedbot_rulecount++;
            }
          
          if(node == null || node.length == 0) {
            console.log("no match for: ",x, specs["children"][x].selector, specs["children"][x].itemtype , specs["children"][x].itemprop)
            //if (specs["children"][x].required === true)
            //  specs["children"][x].false === true;
            if(specs["children"][x].required === true && specs["children"][x].children !== undefined){
              countMismatches(specs["children"][x]);
            }
            continue;
          }
          
          specs["children"][x].required = true;
          window.zedbot_matches ++;
          
          if(specs["children"][x].type !== undefined && specs["children"][x].children === undefined){
            //console.log("x");
            specs["children"][x].children = window.zedbot_specs.children.document.children[specs["children"][x].type].children;
            specs["children"][x].itemtype = window.zedbot_specs.children.document.children[specs["children"][x].type].itemtype;
          }
          var options = specs["children"][x]["options"];
          if(options == undefined) options = {};

          if(options.textify !== undefined) {
            textifyNode(node, specs["children"][x].options.textify);
          }
          if(options.unflatten !== undefined) {
              if(options.unflatten.target !== undefined) {
                unflattenNode(jq(options.unflatten.target, node[0]), specs["children"][x].options.unflatten);
              } else {
                unflattenNode(node[0], specs["children"][x].options.unflatten);
                
                var nodes = jq(specs["children"][x].selector + " .zedbot_unflattened_child", parent);
                if(nodes.length > 0) {
                  node = nodes;
                }
              }
          }
          if(options.unjsonify !== undefined) {
            unJsonNode(node[0]);
            var nodes = jq(specs["children"][x].selector + " .zedbot_unflattened_child", parent);
            if(nodes.length > 0) {
              node = nodes;
            }            
          }
          //console.log("zedbot_scope", node, x);
          node.addClass('zedbot_'+x).data("zedbot_scope", x);
		  
          if(specs["children"][x].options != undefined && specs["children"][x].options.regex !== undefined) {
            node.data("regex", specs["children"][x].options.regex);
          }
		  
          ////console.log(x, specs, node)
          /*
          var match = -1;
            for (var i =0; i <node.length; i++) {
              var node_val = getNodeValue(node[i]);
              matches.push(node_val);
              if(node_val == specs["children"][x].expected_value) {
                match = i;
              }
            }
          */
          var match = 0;
          ////console.log(x,match, (match > -1));
          if (match > -1) {
            if(specs["children"][x].children !== undefined){
              if(options.multiple === true) {
                product[x] = [];
                var first = options.skip_first == true ? 1 : 0;
                var last = options.skip_last == true ? 1 : 0;
                for (var i = first; i < node.length-last; i++) {
                  product[x].push({});
                  extractFieldBySelector(specs["children"][x], jq(node[i]), product[x][i-first]);
                 // if(Object.keys(product[x][i]).length ==0){
                  //  product[x][i] = getNodeValue(node[i], options);
                 // }
                }
              } else  {
                product[x] = {};
                extractFieldBySelector(specs["children"][x], node, product[x]);
                // extract parent if children not found
                //if(Object.keys(product[x]).length == 0){
                //  product[x] = getNodeValue(node[match], options);
                //}
              }
            } else {
              if (options.multiple) {
                product[x] = [];
                var first = options.skip_first == true ? 1 : 0;
                var last = options.skip_last == true ? 1 : 0;
                for (var i = first; i <node.length-last; i++) {
                  product[x].push(getNodeValue(node[i], options));
                }
              } else {
                product[x] = getNodeValue(node[match], options);
              }
            }
          }
        }
      
      }
  }  
	function getPrefix(type, form) {
		var prefix = '';
		if(type != 'node') prefix = type + '_';
		if(form =='is')	prefix = prefix + ((type == 'node') ? 'is_' : 'has_');
		else if(form !='')	prefix = prefix + form;
		return prefix;
	}
	function analyzeNode(node, type) {
	    var features = [];
		////console.log(node);
 		////console.log(is_parent);
        features.push(getPrefix(type, 'is')+node.nodeName);
		if(node.nodeName == "#text") {
			if(node.data.length < 100) {
				var text = node.data.replace(/\s/g, '');
				if((new RegExp(/^\d+jq/)).test(text)) {
					features.push(getPrefix(type, '')+"datatype_is_numeric");
				}
				if((new RegExp(/^[\d€.,]{2,10}jq/)).test(text)) {
					features.push(getPrefix(type, '')+"datatype_is_money");
				}
				if((new RegExp(/^[A-Z]+jq/)).test(text)) {
					features.push(getPrefix(type, '')+"datatype_is_latin_text");
				}
				if((new RegExp(/[A-Z]/)).test(text) && (new RegExp(/\d/)).test(text)) {
					features.push(getPrefix(type, '')+"datatype_is_latin_text_with_numbers");
				}
				features.push(getPrefix(type, 'contains_')+text);
				features.push(getPrefix(type, 'text_length_is_')+text.length);
				if(text.length < 10) {
					features.push(getPrefix(type, 'text_length_is_less_than_10'));
				} else if(text.length < 100) {
					features.push(getPrefix(type, 'text_length_is_less_than_100'));
				} else if(text.length < 1000) {
					features.push(getPrefix(type, 'text_length_is_less_than_1000'));
				} else {
					features.push(getPrefix(type, 'text_length_is_more_than_1000'));
				}
				var text_tokens = node.data.split(/\s/);
				for(var k in text_tokens){
					features.push(getPrefix(type, 'contains_token_')+text_tokens[k]);
				}
			}
			return features;
		} else if(node.nodeName[0] == "#") {
			return [];
		}
        for(var i =0;i< node.attributes.length;i++) {
			var attr = node.attributes[i];
		
            features.push(getPrefix(type, '')+node.nodeName+'_has_attr_'+attr.name);
            features.push(getPrefix(type, '')+'has_attr_'+attr.name);
            //var_dump(jqattr);
            if(attr.name == 'class') {
                var classes =  attr.value.split(' ');
                for(var j=0;j<classes.length; j++) {
					var _class = classes[j];
					if((new RegExp(/^zedbot_/)).test(_class)) continue;
					//if(_class = "textme") continue;
                    features.push(getPrefix(type, '')+node.nodeName+'_has_class_'+_class);
                    features.push(getPrefix(type, '')+'has_class_'+_class);
					_class = _class.replace(/([A-Z])/g, ' jq1');
					var class_tokens = _class.split(/[-_ ]/);
					for(var k in class_tokens) {
						features.push(getPrefix(type, '')+'has_class_token_'+class_tokens[k]);
					}
                }
            }
            if(jq.inArray(attr.name, ['src', 'href'])>=0) {
                ////console.log(attr.name +'->' + attr.value);
            }
            if(jq.inArray(attr.name, ['itemprop', 'itemtype','rel','id'])>=0) {
               // //console.log(attr.name +'=>' + attr.value);
                features.push(getPrefix(type, '')+'has_'+attr.name+'_'+attr.value);
            }
        }
		////console.log(features);
        return features;
	}
	
	function analyzeNodeWithParentsAndChildren(node) {
		var parents = getAllParents(node.parentNode, 3);
		
	    var features = [];
	    if(node == null) {
			;
	    } else if(node.nodeName == "#text") {
	        ////console.log( "->".trim(node.data));
		}
        features = analyzeNode(node, 'node');
	    for(var i = parents.length-1; i >= 0; i--) {
        var parent = parents[i];
        ////console.log(jq(parent).data("zedbot_scope"));
        if( jq(parent).data("zedbot_scope") !== undefined) break;
        ////console.log(jq(parent).data("zedbot_scope"));
       if(jq.inArray(parent.nodeName, ["#document", "html"])>=0) break;
        parent_features = analyzeNode(parent, 'parent');
        features = jq.merge(features, parent_features);
        
        var children = getAllChildren(parent, 3);		
        ////console.log(children);
        if(children != null) {
          for(var j =0;j< children.length;j++) {
            ////console.log(1, children[j],parents[i+1]);
            if(children[j] == parents[i+1]) continue;
            var child = children[j];
            child_features = analyzeNode(child, 'parents_child');
            features = jq.merge(features, child_features);
          }
        }
	    }
	    ////console.log( '% '+(jq.unique(features)).join(' '));
		return jq.unique(features);
	}
	
	function getAllParents(node, depth) {
		////console.log(node.parentNode);
		if(!node.parentNode /*|| depth == 0*/) return null;
		if(node.className == "textme") return [node.parentNode]; 
		var parents = getAllParents(node.parentNode, depth - 1);
		if(!parents) return [node.parentNode.documentElement];

		parents.push(node);
		return parents;
	}
	function getAllChildren(node, depth) {
		////console.log(node.parentNode);
		if(!node.hasChildNodes() || depth == 0) return null;
		var all_children = [];
		for(var i=0;i<node.childNodes.length;i++) {
			all_children.push(node.childNodes[i]);
			var children = getAllChildren(node.childNodes[i], depth - 1);
			if(children == null) continue;
			for(var j=0;j<children.length;j++) {
				all_children.push(children[j]);
			}
		}
		
		//if(!parents) return [node.parentNode];
		//children.push(node);
		return all_children;
	}
	function getNodeValueSimple(node) {
		if(node.nodeName == "#text") {
			return node.data;
		} else if(node.hasAttribute("content")) {
			return jq(node).attr("content");
		} else if(node.nodeName == "IMG") {
			var src =  jq(node).attr("src");
			return jq("<a href='"+src+"'/>").get(0).href; // get full url
		} else if(node.nodeName == "A") {
			var href = jq(node).get(0).href;
			href = jq("<a href='"+href+"'/>").get(0).href; // get full url
			if(specs.session_name != undefined) {
				//console.log(">>>>>>>", specs.session_name, "/&"+specs.session_name+"=[^&]+/gmi")
				href = href.replace(new RegExp("&abcantenn=[^&]+"), "");
				//console.log(href);
			}
			return href;
		} else if(node.nodeName == "LINK") {
			return jq(node).attr("href");
		} else {
			return jq(node).html().trim();
		}
	}
	function getNodeValue(node, options) {
		if (options == undefined) options = {};
		var val = null;
		if(options.use_content !== undefined) {	
			val = jq(node).text().trim();
		} else if (options.use_attribute !== undefined) {	
			val = jq(node).attr(options.use_attribute);
		} else if (options.value !== undefined) {	
            val = options.value;
		} else {
			val = getNodeValueSimple(node);
		}
		
		if(options.regex !== undefined) {
			var patt = new RegExp(options.regex,"gm");
			try {
				val =  patt.exec(val)[1];
			} catch(e){
				//console.log("Regex "+options.regex+" does not match " + val);
				val = null;
			};
		}
		if(options.allowed_tags !== undefined) {	
      //console.log("zzzzzzzz", jq(options.allowed_tags, node));
			val = jq(options.allowed_tags, node).html().trim();
		}
		if(options.replace !== undefined) {	
			val = val.replace(options.replace[0], options.replace[1]);
		}
		if(options.map !== undefined) {	
      console.log("["+val+"]");
      if(val in options.map)
        val = options.map[val];
      else if("" in options.map)
        val = options.map[""];
		}
		if(options.format !== undefined) {	
			val = options.format.replace("[value]", val);
		}
		
		if(options.normalize_url !== undefined) {	
			val = jq("<a href='"+val+"'/>").get(0).href;
		}
		
		return val;
		
	}
	
  function generateSelector(node, childSelector, itemCount, multiple, _parent) {
  
    var parent = node.parentNode;    
    var selector = null

    if( typeof jq(node).data("zedbot_scope") !== 'undefined') {
      return childSelector;
    }
	    if (node == _parent || parent == document) return childSelector;
/*
	if(selector == null && childSelector.length > 0 && childSelector[0] != '>') {
		// no need for parent
		var _selector = childSelector;
		if ( jq(_selector, parent).length == 1)  {
			return generateSelector(parent, childSelector, itemCount);;
		}
	}
*/	
    /*
    if(selector == null) {
      var _selector = '>' + node.nodeName + ' ' + childSelector;
	  //console.log(jq(_selector, parent));
	  var l = jq(_selector, parent).length;
      if (l == 1)  {
        selector = _selector;
      }
    }
    */
    
     if(selector == null && node.id != "" && node.id.match(/[0-9]/) == null) {
      var _selector = '>' + node.nodeName + '#'+node.id+' ' + childSelector;
	  //console.log(jq(_selector, parent));
	  var l = jq(_selector, parent).length;
      if (l == itemCount)  {
        selector = _selector;
      }
    }
   
    if(selector == null) {
      // try classname
      if(node.classList.length > 0) {
        for(var j=0; j<node.classList.length;j++) { 
          var _selector = '>' + node.nodeName + '.'+node.classList[j] + ' ' + childSelector;
          if (jq(_selector, parent).length == itemCount) {
            selector =  _selector;
          }
        }
      }
      
      if(selector == null) {
        // try attributes
        var attributes = ['itemtype','itemprop','rel','data'];
        for (var k=0; k<attributes.length;k++) {
			if(node.hasAttribute(k)){
				var _selector = ' > ' + node.nodeName + '['+attributes[k]+'="'+node.getAttribute(k)+'"]' + ' ' + childSelector;
				//console.log(_selector);
				if (jq(_selector, parent).length == itemCount) {
				  selector =  _selector;
				  break;
				}
			}
        }
      }
     if(selector == null) {
      var _selector = ' > ' + node.nodeName + ' ' + childSelector;
	  //console.log(jq(_selector, parent));
	  var l = jq(_selector, parent).length;
      if (l == itemCount)  {
        selector = _selector;
      }
    }
     
      if(selector == null) {
        // try attributes with values
        //...
      }      
      // try regex
      if(selector == null && jq(node).data("regex") != undefined) {
        var fixed_part = jq(node).data("regex").replace("(.*)",""); // TODO: fix (.*)
        var _selector = '>' + node.nodeName + ":contains('"+fixed_part+"')" + ' ' + childSelector;
          if (jq(_selector, parent).length == itemCount) {
            selector = _selector;
          }
      }
      if(selector == null) {
        // try node index
        var nodeIndex = -1;
        var nodes = jq('>'+node.nodeName, parent);
        //console.log("x", nodes);
        for(var k=0;k< nodes.length;k++) {
          if(nodes[k] == node){
            nodeIndex = k;
          }
        }
        if(nodeIndex > -1) {
          // special case first - data in two column
          if(node.nodeName == 'TD' && nodeIndex == 1 && jq(node.parentNode).data('zedbot-scope') == undefined) {
            field = jq("td:first", parent).text().trim();
            if(field.length < 200) {
              selector = '>' + "TR:contains("+field+") > TD:nth-child(2)" + ' ' + childSelector;
              parent = node.parentNode.parentNode;
            }
          }
          if(selector == null && nodes.length > 1) {
            var m = nodeIndex+1;
            var multiple = false;
            for(var k=0;k< nodes.length;k++) {
              if (k==nodeIndex) continue;
              //console.log("multiple", k, nodeIndex, nodes[k], jq(childSelector, nodes[k]).length);
              var sibling_matches = jq(childSelector, nodes[k]).length;
              if (sibling_matches > 0) {
                  multiple = true;
                  itemCount += sibling_matches;
              }
            }
            //console.log("multiple",multiple);
            if (multiple)
              selector = '>' + node.nodeName + ' ' + childSelector;
            else
              selector = '>' + node.nodeName + ":nth-child("+m+")" + ' ' + childSelector;
            
          }
          if(selector == null){
            throw node;
          }
        }
      }
    }
	//console.log("selector", selector);
	return generateSelector(parent, selector, itemCount, multiple, _parent);

  }

  function truncate(text, startChars, endChars, maxLength) {
      if (text.length > maxLength) {
          var start = text.substring(0, startChars);
          var end = text.substring(text.length - endChars, text.length);
          return start + '...' + end;
      }
      return text;
  }
  /*
  function getPath(el) {
    var path = "";
    while(el != document){
      //var parent = el.parentNode;
      var selector = el.tagName;
      if(el.id !== "")
        selector += '#'+el.id;
      if(el.hasAttribute("class"))
        selector +='.'+el.className.trim().replace(/ +/g, '.');
      path = '>' + selector + path;
      el = el.parentNode;
    }
    return path.substr(1);
  }
  */
  function getPath(el) {
	var path = "";
	while(el != document){
		//var parent = el.parentNode;
    path = '_' + el.tagName + path;
		el = el.parentNode;
	}
	return path;
}
function clusterLinks(specs){
  var clusters = [];
  var clusters2 = [];
  var links = document.querySelectorAll("a");
  for(var i=0;i < links.length; i++){
    //clusters.push(getPath(links[i]));    
    var path = getPath(links[i]);
    var href = jq(links[i]).attr("href");
    if(href === undefined) continue;
    if(!(path in clusters)) clusters[path] = [];
    clusters[path].push(href); // for template

    if(href.match(/#/)) continue;
    href = jq("<a href='"+href+"'/>").get(0).href;
    //console.log(window.location.protocol+"//"+window.location.host, href);
    if(href.indexOf(window.location.protocol+"//"+window.location.host) != 0) continue;
    if(!(path in clusters2)) clusters2[path] = [];
    var title = links[i].textContent;
    if(title.length > 100) title = '';
    clusters2[path].push({href: href, title:title}); // for full urls
  }
  var template = '';
  var paths = Object.keys(clusters);
  console.log(paths);
  for(var k=0;k<paths.length;k++){
 //   console.log("path", paths[k]);
    if(clusters[paths[k]].length > 1)
      template = template+ (paths[k].match(/_/g) || []).length.toString();
  }
  console.log("page template", template);
  return [template, clusters2];
}
  var MD5=new function(){function r(r){return u(a(o(r),8*r.length))}function n(r){try{}catch(n){A=0}for(var t,e=A?"0123456789ABCDEF":"0123456789abcdef",o="",u=0;u<r.length;u++)t=r.charCodeAt(u),o+=e.charAt(t>>>4&15)+e.charAt(15&t);return o}function t(r){try{}catch(n){v=""}for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e="",o=r.length,u=0;o>u;u+=3)for(var a=r.charCodeAt(u)<<16|(o>u+1?r.charCodeAt(u+1)<<8:0)|(o>u+2?r.charCodeAt(u+2):0),c=0;4>c;c++)e+=8*u+6*c>8*r.length?v:t.charAt(a>>>6*(3-c)&63);return e}function e(r){for(var n,t,e="",o=-1;++o<r.length;)n=r.charCodeAt(o),t=o+1<r.length?r.charCodeAt(o+1):0,n>=55296&&56319>=n&&t>=56320&&57343>=t&&(n=65536+((1023&n)<<10)+(1023&t),o++),127>=n?e+=String.fromCharCode(n):2047>=n?e+=String.fromCharCode(192|n>>>6&31,128|63&n):65535>=n?e+=String.fromCharCode(224|n>>>12&15,128|n>>>6&63,128|63&n):2097151>=n&&(e+=String.fromCharCode(240|n>>>18&7,128|n>>>12&63,128|n>>>6&63,128|63&n));return e}function o(r){for(var n=Array(r.length>>2),t=0;t<n.length;t++)n[t]=0;for(var t=0;t<8*r.length;t+=8)n[t>>5]|=(255&r.charCodeAt(t/8))<<t%32;return n}function u(r){for(var n="",t=0;t<32*r.length;t+=8)n+=String.fromCharCode(r[t>>5]>>>t%32&255);return n}function a(r,n){r[n>>5]|=128<<n%32,r[(n+64>>>9<<4)+14]=n;for(var t=1732584193,e=-271733879,o=-1732584194,u=271733878,a=0;a<r.length;a+=16){var c=t,d=e,A=o,v=u;t=f(t,e,o,u,r[a+0],7,-680876936),u=f(u,t,e,o,r[a+1],12,-389564586),o=f(o,u,t,e,r[a+2],17,606105819),e=f(e,o,u,t,r[a+3],22,-1044525330),t=f(t,e,o,u,r[a+4],7,-176418897),u=f(u,t,e,o,r[a+5],12,1200080426),o=f(o,u,t,e,r[a+6],17,-1473231341),e=f(e,o,u,t,r[a+7],22,-45705983),t=f(t,e,o,u,r[a+8],7,1770035416),u=f(u,t,e,o,r[a+9],12,-1958414417),o=f(o,u,t,e,r[a+10],17,-42063),e=f(e,o,u,t,r[a+11],22,-1990404162),t=f(t,e,o,u,r[a+12],7,1804603682),u=f(u,t,e,o,r[a+13],12,-40341101),o=f(o,u,t,e,r[a+14],17,-1502002290),e=f(e,o,u,t,r[a+15],22,1236535329),t=h(t,e,o,u,r[a+1],5,-165796510),u=h(u,t,e,o,r[a+6],9,-1069501632),o=h(o,u,t,e,r[a+11],14,643717713),e=h(e,o,u,t,r[a+0],20,-373897302),t=h(t,e,o,u,r[a+5],5,-701558691),u=h(u,t,e,o,r[a+10],9,38016083),o=h(o,u,t,e,r[a+15],14,-660478335),e=h(e,o,u,t,r[a+4],20,-405537848),t=h(t,e,o,u,r[a+9],5,568446438),u=h(u,t,e,o,r[a+14],9,-1019803690),o=h(o,u,t,e,r[a+3],14,-187363961),e=h(e,o,u,t,r[a+8],20,1163531501),t=h(t,e,o,u,r[a+13],5,-1444681467),u=h(u,t,e,o,r[a+2],9,-51403784),o=h(o,u,t,e,r[a+7],14,1735328473),e=h(e,o,u,t,r[a+12],20,-1926607734),t=i(t,e,o,u,r[a+5],4,-378558),u=i(u,t,e,o,r[a+8],11,-2022574463),o=i(o,u,t,e,r[a+11],16,1839030562),e=i(e,o,u,t,r[a+14],23,-35309556),t=i(t,e,o,u,r[a+1],4,-1530992060),u=i(u,t,e,o,r[a+4],11,1272893353),o=i(o,u,t,e,r[a+7],16,-155497632),e=i(e,o,u,t,r[a+10],23,-1094730640),t=i(t,e,o,u,r[a+13],4,681279174),u=i(u,t,e,o,r[a+0],11,-358537222),o=i(o,u,t,e,r[a+3],16,-722521979),e=i(e,o,u,t,r[a+6],23,76029189),t=i(t,e,o,u,r[a+9],4,-640364487),u=i(u,t,e,o,r[a+12],11,-421815835),o=i(o,u,t,e,r[a+15],16,530742520),e=i(e,o,u,t,r[a+2],23,-995338651),t=C(t,e,o,u,r[a+0],6,-198630844),u=C(u,t,e,o,r[a+7],10,1126891415),o=C(o,u,t,e,r[a+14],15,-1416354905),e=C(e,o,u,t,r[a+5],21,-57434055),t=C(t,e,o,u,r[a+12],6,1700485571),u=C(u,t,e,o,r[a+3],10,-1894986606),o=C(o,u,t,e,r[a+10],15,-1051523),e=C(e,o,u,t,r[a+1],21,-2054922799),t=C(t,e,o,u,r[a+8],6,1873313359),u=C(u,t,e,o,r[a+15],10,-30611744),o=C(o,u,t,e,r[a+6],15,-1560198380),e=C(e,o,u,t,r[a+13],21,1309151649),t=C(t,e,o,u,r[a+4],6,-145523070),u=C(u,t,e,o,r[a+11],10,-1120210379),o=C(o,u,t,e,r[a+2],15,718787259),e=C(e,o,u,t,r[a+9],21,-343485551),t=g(t,c),e=g(e,d),o=g(o,A),u=g(u,v)}return Array(t,e,o,u)}function c(r,n,t,e,o,u){return g(d(g(g(n,r),g(e,u)),o),t)}function f(r,n,t,e,o,u,a){return c(n&t|~n&e,r,n,o,u,a)}function h(r,n,t,e,o,u,a){return c(n&e|t&~e,r,n,o,u,a)}function i(r,n,t,e,o,u,a){return c(n^t^e,r,n,o,u,a)}function C(r,n,t,e,o,u,a){return c(t^(n|~e),r,n,o,u,a)}function g(r,n){var t=(65535&r)+(65535&n),e=(r>>16)+(n>>16)+(t>>16);return e<<16|65535&t}function d(r,n){return r<<n|r>>>32-n}var A=0,v="";this.hex_md5=function(t){return n(r(e(t)))},this.b64_md5=function(n){return t(r(e(n)))}};

}

if(document.getElementById("zedbot_scraper") != undefined) {
  var conf = document.getElementById("zedbot_scraper");
	zedBot.init(conf.getAttribute("data-mode"), conf.getAttribute("data-dataset"), conf.getAttribute("data-endpoint"));
}


