window.ff = window.ff || {};
window.ff.views = window.ff.views || {};

(function() {

	'use strict';

	function LinkListView(collection) {
		this.collection = collection;
		this.element = ff.qs('#link_list');
		
		var that = this;

		that.viewInitialised = new ff.Event(this);
		that.loadButtonClicked = new ff.Event(this);
		that.itemHeaderClicked = new ff.Event(this);
		that.itemCommmentsClicked = new ff.Event(this);
	}

	LinkListView.prototype.init = function() {
		var that = this;
		that.collection.load();
		that.viewInitialised.notify();
	};

	LinkListView.prototype.childrenGenerator = function(items) {
		var that = this;
		var wrapper = ff.create('div');

		for (var i = 0; i < items.length; i++) {
			var model = items[i];
			var element = ff.templates.large_list_item(model);
			var view = new ff.views.LinkItemView(that, model);
			var controller =  new ff.controllers.LinkItemController(model, view);
			wrapper.appendChild(element);
		}

		if (that.collection.next) {
			var next = ff.templates.large_list_next(that.collection.next);
			wrapper.appendChild(next);
		}

		var button = ff.qs('.load-more', that.element);
		if (button) {
			ff.utils.remove(button);
		}

		return wrapper
	}

	LinkListView.prototype.rebuildList = function() {
		var that = this;
		var items = that.collection.getItemsBy('id');

		var children = that.childrenGenerator(items);		

		that.element.innerHTML = children.innerHTML;
	};

	LinkListView.prototype.buildList = function(items) {
		var that = this;
		var items = items || that.collection.getItemsBy('id');

		var children = that.childrenGenerator(items);

		that.element.innerHTML += children.innerHTML;
	};

	ff.views.LinkListView = LinkListView;

}());