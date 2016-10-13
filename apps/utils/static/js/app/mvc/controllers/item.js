window.ff = window.ff || {};
window.ff.controllers = window.ff.controllers || {};

(function() {

	'use strict';

	function LinkItemController(model, view) {
		this.model = model;
		this.view = view;

		var that = this;

		that.view.parent.itemHeaderClicked.attach(function(sender, args) {
			if (args.id == that.model.id) {
				that.showLinkInfo();
			}
		});

		that.view.parent.itemCommmentsClicked.attach(function(sender, args) {
			if (args.id == that.model.id) {
				that.showLinkComments();
			}
		});
	}

	LinkItemController.prototype.showLinkInfo = function() {
		var that = this;
		that.view.toggleInfo();
	};

	LinkItemController.prototype.showLinkComments = function() {
		var that = this;
		that.view.toggleComments();
	};

	ff.controllers.LinkItemController = LinkItemController;

}());