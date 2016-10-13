window.ff = window.ff || {};
window.ff.controllers = window.ff.controllers || {};

(function() {

	'use strict';

	function LinkListController(model, view) {
		this.model = model;
		this.view = view;

		var that = this;

		that.view.loadButtonClicked.attach(function() {
			that.model.read();
		});
	}

	function LinkModalController(model, view) {
		this.model = model;
		this.view = view;

		this.modal = new ff.objects.Modal();

		var that = this;

		that.view.createButtonClicked.attach(function(sender, args) {
			that.showModal();
		});

		that.view.submitLinkForm.attach(function(sender, args) {
			var form = args.form;
			that.submitForm(form);
		});

		that.model.itemCreated.attach(function() {
			that.modal.closeEvent.notify();
		});
	}

	LinkModalController.prototype.showModal = function() {
		var that = this;
		var form = ff.templates.forms.create_link_form();
		var box = ff.templates.utils.empty_box('Create Link', form);
		that.modal.render(box);
	};

	LinkModalController.prototype.parseErrorResponse = function(response, jqXHR, textStatus) {
		console.log(response);
	};

	LinkModalController.prototype.submitForm = function(form) {
		var that = this;
		var urlField = ff.qs('#id_url', form);
		var descriptionField = ff.qs('#id_description', form);
		var url = ff.utils.addhttp(urlField.value);
		var description = descriptionField.value;
		that.model.create(url, description);
	};

	ff.controllers.LinkListController = LinkListController;
	ff.controllers.LinkModalController = LinkModalController;

}());