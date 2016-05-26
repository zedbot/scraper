function zedbot_loadspecs(jq, baseurl, callback){

  jq.when(
    // list of arguments to "when" funcion
    jq.getJSON(baseurl + "product.json?"+new Date().getTime()),
    jq.getJSON(baseurl + "offer.json?"+new Date().getTime()),
    jq.getJSON(baseurl + "breadcrumb.json?"+new Date().getTime()),
    jq.getJSON(baseurl + "rating.json?"+new Date().getTime()),
    jq.getJSON(baseurl + "review.json?"+new Date().getTime()),
    jq.getJSON(baseurl + "breadcrumbs.json?"+new Date().getTime()),
    jq.getJSON(baseurl + "localbusiness.json?"+new Date().getTime()),
    jq.getJSON(baseurl + "language.json?"+new Date().getTime()),
    jq.getJSON(baseurl + "store.json?"+new Date().getTime())

  ).then(function(product, offer, breadcrumb, rating, review, breadcrumbs, localbusiness,language, store) {
    console.log("load specs 3");
    zedbot_specs = {children:{document:{selector:"html", children:{}}}};
    zedbot_specs.children.document.children = {};
    zedbot_specs.children.document.children.product = product[0];
    zedbot_specs.children.document.children.offer = offer[0];
    zedbot_specs.children.document.children.breadcrumb = breadcrumb[0];
    zedbot_specs.children.document.children.rating = rating[0];
    zedbot_specs.children.document.children.review = review[0];
    zedbot_specs.children.document.children.localbusiness = localbusiness[0];
    zedbot_specs.children.document.children.breadcrumbs = breadcrumbs[0];
    zedbot_specs.children.document.children.language = language[0];
    zedbot_specs.children.document.children.store = store[0];
   callback(zedbot_specs);
  }, function(doc, code , error) {
	  console.log("load specs failed", doc, code, error)
  }
  
  );
};

