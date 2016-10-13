window.ff = window.ff || {};

(function() {

	'use strict';

	function Model() {
		this.items = {};
		this.url = '/api/links/';
		this.next = '';

		this.itemAdded = new ff.Event(this);
		this.itemsAdded = new ff.Event(this);
		this.itemRemoved = new ff.Event(this);
		this.itemCreated = new ff.Event(this);
		this.itemUpdated = new ff.Event(this);
		this.itemCreateError = new ff.Event(this);
	}

	Model.prototype.getItems = function() {
		var that = this;
		var array = new Array;
		var items = that.items;
		for (var obj in items) {
			array.push(items[obj]);
		}
		return array;
	}

	Model.prototype.cacheInstance = function(instance) {
		var that = this;

		if (!that.items[instance.id]) {

			that.items[instance.id] = instance;

		} else {

			var original = that.items[instance.id];
			var result = instance;

			for (var key in result) {

				if (result.hasOwnProperty(key) && original.hasOwnProperty(key) ) {
					if (result[key] !== original[key]) {
						original[key] = result[key];
					}
				}

			}

		}
	};

	Model.prototype.cacheResponse = function(response) {
		var that = this;

		if (response.results) {
			if (response.next) {
				that.next = response.next;
			} else {
				that.next = '';
			}
			for (var i = 0; i < response.results.length; i ++) {
				var result = response.results[i];
				if (that.items[result.id]) {
					response.results.splice(i, 1);
				}
			}
			for (var i = 0; i < response.results.length; i++) {
				var result = response.results[i];
				that.cacheInstance(result);
			}
		} else {
			if (response.id) {
				that.cacheInstance(response);
			}
		}
	};

	Model.prototype.create = function(url, description, callback, errorCallback) {
		var that = this;

		url = url || '';
		description = description || '';
		callback = callback || function() {};

		var newItem = {
			url: url.trim(),
			description: description.trim(),
		};

		var request = ff.utils.ajax.postJSON(that.url, newItem);
		request.done(function(response) {
			that.cacheResponse(response);
			that.itemCreated.notify();
			callback.call(that, response);
		});
		request.fail(function(response, jqXHR, textStatus) {
			errorCallback.call(that, response, jqXHR, textStatus);
			that.itemCreateError.notify({ response: response });
		});

	};

	Model.prototype.read = function(query, callback) {
		
		var that = this;
		
		var queryType = typeof query;
		callback = callback || function() {};

		if (queryType === 'function' || queryType === 'undefined') {
			
			callback = query;
			query = '';

			if (!that.next) {
				var url = that.url;
			} else {
				var url = that.next;
			}

			var request = ff.utils.ajax.getJSON(url);
			request.done(function(response) {
				that.cacheResponse(response);
				that.itemsAdded.notify({ results: response.results });
				if (callback && typeof callback === 'function') {
					callback.call(that, response);
				}
			});
			request.fail(function(response, jqXHR, textStatus) {
				if (callback && typeof callback === 'function') {
					callback.call(that, response, jqXHR, textStatus);
				}
			});

		} else if (queryType === 'string' || queryType === 'number') {
			
			query = ff.utils.parseInt(query, 10);
			
			if (!query === NaN) {
				var url = that.url + query;
				var request = ff.utils.getJSON(url);
				request.done(function(response) {
					that.cacheResponse(response);
					that.itemAdded.notify({ result: response })
					callback.call(that, response);
				});
				request.fail(function(response, jqXHR, textStatus) {
					callback.call(that, response, jqXHR, textStatus);
				});
			}
		}

	};

	ff.Model = Model;

}());