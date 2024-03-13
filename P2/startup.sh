#!/bin/bash

cd OneOnOne

# create the virtual environment
python3 -m venv .venv

# activate the virtual environment
source .venv/bin/activate

# install required Python packages
pip install -r requirements.txt

# navigate to project directory
cd appointify

# apply migrations
python3 manage.py makemigrations
python3 manage.py migrate

# additional packages