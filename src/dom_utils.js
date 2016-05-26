var jq = require('jquery');

var DomUtils = {
	getAllParents: function(node, depth) {
		////console.log(node.parentNode);
		if(!node.parentNode /*|| depth == 0*/) return null;
		if(node.className == "textme") return [node.parentNode]; 
		var parents = DomUtils.getAllParents(node.parentNode, depth - 1);
		if(!parents) return [node.parentNode.documentElement];

		parents.push(node);
		return parents;
	},

	getAllChildren: function(node, depth) {
		////console.log(node.parentNode);
		if(!node.hasChildNodes() || depth == 0) return null;
		var all_children = [];
		for(var i=0;i<node.childNodes.length;i++) {
			all_children.push(node.childNodes[i]);
			var children = this.getAllChildren(node.childNodes[i], depth - 1);
			if(children == null) continue;
			for(var j=0;j<children.length;j++) {
				all_children.push(children[j]);
			}
		}
		
		//if(!parents) return [node.parentNode];
		//children.push(node);
		return all_children;
	},
	getNodeValueSimple: function(node) {
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
	},
	
	getNodeValue: function(node, options) {
		if (options == undefined) options = {};
		var val = null;
		if(typeof node == typeof "") {
		  val = node
		} else if(options.use_content !== undefined) {	
			val = jq(node).text().trim();
		} else if (options.use_attribute !== undefined) {	
			val = jq(node).attr(options.use_attribute);
		} else if (options.value !== undefined) {	
            val = options.value;
		} else {
			val = this.getNodeValueSimple(node);
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
		
	},
	
	truncate: function(text, startChars, endChars, maxLength) {
      if (text.length > maxLength) {
          var start = text.substring(0, startChars);
          var end = text.substring(text.length - endChars, text.length);
          return start + '...' + end;
      }
      return text;
  }
}
module.exports = DomUtils;