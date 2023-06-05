import os
import json

folder_path = r'C:\Users\pbrha\Desktop\cse115\GitHub\academic-planner\backend\courses'
combined_courses = {}

for filename in os.listdir(folder_path):
    if filename.endswith('.json'):
        file_path = os.path.join(folder_path, filename)
        with open(file_path, 'r') as file:
            data = json.load(file)
            major = os.path.splitext(filename)[0]
            combined_courses[major] = data

output_path = r'C:\Users\pbrha\Desktop\cse115\GitHub\academic-planner\backend\courses\output_file.json'
with open(output_path, 'w') as outfile:
    json.dump(combined_courses, outfile, indent=4)
