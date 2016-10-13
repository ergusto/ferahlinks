window.ff = window.ff || {};
ff.templates = ff.templates || {};
ff.templates.forms = ff.templates.forms || {};

(function() {

	'use strict';

	ff.templates.forms.create_link_form = function() {

		var form = ff.create('form', ['clearfix', 'page_form'], { 'id': 'js-link-form' }),
			csrftoken = ff.utils.csrfcookie(),
			csrfinput = ff.create('input', { 'type': 'hidden', 'name': 'csrfmiddlewaretoken', 'value': csrftoken }),

			formGroup1 = ff.create('div', ['form-group']),
			urlLabel = ff.create('label'),
			urlLabelText = ff.utils.text("Url:"),
			urlInput = ff.create('input', { 'id': 'id_url', 'maxlength': '255', 'name': 'url', 'type': 'url' }),

			formGroup2 = ff.create('div', ['form-group']),
			descriptionLabel = ff.create('label'),
			descriptionLabelText = ff.utils.text('Description:'),
			descriptionInput = ff.create('textarea', { 'cols': '40', 'id': 'id_description', 'name': 'description', 'rows': '5' }),
			
			submitText= ff.utils.text('Submit'),
			submit = ff.create('input', ['btn', 'submit'], { 'type': 'submit' }),
			formErrors = ff.create('div', { 'id': 'form_errors' });

		form.appendChild(csrfinput);

		urlLabel.appendChild(urlLabelText);
		formGroup1.appendChild(urlLabel);
		formGroup1.appendChild(urlInput);

		form.appendChild(formGroup1);

		descriptionLabel.appendChild(descriptionLabelText);
		formGroup2.appendChild(descriptionLabel);
		formGroup2.appendChild(descriptionInput);

		form.appendChild(formGroup2);

		submit.appendChild(submitText);
		form.appendChild(submit);
		form.appendChild(formErrors);

		return form;

	};

	ff.templates.forms.create_comment_form = function(link) {
		var form = ff.create('form', ['cleafix', 'page_form', 'comment_form']),
		formGroup1 = ff.create('div', ['form-group']),
		textInput = ff.create('textarea', { 'id': 'id_text', 'type': 'text', 'rows': '5' }),
			
		submitText = ff.utils.text('Submit'),
		submit = ff.create('input', ['btn', 'btn-small', 'submit'], { 'type': 'submit' }),
		formErrors = ff.create('div', { 'id': 'form_errors' });

		formGroup1.appendChild(textInput);
		form.appendChild(formGroup1);

		submit.appendChild(submitText);
		form.appendChild(submit);
		form.appendChild(formErrors);

		return form
	}

}());