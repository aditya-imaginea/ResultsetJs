var resultrenderer = new Class({
    Implements: [Events, Options],
    getOptions: function () {
        return {
            // TODO: set default for options here
            facet: true,
            pagination: false,
            url: null,
            pagination: false,
            page: 1,
            perPageOptions: [10, 20, 50, 100, 200],
            perPage: 10,
            filterInput: false
        };
    },

    initialize: function (options) {
        this.setOptions(this.getOptions(), options);
        this.drawGrid();
        this.loadData();
    },

    drawGrid: function () {
        this.container = $(this.options.mainContainer);
        this.removeAll(this.container);
        this.container.addClass('resultrenderer');
        this.drawResultGrid();
        if (this.options.facet) this.drawFacetGrid();
    },
    // ************* Draw the result grid *************************
    // expects that there is resultGrid div on the page
    drawResultGrid: function () {
        // add the results grid
        var resultsDiv = new Element('div');
        resultsDiv.addClass('resultgrid');
        this.container.appendChild(resultsDiv);
        this.container.resultgrid = resultsDiv;

    },
    // ************* Draw the facet grid *************************
    drawFacetGrid: function () {
        // add the results grid
        var facetsDiv = new Element('div');
        facetsDiv.addClass('facetgrid');
        this.container.appendChild(facetsDiv);
        this.container.facetgrid = facetsDiv;

    },

    // ************* load data *************************
    loadData: function () {
        if (!this.options.url) return;
        var param = {
            query: this.options.query,
            page: this.options.page,
            perpage: this.options.perPage
        };

        var url = (url != null) ? url : this.options.url;
        var request = new Request.JSON({
            url: url,
            data: param
        });

        request.addEvent("complete", this.onLoadResultData.bind(this));
        if (this.options.facet) request.addEvent("complete", this.onLoadFacetData.bind(this));
        request.get();
    },

    onLoadResultData: function (data) {
        this.removeAll(this.container["resultgrid"]);
        results = data.resultlist.result;
        var size = results ? results.length : 0;
        for (var i = 0; i < size; i++) {
            this.appendResult(results[i]);
        }
        this.addPagination(this.container["resultgrid"]);
        this.loadPaginationData(data.pagination);
    },

    onLoadFacetData: function (data) {
        this.removeAll(this.container["facetgrid"]);
        facets = data.resultlist.facet;
        var size = facets ? facets.length : 0;
        for (var i = 0; i < size; i++) {
            this.appendFacet(facets[i]);
        }

    },
    appendResult: function (result) {
        var resultModel = this.options.resultmodel;
        var resultDiv = new Element('div');
        resultDiv.addClass('resultDiv');
        this.generateChildren(resultModel, result, resultDiv);
        this.container["resultgrid"].appendChild(resultDiv);
    },
    appendFacet: function (facet) {
        var facetModel = this.options.facetmodel;
        var facetDiv = new Element('div');
        facetDiv.addClass('facetDiv');
        this.generateChildren(facetModel, facet, facetDiv);
        this.container["facetgrid"].appendChild(facetDiv);

    },
    generateChildren: function (model, data, parent) {
        var columnCount = model ? model.length : 0;

        var contentDiv = new Element('div');
        contentDiv.addClass('contentDiv');

        var imageDiv = new Element('div');
        imageDiv.addClass('imageDiv');

        var child;
        for (var c = 0; c < columnCount; c++) {
            var column = model[c];
            if (column.dataType == 'text') {
                child = new Element('div');
                child.addClass("text");
                child.innerHTML = column.columnName + ": " + data[column.columnName] + "<br>";
                contentDiv.appendChild(child);
            } else if (column.dataType == 'url') {
                child = new Element('a', {
                    href: data[column.columnName],
                        'class': 'url'
                });
                contentDiv.appendChild(child);
            } else if (column.dataType == 'image') {
                child = new Element('img');
                child.addClass("image");
                child.src = data[column.columnName];
                imageDiv.appendChild(child);

            } else {
                child = new Element('div');
                contentDiv.appendChild(child);
            }
        }
        // append this to the result div.
        parent.appendChild(contentDiv);
        parent.appendChild(imageDiv);
    },
    loadPaginationData: function (data) {
        this.options.page = data.currentPage * 1;
        this.options.total = data.totalResults;
        this.options.maxpage = Math.ceil(this.options.total / this.options.perPage);

        this.container.getElement('div.pDiv input').value = this.options.page;
        var to = (this.options.page * this.options.perPage) > this.options.total ? this.options.total : (this.options.page * this.options.perPage);
        this.container.getElement('div.pDiv .pPageStat').set('html', ((this.options.page - 1) * this.options.perPage + 1) + '..' + to + ' / ' + this.options.total);
        this.container.getElement('div.pDiv .pcontrol span').set('html', this.options.maxpage);
    },
    addPagination: function (parent) {
        if (this.options.pagination && !parent.getElement('pDiv')) {
            var pDiv = new Element('div');
            pDiv.addClass('pDiv');
            // pDiv.setStyle('width', width);
            pDiv.setStyle('height', 25);
            parent.appendChild(pDiv);
            var pDiv2 = new Element('div');
            pDiv2.addClass('pDiv2');
            pDiv.appendChild(pDiv2);

            var h = '<div class="pGroup"><select class="rp" name="rp">';
            var setDefaultPerPage = false;
            for (var optIdx = 0; optIdx < this.options.perPageOptions.length; optIdx++) {
                if (this.options.perPageOptions[optIdx] != this.options.perPage) h += '<option value="' + this.options.perPageOptions[optIdx] + '">' + this.options.perPageOptions[optIdx] + '</option>';
                else {
                    setDefaultPerPage = true;
                    h += '<option selected="selected" value="' + this.options.perPageOptions[optIdx] + '">' + this.options.perPageOptions[optIdx] + '</option>';
                }
            }
            h += '</select></div>';

            h += '<div class="btnseparator"></div><div class="pGroup"><div class="pFirst pButton"></div><div class="pPrev pButton"></div></div>';
            h += '<div class="btnseparator"></div><div class="pGroup"><span class="pcontrol"><input class="cpage" type="text" value="1" size="4" style="text-align:center"/> / <span></span></span></div>';
            h += '<div class="btnseparator"></div><div class="pGroup"><div class="pNext pButton"></div><div class="pLast pButton"></div></div>';
            h += '<div class="btnseparator"></div><div class="pGroup"><div class="pReload pButton"></div></div>';
            h += '<div class="btnseparator"></div><div class="pGroup"><span class="pPageStat"></div>';

            if (this.options.filterInput) h += '<div class="btnseparator"></div><div class="pGroup"><span class="pcontrol"><input class="cfilter" type="text" value="" style="" /><span></div>';

            pDiv2.innerHTML = h;
            // set this.options.perPage value from
            // this.options.perPageOptions array
            var rpObj = pDiv2.getElement('.rp');
            if (!setDefaultPerPage && rpObj.options.length > 0) {
                this.options.perPage = rpObj.options[0].value;
                rpObj.options[0].selected = true;
            }
            // ********
            pDiv2.getElement('.pFirst').addEvent('click',
            this.firstPage.bind(this));
            pDiv2.getElement('.pPrev').addEvent('click',
            this.prevPage.bind(this));
            pDiv2.getElement('.pNext').addEvent('click',
            this.nextPage.bind(this));
            pDiv2.getElement('.pLast').addEvent('click',
            this.lastPage.bind(this));
            pDiv2.getElement('.pReload').addEvent('click',
            this.refresh.bind(this));
            pDiv2.getElement('.rp').addEvent('change',
            this.perPageChange.bind(this));
            pDiv2.getElement('input.cpage').addEvent('keyup',
            this.pageChange.bind(this));
        }
    },
    firstPage: function () {
        this.options.page = 1;
        this.refresh();
    },

    prevPage: function () {
        if (this.options.page > 1) {
            this.options.page--;
            this.refresh();
        }
    },
    nextPage: function () {
        // ady :funny logic why do i need to do twice page++ but this
        // is only way to make it work it seems !!!
        this.options.page = (this.options.page++);
        if ((this.options.page + 1) > this.options.maxpage) return;

        this.options.page++;

        this.refresh();
    },
    lastPage: function () {
        this.options.page = this.options.maxpage;
        this.refresh();
    },
    perPageChange: function () {
        this.options.page = 1;
        this.options.perPage = $(this.options.mainContainer)
            .getElement('.rp').value;
        this.refresh();
    },
    pageChange: function () {

        var np = $(this.options.mainContainer).getElement(
            'div.pDiv2 input').value;

        if (np > 0 && np <= this.options.maxpage) {
            if (this.refreshDelayID) $clear(this.refreshDelayID);

            this.options.page = np;

            this.refreshDelayID = this.refresh.delay(1000, this);
        }
    },
    refresh: function () {
        this.loadData();
    },
    removeAll: function (parent) {
        parent.empty();
    }

});