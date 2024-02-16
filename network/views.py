from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.serializers import serialize
import json

from .models import User, Post, Follow

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
            p1 = Follow(main_user=user)
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
    same_user = False
    is_follower = False
    
    if request.method == "POST": 
        logged_user = User.objects.get(pk=request.user.id)
        profile_user = User.objects.get(username=name)
        # add follower to profile user
        profile_user_follower = Follow.objects.get(main_user=profile_user)
        profile_user_follower.followers.add(logged_user)
        # add following to logged user
        log_user_following = Follow.objects.get(main_user=logged_user)
        log_user_following.following.add(profile_user)


    user = User.objects.get(username=name)
    follow = Follow.objects.get(main_user = user)
    print(f"Followers are {follow.followers.all()}")
    print(f"following are {follow.following.all()}")
    if (user.id == request.user.id):
        same_user = True
    
    #Check if user is a follower
    if (follow.followers.filter(pk=request.user.id).exists()):
        is_follower = True

    return render(request, "network/profile.html", {
        "user": user,
        "following": follow.following.all(),
        "follower": follow.followers.all(),
        "same_user": same_user,
        "is_follower": is_follower
    })

def following(request):
    return render (request, "network/following.html")

#APIs
def all_post(request, id):
    if(id == "following"):
        following_users = Follow.objects.get(main_user=request.user.id)
        following_list = following_users.following.all()
        print(f"is following {following_list}")
        data = User.objects.none()
        for following_user in following_list:
            if (following_list.count() > 1):
                result = Post.objects.filter(user=following_user.id)
                data = data | result
            #data.append(Post.objects.filter(user=following_user.id))
 
    elif (int(id) == 0):
        data = Post.objects.all()
    else:
        user = User.objects.get(pk=int(id))
        data = Post.objects.filter(user=user)
    print(f"Data is {data}")
    posts = serialize("json", data, fields=("user","content", "date", "likes", "username"))

    return HttpResponse(posts, content_type="application/json")

def user(request, id):
 


    user = User.objects.get(pk=id)
    follows = Follow.objects.get(main_user=user)
    following = []
    followers = []

    for follow in follows.following.all():
        following.append(follow)
    for follow in follows.followers.all():
        followers.append(follow)
    response = {
        "user":  user.username,
        "following": following,
        "followers": followers 
    }
    return JsonResponse(response)