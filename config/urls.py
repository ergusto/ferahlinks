from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from rest_framework.routers import DefaultRouter

from apps.utils.views import HomeView, LoginView, TestView, MVCView
from apps.links.api.views import LinkViewSet
from apps.comments.api.views import CommentViewSet

router = DefaultRouter()
router.register(r'links', LinkViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'ferahlinks.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    url(r'^$', HomeView.as_view(), name='home'),
    url(r'^test/$', TestView.as_view(), name='test'),
    url(r'^mvc/$', MVCView.as_view(), name='mvc'),

    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/login/'}, name='logout'),
)
