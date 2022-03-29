# Polaroidizer

## Introduction

Polaroidizer is a simple web app that takes advantage of Spotify APIs in order to generate Pinterest-style polaroid posters, quickly and efficiently.

## Prerequisites:
In the root directory run:

    pip install -r requirements.txt

Beyond that, npm package manager is necessary to run the javascript libraries:

    npm init -y
    npm i webpack webpack-cli --save-dev
    npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
    npm i react react-dom --save-dev
    npm install @material-ui/core
    npm install @babel/plugin-proposal-class-properties
    npm install react-router-dom
    npm install @material-ui/icons

    npm run dev

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
