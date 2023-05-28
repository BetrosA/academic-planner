import flask 
from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import re

# Initialize Flask app
app = Flask(__name__)

# Use a service account
cred = credentials.Certificate('academicplanner-c85a5-firebase-adminsdk-9k0uz-9f74e1cfe9.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://academicplanner-c85a5-default-rtdb.firebaseio.com'
})

# remove once added to database
req =  [
    {
        "majorname": "Computer Science B.S.",
        "requiredcourses":[
            "CSE 12",
            "CSE 16",
            "CSE 20",
            "CSE 30",
            "CSE 13S",
            "MATH 19A and MATH 19B or MATH 20A and MATH 20B",
            "AM 10 or MATH 21",
            "AM 30 or MATH 23A",
            "ECE 30",
            "CSE 101",
            "CSE 102",
            "CSE 103",
            "CSE 120",
            "CSE 130",
            "CSE 112 or 114A",
            "STAT 131 or CSE 107"
        ],
        "electives":[
            "Four courses must be completed from the list below . At least one course must be a computer science and engineering course. At most two courses can be from applied mathematics, statistics or mathematics, of which at most one may be substituted with two physics classes, chosen from the following list of class pairs: PHYS 6A and PHYS 6C, PHYS 6A and PHYS 6B, PHYS 5A and PHYS 5C, PHYS 5A and PHYS 5B. Any laboratories required or recommended by the Physics Department associated with these classes are not part of the computer science B.S. major requirements.",
            "Any CSE course with a number below 170, or between 180 and 189, except for the DC courses CSE 115A and CSE 185E/CSE 185S.",
            [
                "AM 114",
                "AM 147",
                "CMPM 120",
                "CMPM 131",
                "CMPM 146",
                "CMPM 163",
                "CMPM 164",
                "CMPM 164L",
                "CMPM 171",
                "CMPM 172",
                "CSE 195",
                "MATH 110",
                "MATH 115",
                "MATH 116",
                "MATH 117",
                "MATH 118",
                "MATH 134",
                "MATH 145",
                "MATH 145L",
                "MATH 148",
                "MATH 160",
                "MATH 161",
                "STAT 132"
            ]
        ],
        "dcrequirement":[
            "CSE 115A",
            "CSE 185S",
            "CSE 195"
        ]
    }
]

@app.get('/departments')  
def departments_get():  
    ref = db.reference('departments')
    departments = ref.get()
    response = jsonify(departments)  
    response.headers.add('Access-Control-Allow-Origin', '*')  
    return response  

@app.get('/courses/<division>')  
def courses_get(division):  
    ref = db.reference('courses').child(division)
    courses = ref.get()
    course_list = [course["coursename"] for course in courses.values()]
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

def addCourse(course, planner, quarter, year):

    # if current quarter has 2 courses already in, check others
    if len(planner[year][quarter]) == 2 :
        while len(planner[year][quarter]) == 2:
            if quarter == "Spring":
                if year == 3: break
                year += 1
                quarter = "Fall"
            elif quarter == "Fall":
                quarter = "Winter"
            else:
                quarter = "Spring"
    planner[year][quarter].append(course)
    return planner, quarter, year

@app.get('/planner/<major>')  
def planner_get(major):  
    ref = db.reference('courses')
    courses = ref.get()

    reqIndex = -1
    for i, reqName in enumerate(req):
        if reqName['majorname'] == major:
            reqIndex = i
            break

    if reqIndex >= 0:
        planner = [{"Fall": [], "Winter": [], "Spring": []}, {"Fall": [], "Winter": [], "Spring": []},
                   {"Fall": [], "Winter": [], "Spring": []}, {"Fall": [], "Winter": [], "Spring": []}]
        simplePlanner = []
        year = 0
        quarter = "Fall"
        # each require course in major
        for reqCourse in req[reqIndex]["requiredcourses"]:
            splitReqCourse = reqCourse.split(" ")

            # each course in total courses (fix once courses are categorized by subject)
            for course in courses:

                # ex: split CSE 30 Programming Abstractions... -> ["CSE", "30", "Programming", "Abstractions"]
                splitCourseName = course['coursename'].split(" ")

                # major required course matches course listing
                # course name matches required course (later add options ex: CSE 112 or 114A)
                if splitReqCourse[0] == splitCourseName[0] and splitReqCourse[1] == splitCourseName[1]:
                    print(course['coursename'])
                    print('---------')

                    # if required course has not already been added to list
                    if reqCourse not in simplePlanner:

                        # no prereqs for course, just add
                        if course['extrarequirements'] == "none":
                                simplePlanner.append(reqCourse)
                                # attempt to add earlier
                                planner, quarter, year = addCourse(reqCourse, planner, "Fall", year)
                                
                        # course contains prereqs
                        else:
                            # splits prereqs into list of courses
                            prereqs= re.findall("[A-Z]+ [0-9]+[A-z]?", course['extrarequirements'][30:])
                            print(prereqs)

                            # for each prereq, add if in required courses list (meaning student wont take prereqs that
                            # don't count as a required course for major)
                            for prereq in prereqs:
                                if prereq not in simplePlanner:
                                    if prereq in req[reqIndex]["requiredcourses"]:
                                        simplePlanner.append(prereq)
                                        planner, quarter, year = addCourse(prereq, planner, quarter, year)

                            # finally add req course into list
                            simplePlanner.append(reqCourse)
                            planner, quarter, year = addCourse(reqCourse, planner, quarter, year)
                
        print("Simple planner:")
        print(simplePlanner)
        print("real planner:")
        for q in planner:
            print(q)
        response = jsonify(planner)  
        response.headers.add('Access-Control-Allow-Origin', '*')  
        return response  

    return "Major not found", 404

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