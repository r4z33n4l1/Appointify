
# Getting Started 


## 1. Create a Virtual Environment



```bash
python3 -m venv .venv
```

On Windows, run:

```cmd
python -m venv .venv
```

<!-- add an important note -->

### Important - 
Make sure that whatever the name of the virtual environment is, it is added to `.gitignore` file.

## 2. Activate Virtual Environment

For Unix or macOS, run:

```bash
source .venv/bin/activate
```

For Windows, run:

```cmd
.venv\Scripts\activate
```

## 3. Install Required Packages

Once the virtual environment is activated, you can install the required packages. Ensure you have a `requirements.txt` file at the root of your project which lists all of the necessary packages.

To install them, run:

```bash
pip install -r requirements.txt
```

This command works across all operating systems.

## 4. Navigate to the Project Directory

Change to the project directory using:

```bash
cd appointify
```

Make sure that this directory has the `manage.py` script.

## 5. Start the Django Development Server

To start the server, run:

```bash
python manage.py runserver
```

## 6. Database migrations

If first time running the project run the  following commands to apply the migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

------------------

<!-- add space -->


# Using Rest framework

## Making Authenticated Requests with Django REST Framework

### Getting the Access Token

Before you can make authenticated requests, you need an access token. Typically, you obtain this token by logging in through an endpoint provided by DRF. The common endpoint for this is:

```
/auth/login/
```

To log in and get your token, you would send a POST request with your `username` and `password`. For example, the json would be:

```json
{
  "username": "your-username",
  "password": "your-password"
}
```

In response, you'll receive a JSON object with your access token:

```json
{
  "access": "your-access-token",
  "refresh": "your-refresh-token"
}
```

### Using the Access Token

Once you have the token, you need to include it in the `Authorization` header of your HTTP requests to access protected views.

For example, accessing user details would look like this:

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_leaderboard(request):
    # Your view logic here
    # Getting the associated user
    user = request.user
    username = user.username
    return Response({"username": username})
```


### Function-Based Views

For function-based views that require authentication, you decorate the view with `@permission_classes([IsAuthenticated])`. Here's an example:

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def my_view(request):
    # Your code here
```

### Class-Based Views

For class-based views, you set the `permission_classes` attribute in the view class:

```python
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class MyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Handle GET request
        pass

    def post(self, request):
        # Handle POST request
        pass
```

### Handling Different Request Types

In class-based views, you can handle different HTTP methods by defining methods like `get()`, `post()`, `put()`, etc. For instance:

```python
class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        # Handle PUT request
        pass
```

Each method should correspond to an HTTP method. Within each method, you process the request and return an appropriate response using DRF's `Response` object.

### Handling Validation and Errors

If the serializer validation fails or an error occurs, you should return a response with an error status code:

```python
from rest_framework import status
from rest_framework.response import Response

def put(self, request, *args, **kwargs):
    serializer = MySerializer(data=request.data)
    if serializer.is_valid():
        # Save and return a successful response
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        # Return a response with validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

