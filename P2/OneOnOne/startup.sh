#!/bin/bash

# create the virtual environment
python3 -m venv .venv

# activate the virtual environment
source .venv/bin/activate

# install required Python packages
pip install -r requirements.txt

# navigate to project directory
cd appointify

# apply migrations
python manage.py makemigrations
python manage.py migrate

# additional packages