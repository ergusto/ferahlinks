window.ff = window.ff || {};
ff.views = ff.views || {};
ff.controllers = ff.controllers || {};

(function() {

	'use strict';

	function App() {
		this.collection = new ff.Collection();
		this.list_view = new ff.views.LinkListView(this.collection);
		this.list_controller = new ff.controllers.LinkListController(this.collection, this.list_view)
		this.modal_view = new ff.views.NewItemModalView(this.collection);
		this.modal_controller = new ff.controllers.NewItemModalController(this.collection, this.modal_view)
	}

	ff.ready(function() {
		var app = new App();
		app.list_view.init();
		app.modal_view.init();
	});

}());