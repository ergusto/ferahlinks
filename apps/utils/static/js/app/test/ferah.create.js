window.ff = window.ff || {};
window.ff.views = window.ff.views || {};

(function() {

	'use strict';

	function LinkModalView(model) {
		this.model = model;
		var that = this;

		that.createButtonClicked = new ff.Event(this);
		that.submitLinkForm = new ff.Event(this);

		ff.live('.js-link-create .fa', 'click', function(event) {
			event.preventDefault();
			that.createButtonClicked.notify();
		});

		ff.live('#js-link-form .submit', 'click', function(event) {
			var form = ff.utils.parent(event.target, 'form');
			event.preventDefault();
			that.submitLinkForm.notify({ form: form });
		});

	}

	ff.views.LinkModalView = LinkModalView;

}());