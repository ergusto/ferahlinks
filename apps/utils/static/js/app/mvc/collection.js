window.ff = window.ff || {};

(function() {

	'use strict';

	function Collection() {
		this.items = {};
		this.url = '/api/links/';
		this.next = '';
		var that = this;

		that.itemAdded = new ff.Event(this);
		that.itemsAdded = new ff.Event(this);
		that.itemRemoved = new ff.Event(this);
		that.itemCreated = new ff.Event(this);
		that.itemUpdated = new ff.Event(this);
		that.itemCreateError = new ff.Event(this);
	}

	Collection.prototype.create = function(data, callback) {
		var that = this;
		callback = callback || function() {};

		var request = ff.utils.ajax.postJSON(that.url, data);
		request.done(function(response) {
			that.cacheResponse(response);
			that.itemCreated.notify({ item: response });
			callback.call(that, response);
		});
		request.fail(function(response, jqXHR, textStatus) {
			that.itemCreateError.notify({ errors: response.errors });
			callback.call(that, response);
		});
	};

	Collection.prototype.getByID = function(id) {
		var that = this;
		if (that.items[id]) {
			return that.items[id];
		} else {
			var model = that.load(id, function(response) {
				if (response.results) {
					console.log(model);
				} else {
					var model = response;
					return model;
				}
			});
		}
	};

	Collection.prototype.getItemsArray = function() {
		var that = this;
		var array = new Array;
		var items = that.getItems();
		for (var obj in items) {
			array.push(items[obj]);
		}
		return array;
	};

	Collection.prototype.getItems = function() {
		var that = this;
		return that.items;
	};

	Collection.prototype.getItemsBy = function(field, reverse) {
		var that = this;
		var items = that.getItemsArray();
		return items.sort(ff.utils.sort_by(field, reverse, function(a) { return a; }));
	};

	Collection.prototype.cacheInstance = function(instance) {
		var that = this;

		if (!that.items[instance.id]) {

			return that.items[instance.id] = new ff.models.Link(that, instance);

		}
	};

	Collection.prototype.cacheResponse = function(response) {
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
			var tmp = [];
			for (var i = 0; i < response.results.length; i++) {
				var result = response.results[i];
				that.cacheInstance(result);
				tmp.push(that.items[result.id]);
			}
			that.itemsAdded.notify({ items:tmp });
		} else {
			if (response.id) {
				var model = that.cacheInstance(response);
				that.itemAdded.notify({ item:model });
			}
		}
	};

	Collection.prototype.load = function(query, callback) {
		
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
					var model = that.cacheResponse(response);
					that.itemAdded.notify({ item:model })
					callback.call(that, model);
				});
				request.fail(function(response, jqXHR, textStatus) {
					callback.call(that, response, jqXHR, textStatus);
				});
			}
		}

	};

	ff.Collection = Collection;

}());