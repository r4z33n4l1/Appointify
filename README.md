# Appointify
## Landing page
![image](https://github.com/r4z33n4l1/Appointify/assets/104722753/e1040812-27ee-43e4-a39d-ce8d0a32977a)
## Signup page
![image](https://github.com/r4z33n4l1/Appointify/assets/104722753/c29212d3-bad2-47c3-9353-d3be37607b06)
## Login
![image](https://github.com/r4z33n4l1/Appointify/assets/104722753/56da1a9d-43d8-48da-9a5b-bb314f50d4e0)
## Dashboard
![image](https://github.com/r4z33n4l1/Appointify/assets/104722753/a2bbf225-1ff1-448a-ac3d-4fb4492f607d)
## Calendars
![image](https://github.com/r4z33n4l1/Appointify/assets/104722753/22411fa2-183e-41da-a7ca-0441bf2b425b)
## Contacts
![image](https://github.com/r4z33n4l1/Appointify/assets/104722753/cbd433b4-4889-4440-a945-6cb180fe55c4)

# Setup
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
