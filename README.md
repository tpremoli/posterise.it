# Posteriser

## Introduction

Posteriser is a simple web app that takes advantage of Spotify APIs in order to generate Pinterest-style album posters, quickly and efficiently.

## Prerequisites:
In the root directory (/Spotifier) run:

    pip install -r requirements.txt

Beyond that, npm package manager is necessary to run the javascript libraries.
In /Spotifier/Frontend:

    npm i webpack webpack-cli --save-dev
    npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
    npm i react react-dom --save-dev
    npm install react-router-dom
    npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
    npm install @babel/plugin-proposal-class-properties
    npm install --save html2canvas

    <!-- npm install @material-ui/core@next -->
    <!-- npm install @material-ui/lab@next -->
    <!-- npm install dom-to-image -->


To actually run it:

    npm run dev

## Getting Started

Make sure you are in the Posteriser directory:

    cd Posteriser
    
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
