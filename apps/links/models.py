from django.db import models
from django.template.defaultfilters import slugify
from django.utils import timezone
from django.core.urlresolvers import reverse

# Create your models here.

class Link(models.Model):
	user = models.ForeignKey('auth.User', related_name='links')
	description = models.TextField(max_length=2400, null=True, blank=True)
	url = models.URLField(max_length=255, unique=True)
	date = models.DateTimeField(null=True, blank=True, editable=False)

	def save(self, *args, **kwargs):
		if not self.id:
			self.date = timezone.now()
		super(Link, self).save(*args, **kwargs)