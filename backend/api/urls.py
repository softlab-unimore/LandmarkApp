from django.urls import path

from .views import *

urlpatterns = [
    path('load-file', File.as_view()),
    path('explain', Explain.as_view()),
    # path('column-data', HandleColumnData.as_view()),
    path('get-elements', Elements.as_view()),
    path('adversarial', Adversarial.as_view())

]
