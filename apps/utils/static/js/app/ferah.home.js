window.ff = window.ff || {};
ff.components = ff.components || {};

ff.components.link_list = (function() {

	var link_list = {},
		next = '',
		defaultURL = '/api/links/',
		commentsURL = '/api/comments/',
		listElement = ff.qs('#link_list'),
		model = {};

	function init() {
		loadLinks();
		primeEventListeners();
	}

	function renderList(response) {
		var wrapper = ff.templates.large_list(response.results, response.next);
		listElement.innerHTML += wrapper.innerHTML;
	}

	function loadLinks() {
		if (next.length) {
			var url = next;
		} else {
			var url = defaultURL;
		}
		var request = ff.utils.ajax.getJSON(url);
		request.done(function(response) {
			cacheResults(response);
			renderList(response);
		});
		request.fail(function(response, jqXHR, textStatus) {
			console.log(response, form);
		});
	}

	function cacheResults(response) {
		for (var i = 0; i < response.results.length; i ++) {
			var result = response.results[i];
			if (model[result.id]) {
				response.results.splice(i, 1);
			}
		}
		if (response.next) {
			next = response.next;
		}
		for (var i = 0; i < response.results.length; i++) {
			var item = response.results[i];
			if (!model[item.id]) {
				model[item.id] = item;
			}
		}
	}

	function cacheResult(response) {
		if (!model[response.id]) {
			model[response.id] = response;
		}
	}

	function addhttp(url) {
		if (url && !/^(f|ht)tps?:\/\//i.test(url)) {
			url = "http://" + url;
		}
		return url;
	}

	function submitCreateForm(form) {
		var urlField = ff.qs('#id_url', form);
		var descriptionField = ff.qs('#id_description', form);
		var url = addhttp(urlField.value);
		var data = {
			'url': url,
			'description': descriptionField.value,
		}
		var request = ff.utils.ajax.postJSON(defaultURL, data);
		request.done(function(response) {
			cacheResult(response);
			renderLink(response);
			closeModal(form);
		});
		request.fail(function(response, jqXHR, textStatus) {
			parseAjaxErrorResponse(response, form);
		});
	}

	function parseAjaxErrorResponse(response, form) {
		data = JSON.parse(response.responseText);
		for (var index in data) {
			if (data.hasOwnProperty(index)) {
				var message = data[index];
				var field = index;
				if (field === '__all__') {
					applyFormError(message[0], form);
				} else {
					applyFieldError(field, message, form);
				}
			}
		}
	}

	function applyFormError(message, form) {
		var error_container = ff.qs('#form_errors', form);
		var error_text = ff.utils.text(message);
		var error_msg = ff.create('span', ['form-error']);

		error_msg.appendChild(error_text);

		error_container.style.display = 'block';
		ff.utils.prepend(error_msg, error_container);
	}

	function applyFieldError(field, message, form) {
		var input = ff.qs('#id_' + field, form);
		var error_text = ff.utils.text(message);
		var error_msg = ff.create('span', ['error']);
		error_msg.appendChild(error_text);
		ff.utils.insertAfter(input, error_msg);
	}

	function clearFormErrors(form) {
		var error_container = ff.qs('#form_errors', form);
		var errorElements = ff.utils.qsa('.error', form);
		ff.utils.each('.error', function(element, i) {
			ff.utils.remove(element);
		}, form);
		error_container.style.display = 'none';
		error_container.innerHTML = '';
	}

	function closeModal(form) {
		ff.utils.remove(ff.qs('.modal-wrapper'));
	}

	function renderLink(response) {
		var html = ff.templates.large_list_item(response);
		ff.utils.prepend(html, listElement);
	}

	function renderComment(response, form) {
		var html = ff.templates.large_list_comment(response);
		var parent = ff.utils.parent(form, 'section');
		var commentsUL = ff.qs('.comments', parent);
		ff.utils.prepend(html, commentsUL);
	}

	function submitCommentForm(form) {
		var parentLinkLi = ff.utils.parent(form, 'li');
		var textField = ff.qs('#id_text', form);
		var linkID = parentLinkLi.getAttribute('data-link-id');
		var data = {
			'text': textField.value,
			'link': linkID,
		}
		var request = ff.utils.ajax.postJSON(commentsURL, data);
		request.done(function(response) {
			renderComment(response, form);
			textField.value = '';
		});
		request.fail(function(response, jqXHR, textStatus) {
			parseAjaxErrorResponse(response, form);
		});
	}

	function primeEventListeners() {
		ff.live('.js-link-create .fa', 'click', function(event) {
			var form = ff.templates.forms.create_link_form();
			var box = ff.templates.utils.empty_box('Create Link', form);
			var modal = new ff.objects.Modal();
			
			event.preventDefault();
			modal.render(box);
		});
		ff.live('#link_list .js-links-load', 'click', function(event) {
			var parent = ff.utils.parent(this, 'li');
			
			event.preventDefault();
			loadLinks();
			ff.utils.remove(parent);
		});
		ff.live('#link_list .js-link-header', 'click', function(event) {
			var parent = ff.utils.parent(this, 'li');
			
			event.preventDefault();
			ff.utils.toggleClass(parent, 'js-link-close');
			ff.utils.toggleClass(parent, 'js-link-open');
		});
		ff.live('#js-link-form .submit', 'click', function(event) {
			var form = ff.utils.parent(this, 'form');
			
			event.preventDefault();
			clearFormErrors(form);
			submitCreateForm(form);
		});
		ff.live('#link_list .js-comments-length', 'click', function(event) {
			var parent = ff.utils.parent(this, 'div');
			var comments_wrap = ff.qs('.comments-container', parent);

			event.preventDefault();
			ff.utils.toggleClass(comments_wrap, 'open');
		});
		ff.live('#link_list .comment_form input.submit', 'click', function(event) {
			var form = ff.utils.parent(this, 'form');
			
			event.preventDefault();
			clearFormErrors(form);
			submitCommentForm(form);
		});
	}

	link_list.init = init;
	return link_list;

}());