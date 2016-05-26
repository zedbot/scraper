  var loadUI = function(jq, specs) {
	  
	var utils = require("./dom_utils.js");
	var generateSelector = require("./selector.js");
	console.log(utils);
	
function processNode(node) {
	//var scopes = [[jq("body"), specs]];
	var parents = utils.getAllParents(node.parentNode, 5);
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
	var node_val = utils.getNodeValue(node);
  if(jq(node).data("regex") !== undefined) {
    var match = node_val.match(new RegExp(jq(node).data("regex")));
    if(match != null) node_val = match[1];
  }
  
	classifierEl.append('<li>[' + utils.truncate(node_val, 15,15,40)+']</li>');
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


	  
  var lastNode = null;
  var lastNodeSelected = null;
  
    //console.log('zedBot loaded' );

    jq("<div/>")
	.append(jq("<div/>")
      .addClass('zedbot_parser')
	  /*
	  .append(jq("<span>Crawling: </span>"))
	  .append(jq("<input type='checkbox' "+(specs.enabled == true ? 'checked=checked':'')+"'; class='toggle-soft' name='zedbot_enabled'/>").change(function(){
			var exists = specs.enabled != null;
			specs.enabled = this.checked;
			saveScript();
		}))
	  .append(jq("<br>"))
	  */
//      .append(jq("<span>url:</span><span class='zedbot_url'>"+document.location.pathname+"</span><br/>"))
//      .append(jq("<span>url:</span><span class='zedbot_url_match'>"+specs.url_match+"</span><br/>"))
      //.append(jq("<span>Language:</span>"))
	  //.append(jq("<select>").append("<option>et<option>en<option>ru").change(function(){  
	  //}))
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
	  /*
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
	  */
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
    
			//specs.ignore_urls = jq.unique(specs.ignore_urls);
			jq(".zedbot_classifier").hide();
    });	
  }
  
 module.exports = loadUI