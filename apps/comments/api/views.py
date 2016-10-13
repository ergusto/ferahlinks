from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from rest_framework import filters
from rest_framework_extensions.mixins import DetailSerializerMixin

from ..models import Comment
from serializers import CommentSerializer
from permissions import IsOwnerOrReadOnly

class CommentViewSet(ModelViewSet):
	queryset = Comment.objects.all()
	serializer_class = CommentSerializer
	permission_classes = (permissions.IsAuthenticated, IsOwnerOrReadOnly,)
	filter_backends = (filters.OrderingFilter,)
	ordering = ('-date',)

	def pre_save(self, obj):
		obj.user = self.request.user