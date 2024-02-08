from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.core.serializers import serialize

from .models import User, Post, Follows

def index(request):
    if request.method == "POST": 
        new_post = Post(
            user = User.objects.get(id=request.user.id),
            content = request.POST["new-post-content"],
            likes = 0,
            username = request.user.username
        ) 
        new_post.save()

    all_post = Post.objects.all()

    return render(request, "network/index.html", {
        "all_post": all_post 
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            p1 = Follows(main_user=user)
            p1.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
def profile(request, name):
    user = User.objects.get(username=name)
    return render(request, "network/profile.html", {
        "user": user
    })

def all_post(request):
    data = Post.objects.all()
    posts = serialize("json", data, fields=("user","content", "date", "likes", "username"))
    return HttpResponse(posts, content_type="application/json")

def user(request, id):
    data = User.objects.get(pk=id)
    post = serialize("json", data, fields=("user", "following", "followers"))
    return HttpResponse(post, content_type = "application/json")