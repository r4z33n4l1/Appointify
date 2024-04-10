# 1on1-full

## Setup -
## Backend
- cd into backend directory
- make an .env with the key `SECRET_KEY` under appointify/appointify
- create and activate a venv
- install the required packages
- cd into appointify
- run `python .\manage.py makemigrations notify calendars contacts events`
- run `python .\manage.py migrate`
- run `python manage.py runserver`

## Frontend
- cd into frontend directory
- run `npm install`
- run `npm run dev`
