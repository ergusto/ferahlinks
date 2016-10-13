window.ff = window.ff || {};
ff.utils = ff.utils || {};

ff.utils.ajax = (function($) {

	var ajax = {};

	function getJSON(url) {
		return $.ajax({
			type: 'GET',
			dataType: 'json',
			url: url,
		});
	}

	function postJSON(url, object) {
		return $.ajax({
			type: 'POST',
			dataType: 'json',
			url: url,
			data: object,
		});
	}

	function getHTML(url) {
		return $.ajax({
			type: 'GET',
			dataType: 'html',
			url: url,
		});
	}

	ajax.getJSON = getJSON;
	ajax.postJSON = postJSON;
	ajax.getHTML = getHTML;

	return ajax;

}(jQuery));