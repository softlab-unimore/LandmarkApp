from django.db import models


class Document(models.Model):
    """Document object"""
    CHOICES = ['model', 'model_state', 'dataset']
    type = models.CharField(
        max_length=32,
        choices=[(x, x) for x in CHOICES],
        default='dataset',
    )
    # filename = models.CharField(max_length=256)
    file = models.FileField(upload_to='files/')

    def delete(self, using=None, keep_parents=False):
        self.file.storage.delete(self.file.name)
        super().delete()

    def __str__(self):
        return self.file.name + '---' + self.type


class IdValue(models.Model):
    value = models.CharField(max_length=10000)
    left = models.CharField(max_length=100, default='no')
    right = models.CharField(max_length=100, default='no')
    label = models.CharField(max_length=100, default='no')
    model_state = models.CharField(max_length=100, default='no')
    dataset_name = models.CharField(max_length=100, default='no')


class ColumnData(models.Model):
    left = models.CharField(max_length=100)
    right = models.CharField(max_length=100)
    label = models.CharField(max_length=100)
