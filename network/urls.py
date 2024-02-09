
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("all_post/<int:id>", views.all_post, name="all_post"),
    path("profile/<str:name>", views.profile, name="profile"),
    path("user/<int:id>", views.user, name="user")
]
