//result Model
var resultmodel = [ {
	columnName : 'productname',
	dataType : 'text'
},{
	columnName : 'category',
	dataType : 'text'
},{
	columnName : 'purchaseurl',
	dataType : 'url'
},{
	columnName : 'seller',
	dataType : 'url'
},{
	columnName : 'keywords',
	dataType : 'text'
},{
	columnName : 'brand',
	dataType : 'text'
},{
	columnName : 'image',
	dataType : 'image'
}];
//facet model 
var facetmodel = [ {
	columnName : 'facetname',
	dataType : 'text'
},{
	columnName : 'facetcount',
	dataType : 'text'
},{
	columnName : 'facetquery',
	dataType : 'text'
}];


/*function updateResults(qry) {
	resultsgrid = new ResultRenderer({
		mainContainer : 'container',
		facet : true,
		resultModel : resultmodel,
		facetModel : facetmodel,
		pagination : true,
		url : "/PremierBazar/rest/search/json/",
		perPageOptions : [ 10, 20, 50, 100, 200 ],
		perPage : 10,
		page : 1,
		showHeader : true,
		sortHeader : true,
		resizeColumns : true,
		datawidth : "90%",
		height : "70%",
		alternaterows : true,
		facetwidth : "90%",
		query : qry
	});
}*/