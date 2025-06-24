from django.urls import path

from .views import LoginView, LogoutView, RegisterView, StatusView

urlpatterns = [
    path("login/", LoginView.as_view(), name="api-login"),
    path("logout/", LogoutView.as_view()),
    path("status/", StatusView.as_view()),
    path("register/", RegisterView.as_view(), name="api-register"),
]
