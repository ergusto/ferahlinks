window.ff = window.ff || {};
ff.objects = ff.objects || {};

(function() {

	'use strict';

	var Modal = function() {
		this.closeEvent = new ff.Event(this);
	};

	Modal.prototype.close = function() {
		ff.utils.removeClass(document.body, 'modal-open');
		ff.utils.remove(ff.qs('.modal-wrapper'));
	}

	Modal.prototype.render = function(html, callback) {

		var that = this,
			wrapper = ff.create('div', ['modal-wrapper']),
			modalMainClasses = ['modal', 'col-xs-10', 'col-xs-offset-1', 'col-sm-6', 'col-sm-offset-3', 'col-md-4', 'col-md-offset-4'],
			modalMain = ff.create('div', modalMainClasses);

		modalMain.appendChild(html);
		wrapper.appendChild(modalMain);

		ff.utils.addClass(document.body, 'modal-open');
		document.body.appendChild(wrapper);

		var closeHandler = function(event) {
			if (event) {
				if (event.target !== this) {
					return;
				}
				event.preventDefault();
			}
			that.close();
		};

		that.closeEvent.attach(function(sender, args) {
			closeHandler();
		});

		ff.on(wrapper, 'click', closeHandler, false);
		ff.live('.modal-cancel', 'click', closeHandler, false);

		if (callback && typeof callback === 'function') {
			callback();
		}

	};

	ff.objects.Modal = Modal;

}());