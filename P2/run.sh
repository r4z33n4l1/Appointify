#!/bin/bash

# navigate to the project directory
cd OneOnOne

# activate the virtual environment
source .venv/bin/activate

cd appointify

# start the Django server
python manage.py runserver
