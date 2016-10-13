window.ff = window.ff || {};
window.ff.models = window.ff.models || {};

(function() {

	'use strict';

	function Link(collection, attrs) {
		var that = this;
		that.id = attrs.id || '';
		that.user = attrs.user;
		that.url = attrs.url;
		that.description = attrs.description || '';
		that.date = attrs.date;
		that.comments = attrs.comments;
		that.collection = collection;
	}

	Link.prototype.isNew = function() {
		if (self.id) {
			return true;
		}
		return false;
	}

	Link.prototype.update = function(attrs) {
		console.log(this);
	}

	ff.models.Link = Link;

}());