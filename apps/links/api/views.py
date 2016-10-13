from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from rest_framework import filters
from rest_framework_extensions.mixins import DetailSerializerMixin

from ..models import Link
from serializers import LinkSerializer
from permissions import IsOwnerOrReadOnly

class LinkViewSet(ModelViewSet):
	queryset = Link.objects.all()
	serializer_class = LinkSerializer
	permission_classes = (permissions.IsAuthenticated, IsOwnerOrReadOnly,)
	filter_backends = (filters.OrderingFilter,)
	ordering = ('-date',)

	def pre_save(self, obj):
		obj.user = self.request.user