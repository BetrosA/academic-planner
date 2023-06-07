# whenever the course.json file is updated, run this script to update the database
# this script is not used in the actual app, it is only used to update the database

import os
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Initialize Firebase
cred = credentials.Certificate(r'C:\Users\pbrha\Desktop\cse115\academic-planner\UI\slug-planner\src\academicplanner-c85a5-firebase-adminsdk-9k0uz-9f74e1cfe9.json')  # Replace with your own service account key
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://academicplanner-c85a5-default-rtdb.firebaseio.com/'
})

# Function to upload a JSON file to Firebase
def upload_json_to_firebase(file_path, database_ref):
    with open(file_path, 'r') as f:
        data = json.load(f)
        filename = os.path.basename(file_path).split('.')[0]
        database_ref.child(filename).set(data)
    print(f'Uploaded {file_path} to Firebase successfully.')


# Path to the folder containing JSON files
folder_path = r'C:\Users\pbrha\Desktop\cse115\academic-planner\backend\courses'  # Replace with the path to your JSON folder

# Reference to the Firebase database
database_ref = db.reference('/')

# Iterate over each file in the folder
for filename in os.listdir(folder_path):
    if filename.endswith('.json'):
        file_path = os.path.join(folder_path, filename)
        upload_json_to_firebase(file_path, database_ref)

# Cleanup Firebase resources
firebase_admin.delete_app(firebase_admin.get_app())
