window.ff = window.ff || {};
window.ff.views = window.ff.views || {};

(function() {

	'use strict';

	function LinkListView(model) {
		this.model = model;
		this.listElement = ff.qs('#link_list');
		this.rendered = {};

		this.loadButtonClicked = new ff.Event(this);

		var that = this;
		
		that.model.itemsAdded.attach(function() {
			that.rebuildList();
		});

		that.model.itemAdded.attach(function() {
			that.rebuildList();
		});

		that.model.itemCreated.attach(function() {
			that.rebuildList();
		});

		ff.live('#link_list .js-links-load', 'click', function(event) {
			event.preventDefault();
			that.loadButtonClicked.notify();
		});

	}

	LinkListView.prototype.init = function() {
		var that = this;
		that.model.read();
	};

	LinkListView.prototype.rebuildList = function() {
		var that = this;
		var items = that.model.getItems();

		if (that.model.next) {
			var next = that.model.next;
		} else {
			var next = '';
		}

		items = items.sort(ff.utils.sort_by('id', false, function(a) { return a; }));

		var wrapper = ff.templates.large_list(items, next);
		that.listElement.innerHTML = wrapper.innerHTML;
	}

	ff.views.LinkListView = LinkListView;

}());