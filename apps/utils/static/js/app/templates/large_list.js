window.ff = window.ff || {};
ff.templates = ff.templates || {};

(function() {

	'use strict';

	ff.templates.large_list_item = function(item) {
		var li = ff.create('li', ['link-li'], { 'data-link-view-id': item.id }),
			header = ff.create('header', ['link-header', 'js-link-header']),
			anchor = ff.create('a', ['link-url'], { 'href': item.url }),
			text = ff.utils.text(item.url),
			info = ff.templates.large_list_info(item);

		anchor.appendChild(text);
		header.appendChild(anchor);
		li.appendChild(header);
		li.appendChild(info);
		return li;
	}

	ff.templates.large_list_next = function(next) {

		var li = ff.create('li', ['load-more']),
			anchor = ff.create('a', ['btn', 'btn-block', 'js-links-load'], { 'href': '#', 'id': 'js-links-load' }),
			text = ff.utils.text('Load more');

		anchor.appendChild(text);
		li.appendChild(anchor);
		return li;

	}

	ff.templates.large_list = function(items, next) {
		var wrapper = ff.create('div');

		items.forEach(function(item, i) {
			
			var li = ff.templates.large_list_item(item);
			wrapper.appendChild(li);

		});

		if (next) {

			var li = ff.templates.large_list_next(next);
			wrapper.appendChild(li);
			
		}

		return wrapper
	}

	ff.templates.large_list_comment = function(comment) {
		var li = ff.create('li', ['comment', 'box']),
			commentHeader = ff.create('header', ['comment-header']),
			commentDate = ff.create('p', ['comment-date', 'pull-right']),
			commentDateText = ff.utils.text(comment.date),
			author = ff.create('p', ['comment-author']),
			authorText = ff.utils.text(comment.user),
			textP = ff.create('p', ['comment-text']),
			textText = ff.utils.text(comment.text);

		textP.appendChild(textText);
		author.appendChild(authorText);
		commentDate.appendChild(commentDateText);
		commentHeader.appendChild(commentDate);
		commentHeader.appendChild(author);
		li.appendChild(commentHeader);
		li.appendChild(textP);

		return li;
	}

	ff.templates.large_list_comments = function(item) {
		var commentsUL = ff.create('ul', ['comments', 'col-xs-12', 'col-sm-8']);

		item.comments.forEach(function(comment, i) {
			var li = ff.templates.large_list_comment(comment);
			commentsUL.appendChild(li);
		});

		return commentsUL;

	}

	ff.templates.large_list_info = function(item) {

		var wrapper = ff.create('div', ['link-info', 'js-link-info', 'hidden', 'container']);

		var header = ff.create('header', ['link-header']),
			userText = ff.utils.text(item.user),
			userAnchor = ff.create('a', ['link-user']),
			dateParagraph = ff.create('p', ['link-date']),
			dateText = ff.utils.text(item.date),
			description = ff.create('p', ['link-description']),
			descriptionText = '',
			commentsLength = item.comments.length,
			commentsLengthContainer = ff.create('a', ['btn', 'btn-small', 'comments-length', 'js-comments-length'], { 'href': '#' }),
			commentsLengthText = ff.utils.text(item.comments.length + ' comments'),
			commentsDiv = ff.create('section', ['comments-container', 'js-comments-container', 'hidden', 'clearfix']),
			boxContainer = ff.create('div', ['col-xs-12', 'col-sm-4']),
			commentForm = ff.templates.forms.create_comment_form(item),
			box = ff.templates.utils.empty_box('Comment', commentForm),
			commentsUL = ff.templates.large_list_comments(item);

		dateParagraph.appendChild(dateText);
		header.appendChild(dateParagraph);

		userAnchor.appendChild(userText);
		header.appendChild(userAnchor);

		wrapper.appendChild(header);

		if (item.description) {
			descriptionText = ff.utils.text(item.description);
		} else {
			descriptionText = ff.utils.text('[no description]');
		}

		description.appendChild(descriptionText);
		wrapper.appendChild(description);
		commentsLengthContainer.appendChild(commentsLengthText);
		wrapper.appendChild(commentsLengthContainer);
		boxContainer.appendChild(box);
		commentsDiv.appendChild(boxContainer);
		commentsDiv.appendChild(commentsUL);
		wrapper.appendChild(commentsDiv);

		return wrapper;

	}

}());