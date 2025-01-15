#!/bin/bash

# Wait for database to be ready
/wait-for-it.sh db:5432 -t 30

# Apply database migrations
python src/manage.py migrate

# Start server
python src/manage.py runserver 0.0.0.0:8000 