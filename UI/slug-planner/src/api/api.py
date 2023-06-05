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

    fullCourses = []
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

            # go through each prerequisite if there are options (ex: CSE 112 or CSE 114A)
            i = 0
            while i < len(splitReqCourse):
                # each course in total courses (fix once courses are categorized by subject)
                for course in courses:
                    if (course):
                        # ex: split CSE 30 Programming Abstractions... -> ["CSE", "30", "Programming", "Abstractions"]
                        splitCourseName = course['coursename'].split(" ")

                        # major required course matches course listing
                        if splitReqCourse[i] == splitCourseName[0] and splitReqCourse[i+1] == splitCourseName[1]:
                            joinedCourse = ' '.join([splitReqCourse[i], splitReqCourse[i+1]])
                            # if required course has not already been added to list
                            if reqCourse not in simplePlanner and course['quarteroffered'] != 'none' :

                                # no prereqs for course, just add
                                if course['extrarequirements'] == "none":
                                        simplePlanner[joinedCourse] = []
                                        fullCourses.append(course)
                                # course contains prereqs
                                else:
                                    # splits prereqs into list of courses
                                    prereqs= re.findall("[A-Z]+ [0-9]+[A-z]?", course['extrarequirements'][30:])

                                    simplePlanner[joinedCourse] = []
                                    fullCourses.append(course)
                                    # for each prereq, add if in required courses list (meaning student wont take prereqs that
                                    # don't count as a required course for major)

                                    for prereq in prereqs:
                                        if prereq in req[reqIndex]["requiredcourses"]:
                                            simplePlanner[joinedCourse].append(prereq)
                i += 3
                
        print("Prereqs:")
        print(simplePlanner)
        planner = create_planner(simplePlanner)
        print("4-year Planner:")
        
        for i, q in enumerate(planner):
            for quarter, reqs in q.items():
                print(quarter + ": ")
                print("")
                for j, req in enumerate(reqs):
                    for fullCourse in fullCourses:
                        parsedCourse = re.findall("[A-Z]+ [0-9]+[A-z]?", fullCourse['coursename'])
                        if (len(parsedCourse) == 1 and parsedCourse[0] == req):
                            planner[i][quarter][j] = fullCourse
                    print(planner[i][quarter][j]['coursename'])
                print('-------------')

        response = jsonify(planner)  
        response.headers.add('Access-Control-Allow-Origin', '*')  
        return response  

    return "Major not found", 404

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)