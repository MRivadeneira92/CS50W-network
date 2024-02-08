from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Follows(models.Model):
    main_user = models.ForeignKey(User, on_delete=models.CASCADE)
    following = models.ManyToManyField(User, related_name="following")
    followers = models.ManyToManyField(User, related_name="followers")
    
class Post(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField(max_length=400)
    date = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField()
    username = models.TextField()