from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Follow(models.Model):
    main_user = models.ForeignKey(User, on_delete=models.CASCADE)
    following = models.ManyToManyField(User, related_name="following", blank=True)
    followers = models.ManyToManyField(User, related_name="followers", blank=True)

    def __str__(self):
        return self.main_user.username
    
class Post(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField(max_length=400)
    date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="num_likes",blank=True)
    username = models.TextField()

    def __str__(self):
        return f"ID #{self.pk}: Posted by {self.username} on {self.date}"