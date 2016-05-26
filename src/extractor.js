var extractFieldBySelector = function(specs, parent, product) {
	var utils = require("./dom_utils.js");

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
var jq = require('jquery');
	//console.log("extractFieldBySelector",specs, parent, product);
      for(var x in specs["children"]) {
      console.log("extractFieldBySelector, children",x);
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
            if(val !== undefined) {
              product[x] = utils.getNodeValue(val, specs["children"][x].options);
            }
            if(specs["children"][x].required === true) {
              window.zedbot_rulecount++;
            }            
            continue;
          }
          else if(specs["children"][x].selector == ".") {
            //product[x] = jq(parent).text();
            //continue;
            node = jq("<span>"+jq(parent).text()+"</span>");
          }else{
			  console.log("try: ", specs["children"][x].selector);
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
            //if (specs["children"][x].required === true)
            //  specs["children"][x].false === true;
            if(specs["children"][x].required === true && specs["children"][x].children !== undefined){
              console.log("no match for: ",x, specs["children"][x].selector, "micordata:", specs["children"][x].itemtype , specs["children"][x].itemprop)
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
			  console.log("textify", options, options.textify.index !== undefined);
            textifyNode(node, options.textify);
			if("index" in options){
				console.log("texify", specs["children"][x].selector + " .zedbot_text:nth-child("+options.index+")");
				 node = jq(specs["children"][x].selector + " .zedbot_text:nth-child("+options.index+")", parent);
			}
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
                  product[x].push(utils.getNodeValue(node[i], options));
                }
              } else {
                product[x] = utils.getNodeValue(node[match], options);
              }
            }
          }
        }
      
      }
  }  
  
  
module.exports = extractFieldBySelector;