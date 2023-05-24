# whenever the course.json file is updated, run this script to update the database
# this script is not used in the actual app, it is only used to update the database

import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Initialize Firebase
cred = credentials.Certificate('https://console.firebase.google.com/u/0/project/academicplanner-c85a5/database/academicplanner-c85a5-default-rtdb/data/~2F') # replace with your file path
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://console.firebase.google.com/u/0/project/academicplanner-c85a5/database/academicplanner-c85a5-default-rtdb/data/~2F' # replace with your real database URL
})

# Read the JSON file
with open('../../../backend/courses.json', 'r') as f: 
    courses = json.load(f)

# Get a reference to the database
ref = db.reference('/')

# Push the data to Firebase
ref.set({
    'courses': courses
})
