window.ff = window.ff || {};
window.ff.views = window.ff.views || {};

(function() {

	'use strict';

	function LinkItemView(parent_view, model) {
		this.parent = parent_view;
		this.model = model;
		var that = this;
		that.selector = '[data-link-view-id="' + that.model.id + '"]';
	}

	LinkItemView.prototype.toggleInfo = function() {
		var that = this;
		var element = ff.qs(that.selector);
		var info = ff.qs('.js-link-info', element);
		ff.utils.toggleClass(info, 'hidden');
	};

	LinkItemView.prototype.toggleComments = function() {
		var that = this;
		var element = ff.qs(that.selector);
		var comments = ff.qs('.js-comments-container', element);
		ff.utils.toggleClass(comments, 'hidden');
	};

	ff.views.LinkItemView = LinkItemView;

}());