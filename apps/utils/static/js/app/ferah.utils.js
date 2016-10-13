window.ff = window.ff || {};
ff.utils = ff.utils || {};

(function() {

	'use strict';

	// Allow for looping on nodes by chaining:
	// qsa('.foo').forEach(function () {})
	NodeList.prototype.forEach = Array.prototype.forEach;

	// Dom ready
	ff.ready = function(callback) {
		document.addEventListener('DOMContentLoaded', callback);
	};
	// Get element by CSS selector:
	ff.qs = function(selector, scope) {
		return (scope || document).querySelector(selector);
	};

	// addEventListener wrapper:
	ff.on = function(target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	};
	// Register events on elements that may or may not exist.
	// ff.live('div a', 'click', funciton(event) {});
	ff.live = (function() {
		var eventRegistry = {};

		function dispatchEvent(event) {
			var targetElement = event.target;

			eventRegistry[event.type].forEach(function(entry) {
				if (entry.parent) {
					var potentialElements = ff.utils.qsa(entry.selector, entry.parent);
				} else {
					var potentialElements = ff.utils.qsa(entry.selector);
				}
				var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

				if (hasMatch) {
					entry.handler.call(targetElement, event);
				}
			});
		}

		return function(selector, event, handler, parent) {
			if (!eventRegistry[event]) {
				eventRegistry[event] = [];
				ff.on(document.documentElement, event, dispatchEvent, true);
			}

			eventRegistry[event].push({
				selector: selector,
				handler: handler,
				parent: parent,
			});
		};
	}());
	// Create dom element. Provide a list of class names
	// and/or an object containing keys/values for attributes.
	ff.create = function(tagName, classList, attributeObject) {
		// If second arg is an object, swap value with third
		if (Object.prototype.toString.call(classList) === '[object Object]') {
			var tmp = classList;
			classList = attributeObject;
			attributeObject = tmp;
		}
		var element = document.createElement(tagName);
		if (classList) {
			for (var i = 0; i < classList.length; i++) {
				ff.utils.addClass(element, classList[i]);
			}
		}
		if (attributeObject) {
			for (var property in attributeObject) {
				if (attributeObject.hasOwnProperty(property)) {
					element.setAttribute(property, attributeObject[property]);
				}
			}
		}
		return element;
	};



	// Get elements by CSS selector:
	ff.utils.qsa = function(selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};
	// removeEventListener wrapper:
	ff.utils.off = function(target, type, callback) {
		target.removeEventListener(type, callback);
	};
	// Returns true if node is element or document
	ff.utils.isElement = function(node) {
		if (node && node.nodeName && (node.nodeType === 3 || node.nodeType === 9)) {
			return true;
		}
		return false;
	};
	// Each implementation. Callback gets element and i
	// params
	ff.utils.each = function(selector, callback, scope) {
		var elements = ff.utils.qsa(selector, scope);
		Array.prototype.forEach.call(elements, callback);
	};
	// Returns true or false if element has provided class
	ff.utils.hasClass = function(element, className) {
		if (element.classList) {
			return element.classList.contains(className);
		} else {
			return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
		}
	};
	// Removes class from element
	ff.utils.removeClass = function(element, className) {
		if (element.classList) {
			element.classList.remove(className);
		} else {
			if (ff.utils.hasClass(element, className)) {
				element.className = element.className.replace(new RegExp("(^|\\s)" + className + "(\\s|$)"), " ").replace(/\s$/, "");
			}
		}
	};
	ff.utils.insertAfter = function(element, newElement) {
		if (!element.parentNode || !element.nextSibling) {
			return;
		}
		element.parentNode.insertBefore(newElement, element.nextSibling);
	};
	// Add a class to provided element
	ff.utils.addClass = function(element, className) {
		if (element.classList) {
			element.classList.add(className);
		} else {
			element.classList += ' ' + className;
		}
	};
	// Toggle class on element
	ff.utils.toggleClass = function(element, className) {
		if (element.classList) {
			element.classList.toggle(className);
		} else {
			var classes = element.className.split(' ');
			var existingIndex = classes.indexOf(className);

			if (existingIndex >= 0) {
				classes.splice(existingIndex, 1);
			} else {
				classes.push(className);
			}

			element.className = classes.join(' ');
		}
	};
	ff.utils.toggle = function(element) {
		if (element.style.display == 'none') {
			element.style.display = 'block';
		} else {
			element.style.display = 'none';
		}
	}
	// Create text node
	ff.utils.text = function(text) {
		return document.createTextNode(text);
	};
	ff.utils.parentByClass = function(element, className) {
		if (!element.parentNode) {
			return;
		}
		if (ff.utils.hasClass(element.parentNode, className)) {
			return element.parentNode;
		}
		return ff.utils.parentByClass(element.parentNode, className);
	};
	// Get element's parent node with given tag name
	ff.utils.parent = function(element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return ff.utils.parent(element.parentNode, tagName);
	};
	// Removes element
	ff.utils.remove = function(element) {
		if (!element.parentNode) {
			return;
		}
		element.parentNode.removeChild(element);
	};
	ff.utils.prepend = function(element, parent) {
		parent.insertBefore(element, parent.firstChild);
	};
	// Generate cokie
	ff.utils.csrfcookie = function() {
		var cookieValue = null,
			name = 'csrftoken';
		if (document.cookie && document.cookie !== '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i].trim();
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	};
	ff.utils.parseInt = function(value) {
		if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
			return Number(value);
		}
		return NaN;
	};
	// Constructor to create reusable sort functions for arrays of objects
	// E.g. array.sort(ff.utils.sort_by('name', false, function(a) { return a }));
	ff.utils.sort_by = function(field, reverse, primer) {
		var key = primer ?
			function(x) { return primer(x[field]) } :
			function(x) { return x[field] };

		reverse = [-1, 1][+!!reverse];

		return function(a, b) {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		}
	};

	ff.utils.addhttp = function(url) {
		if (url && !/^(f|ht)tps?:\/\//i.test(url)) {
			url = "http://" + url;
		}
		return url;
	};

}());