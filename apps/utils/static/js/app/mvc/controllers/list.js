window.ff = window.ff || {};
window.ff.controllers = window.ff.controllers || {};

(function() {

	'use strict';

	function LinkListController(collection, view) {
		this.collection = collection;
		this.view = view;

		var that = this;

		that.view.viewInitialised.attach(function(sender, args) {
			that.primeEventListeners();
		});

		that.view.loadButtonClicked.attach(function(sender, args) {
			that.fetchMoreItems();
		});

		that.collection.itemAdded.attach(function(sender, args) {
			that.addItemToList();
		});

		that.collection.itemsAdded.attach(function(sender, args) {
			that.addItemsToList(args.items);
		});

	}

	LinkListController.prototype.primeEventListeners = function() {
		var that = this;

		ff.live('#link_list .js-links-load', 'click', function(event) {
			event.preventDefault();
			that.view.loadButtonClicked.notify();
		});
		ff.live('#link_list .js-link-header', 'click', function(event) {
			event.preventDefault();
			var parent_id = ff.utils.parent(this, 'li').getAttribute('data-link-view-id');
			that.view.itemHeaderClicked.notify({ id: parent_id });
		});
		ff.live('#link_list .js-comments-length', 'click', function(event) {
			event.preventDefault();
			var parent_id = ff.utils.parent(this, 'li').getAttribute('data-link-view-id');
			that.view.itemCommmentsClicked.notify({ id: parent_id });
		});

	};

	LinkListController.prototype.fetchMoreItems = function() {
		var that = this;
		that.collection.load();
	};

	LinkListController.prototype.addItemToList = function() {
		var that = this;
		that.view.rebuildList();
	};

	LinkListController.prototype.addItemsToList = function(items) {
		var that = this;
		that.view.buildList(items);
	}

	ff.controllers.LinkListController = LinkListController;

}());