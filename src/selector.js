var generateSelector =   function(node, childSelector, itemCount, multiple, _parent) {
  
var jq = require('jquery');

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

module.exports = generateSelector;