
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

## Authentication + Request types
### Function-Based Views

To secure a function-based view, you can use the `@api_view` decorator along with the `@permission_classes` decorator.

Example:

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_leaderboard(request):
    # Your view logic here
```

### Class-Based Views
Example:
```python
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"username": user.username}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```