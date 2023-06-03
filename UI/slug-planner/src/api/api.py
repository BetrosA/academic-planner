import json
import flask 
from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import re
from planner import incrementQuarter, addCourse, create_planner
# run with: flask --app api run

# Initialize Flask app
app = Flask(__name__)

# Use a service account
cred = credentials.Certificate('../academicplanner-c85a5-firebase-adminsdk-9k0uz-9f74e1cfe9.json')
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

@app.get('/planner/<major>')  
def planner_get(major):  
    ref = db.reference('courses')
    courses = ref.get()

    ref2 = db.reference('majors')
    req = ref2.get()

    reqIndex = -1
    for i, reqName in enumerate(req):
        if reqName['majorname'] == major:
            reqIndex = i
            break

    if reqIndex >= 0:
        simplePlanner = {}

        # each require course in major
        for reqCourse in req[reqIndex]["requiredcourses"]:
            splitReqCourse = reqCourse.split(" ")

            # each course in total courses (fix once courses are categorized by subject)
            for course in courses:
                if (course):
                    # ex: split CSE 30 Programming Abstractions... -> ["CSE", "30", "Programming", "Abstractions"]
                    splitCourseName = course['coursename'].split(" ")

                    # major required course matches course listing
                    # course name matches required course (later add options ex: CSE 112 or 114A)
                    if splitReqCourse[0] == splitCourseName[0] and splitReqCourse[1] == splitCourseName[1]:

                        # if required course has not already been added to list
                        if reqCourse not in simplePlanner:

                            # no prereqs for course, just add
                            if course['extrarequirements'] == "none":
                                    simplePlanner[reqCourse] = []
                                    
                            # course contains prereqs
                            else:
                                # splits prereqs into list of courses
                                prereqs= re.findall("[A-Z]+ [0-9]+[A-z]?", course['extrarequirements'][30:])

                                simplePlanner[reqCourse] = []
                                # for each prereq, add if in required courses list (meaning student wont take prereqs that
                                # don't count as a required course for major)

                                for prereq in prereqs:
                                    if prereq in req[reqIndex]["requiredcourses"]:
                                        simplePlanner[reqCourse].append(prereq)
                
        print("Prereqs:")
        print(simplePlanner)
        planner = create_planner(simplePlanner)
        print("4-year Planner:")
        
        for q in planner:
            print(q)
        response = jsonify(planner)  
        response.headers.add('Access-Control-Allow-Origin', '*')  
        return response  

    return "Major not found", 404

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
