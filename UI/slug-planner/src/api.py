from flask import Flask
from flask import request


app = Flask(__name__)

# run with: flask --app api run

departments = {
  "Arts": ["Art Studio BA"],
  "Computer Science and Engineering": ["Electrical Engineering: B.S.", "Robotics Engineering: B.S."],
  "Electrical and Computer Engineering": ["Computer Engineering B.S.", "Computer Science: B.S.", "Computer Science: B.A."]}

@app.get('/departments')
def login_get():
    return departments