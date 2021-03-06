# Generated by Django 3.2.5 on 2021-10-25 17:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ColumnData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('left', models.CharField(max_length=100)),
                ('right', models.CharField(max_length=100)),
                ('label', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('model', 'model'), ('model_state', 'model_state'), ('dataset', 'dataset')], default='dataset', max_length=32)),
                ('file', models.FileField(upload_to='files/')),
            ],
        ),
        migrations.CreateModel(
            name='IdValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=10000)),
                ('left_prefix', models.CharField(default='no', max_length=100)),
                ('right_prefix', models.CharField(default='no', max_length=100)),
                ('label', models.CharField(default='no', max_length=100)),
                ('model_name', models.CharField(default='no', max_length=100)),
                ('dataset_name', models.CharField(default='no', max_length=100)),
            ],
        ),
    ]
