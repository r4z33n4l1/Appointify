#!/bin/bash

# navigate to the project directory
cd appointify

# activate the virtual environment
source ../.venv/bin/activate

# start the Django server
python manage.py runserver
