from flask import Flask
from flask import request
import json

with open('../../../backend/courses.json', 'r') as f:
    courses = json.loads(f.read())
f.close()

app = Flask(__name__)

# run with: flask --app api run

departments = {
  "Arts": ["Art Studio BA"],
  "Computer Science and Engineering": ["Electrical Engineering: B.S.", "Robotics Engineering: B.S."],
  "Electrical and Computer Engineering": ["Computer Engineering B.S.", "Computer Science: B.S.", "Computer Science: B.A."]}

@app.get('/departments')
def departments_get():
    return departments

# not finised, only course names
@app.get('/courses/<division>')
def courses_get(division):
    #print(courses)
    list = []
    for course in courses:
        list.append(course["coursename"])
    return list

@app.get('/course/<courseNumber>')
def course_get(courseNumber):
    print(courseNumber)
    for course in courses:
        if courseNumber in course["coursename"].lower():
            return course
    return "Course not found", 404