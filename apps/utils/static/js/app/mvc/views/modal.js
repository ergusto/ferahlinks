window.ff = window.ff || {};
window.ff.views = window.ff.views || {};

(function() {

	'use strict';

	function NewItemModalView(collection) {
		this.collection = collection;

		var that = this;

		that.viewInitialised = new ff.Event(this);
		that.newItemButtonClicked = new ff.Event(this);
		that.submitButtonClicked = new ff.Event(this);
	}

	NewItemModalView.prototype.init = function() {
		var that = this;
		that.viewInitialised.notify();
	};

	NewItemModalView.prototype.openModal = function() {
		var that = this;
		var form = ff.templates.forms.create_link_form();
		var box = ff.templates.utils.empty_box('Create Link', form);
		var modal = new ff.objects.Modal();
		that.modal = modal;
		
		modal.render(box);
	};

	NewItemModalView.prototype.applyFormError = function(message) {
		var form = ff.qs('#js-link-form');
		var error_container = ff.qs('#form_errors', form);
		var error_text = ff.utils.text(message);
		var error_msg = ff.create('span', ['form-error']);

		error_msg.appendChild(error_text);

		error_container.style.display = 'block';
		ff.utils.prepend(error_msg, error_container);
	};

	NewItemModalView.prototype.applyFieldError = function(field, message) {
		var form = ff.qs('#js-link-form');
		var input = ff.qs('#id_' + field, form);
		var error_text = ff.utils.text(message);
		var error_msg = ff.create('span', ['error']);
		error_msg.appendChild(error_text);
		ff.utils.insertAfter(input, error_msg);
	};

	NewItemModalView.prototype.parseAjaxErrorResponse = function(response) {
		var that = this;
		var form = ff.qs('#js-link-form');
		var errors = JSON.parse(response.responseText);
		for (var error in errors) {
			if (errors.hasOwnProperty(error)) {
				var message = errors[error];
				var field = error;
				if (field === '__all__') {
					that.applyFormError(message[0]);
				} else {
					that.applyFieldError(field, message);
				}
			}
		}
	};

	NewItemModalView.prototype.submitForm = function() {
		var that = this;
		var form = ff.qs('#js-link-form');
		var urlField = ff.qs('#id_url', form);
		var descriptionField = ff.qs('#id_description', form);
		var url = ff.utils.addhttp(urlField.value);
		var data = {
			'url': url,
			'description': descriptionField.value,
		}
		that.collection.create(data, function(response) {
			if (response.status >= 200 && response.status < 400) {
				that.modal.close();
			} else {
				that.parseAjaxErrorResponse(response, form);
			}
		});
	};

	ff.views.NewItemModalView = NewItemModalView;

}());