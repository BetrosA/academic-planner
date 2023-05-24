from flask import Flask, jsonify
from flask import request
import json

import flask 
from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Initialize Flask app
app = Flask(__name__)

# Use a service account
cred = credentials.Certificate('academicplanner-c85a5-firebase-adminsdk-9k0uz-9f74e1cfe9.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://academicplanner-c85a5-default-rtdb.firebaseio.com'
})

@app.get('/departments')  
def departments_get():  
    ref = db.reference('departments')
    departments = ref.get()
    response = jsonify(departments)  
    response.headers.add('Access-Control-Allow-Origin', '*')  
    return response  

@app.get('/courses/<division>')  
def courses_get(division):  
    # ref = db.reference('courses').child(division)
    ref = db.reference('courses')
    courses = ref.get()
    print(courses)
    # course_list = [course["coursename"] for course in courses.values()]
    course_list = [course["coursename"] for course in courses]
    response = jsonify(course_list)  
    response.headers.add('Access-Control-Allow-Origin', '*')  
    return response  

@app.get('/course/<courseNumber>')  
def course_get(courseNumber):  
    ref = db.reference('courses')
    courses = ref.get()
    for course in courses.values():  
        if courseNumber in course["coursename"].lower():  
            response = jsonify(course)  
            response.headers.add('Access-Control-Allow-Origin', '*')  
            return response  
    return "Course not found", 404

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)



# run with: flask --app api run

# departments = {
#   "Arts": ["Art Studio BA"],
#   "Computer Science and Engineering": ["Electrical Engineering: B.S.", "Robotics Engineering: B.S."],
#   "Electrical and Computer Engineering": ["Computer Engineering B.S.", "Computer Science: B.S.", "Computer Science: B.A."]}

# @app.get('/departments')
# def departments_get():
#     response = jsonify(departments)
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response

# # not finised, only course names
# @app.get('/courses/<division>')
# def courses_get(division):
#     #print(courses)
#     list = []
#     for course in courses:
#         list.append(course["coursename"])
#     response = jsonify(list)
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response

# @app.get('/course/<courseNumber>')
# def course_get(courseNumber):
#     print(courseNumber)
#     for course in courses:
#         if courseNumber in course["coursename"].lower():
#             response = jsonify(course)
#             response.headers.add('Access-Control-Allow-Origin', '*')
#             return response
#     return "Course not found", 404