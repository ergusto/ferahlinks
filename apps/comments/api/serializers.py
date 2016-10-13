from rest_framework import serializers
from rest_framework.pagination import PaginationSerializer

from apps.comments.models import Comment

class CommentSerializer(serializers.ModelSerializer):
	user = serializers.Field(source='user.username')

	class Meta:
		model = Comment
		fields = ('id', 'user', 'link', 'text', 'date')
		partial = True

class PaginatedCommentSerializer(PaginationSerializer):

	class Meta:
		object_serializer_class = CommentSerializer