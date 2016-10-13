from django.utils import timezone
from django.db import models

# Create your models here.

class Comment(models.Model):
	user = models.ForeignKey('auth.User', related_name='comments')
	link = models.ForeignKey('links.Link', related_name='comments')
	text = models.TextField(max_length=600)
	date = models.DateTimeField(null=True, blank=True, editable=False)

	def save(self, *args, **kwargs):
		if not self.id:
			self.date = timezone.now()
		super(Comment, self).save(*args, **kwargs)