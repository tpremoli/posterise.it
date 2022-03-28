# Polaroidizer

## Introduction

Polaroidizer is a simple web app that takes advantage of Spotify APIs in order to generate Pinterest-style polaroid posters, quickly and efficiently.

## Prerequisites:
In the root directory run:

    pip install -r requirements.txt

## Getting Started

Make sure you are in the Polaroidizer directory:

    cd Polaroidizer
    
Then run:

    python manage.py makemigrations
    
Then run:

    python manage.py migrate
    
Then, to run the application:

    python manage.py runserver
    
If you lock yourself out, do:

    python manage.py axes_reset
    
To create an admin account:

    python manage.py createsuperuser
    
## Authors

- Tomas Premoli

## Publish Date

- Version 1 is currently in development.

## License

[MIT](https://choosealicense.com/licenses/mit/)

Please look in the LICENSE file for more information.
