from rest_framework import serializers
from rest_framework.pagination import PaginationSerializer

from apps.links.models import Link
from apps.comments.api.serializers import CommentSerializer

class LinkSerializer(serializers.ModelSerializer):
	user = serializers.Field(source='user.username')
	comments = CommentSerializer(source='comments', many=True, required=False)

	class Meta:
		model = Link
		fields = ('id', 'user', 'url', 'description','date', 'comments')
		partial = True

class PaginatedLinkSerializer(PaginationSerializer):

	class Meta:
		object_serializer_class = LinkSerializer