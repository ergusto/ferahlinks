window.ff = window.ff || {};
window.ff.controllers = window.ff.controllers || {};

(function() {

	'use strict';

	function NewItemModalController(collection, view) {
		this.collection = collection;
		this.view = view;

		var that = this;

		that.view.viewInitialised.attach(function(sender, args) {
			that.primeEventListeners();
		});

		that.view.newItemButtonClicked.attach(function(sender, args) {
			that.showModal();
		});

		that.view.submitButtonClicked.attach(function(sender, args) {
			that.processForm();
		});
	}

	NewItemModalController.prototype.primeEventListeners = function() {

		var that = this;

		ff.live('.js-link-create .fa', 'click', function(event) {
			event.preventDefault();
			that.view.newItemButtonClicked.notify();
		});

		ff.live('#js-link-form .submit', 'click', function(event) {
			event.preventDefault();
			that.view.submitButtonClicked.notify();
		});

	};

	NewItemModalController.prototype.showModal = function() {
		var that = this;
		that.view.openModal();
	};

	NewItemModalController.prototype.processForm = function() {
		var that = this;
		that.view.submitForm();
	};

	ff.controllers.NewItemModalController = NewItemModalController;

}());