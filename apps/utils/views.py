from django.conf import settings
from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.utils import simplejson as json
from django.http import HttpResponseRedirect
from django.views.generic import FormView
from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm
from django.views.generic import TemplateView
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from braces.views import AnonymousRequiredMixin, LoginRequiredMixin, AjaxResponseMixin

from apps.links.models import Link
from http import JSONResponse

# Create your views here.

class LoginView(AnonymousRequiredMixin, FormView):
    form_class = AuthenticationForm
    template_name = 'login/login.html'
    authenticated_redirect_url = u"/"

    def dispatch(self, *args, **kwargs):
        return super(LoginView, self).dispatch(*args, **kwargs)
 
    def form_valid(self, form):
        login(self.request, form.get_user())
        if self.request.is_ajax():
        	context = {
        		'redirect_url': reverse('home'),
        	}
        	return JSONResponse(context, status=200)
        return HttpResponseRedirect(reverse('home'))

    def form_invalid(self, form):
        self.set_test_cookie()
        if self.request.is_ajax():
        	return JSONResponse(form.errors, status=400)
        return super(LoginView, self).form_invalid(form)
 
    def set_test_cookie(self):
        self.request.session.set_test_cookie()
 
    def check_and_delete_test_cookie(self):
        if self.request.session.test_cookie_worked():
            self.request.session.delete_test_cookie()
            return True
        return False
 
    def get(self, request, *args, **kwargs):
        self.set_test_cookie()
        return super(LoginView, self).get(request, *args, **kwargs)
 
    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        if form.is_valid():
            self.check_and_delete_test_cookie()
            return self.form_valid(form)
        else:
            self.set_test_cookie()
            return self.form_invalid(form)

class HomeView(LoginRequiredMixin, TemplateView):
    template_name = 'home/home.html'

class TestView(LoginRequiredMixin, TemplateView):
    template_name = 'test/test.html'

class MVCView(LoginRequiredMixin, TemplateView):
    template_name = 'test/mvc.html'