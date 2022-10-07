# Generated by Django 3.2.12 on 2022-03-29 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Polaroid',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('track_uri', models.CharField(max_length=50, unique=True)),
                ('track_name', models.CharField(max_length=50)),
                ('track_artist', models.CharField(max_length=50)),
                ('track_length', models.TimeField()),
            ],
        ),
    ]