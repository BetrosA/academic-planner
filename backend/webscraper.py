from selenium import webdriver
from selenium.webdriver.common.by import By

class UCSC_Class:
    def __init__(self, name):
        self.coursename = name
        self.description = "none"
        self.genEd = "none" # unimplemented
        self.credithours = "none"
        self.instructor = "none"
        self.requirements = "none" # unimplemented
        self.quarteroffered = "none"
        self.fulldesc = ""


def tostr(x):
    y = "";
    for i in x:
        y += i.text + "\n";
    return y;


def main():

    # Grab URL
    url = 'https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CSE-Computer-Science-and-Engineering'
    browser = webdriver.Chrome()
    browser.get(url)

    # Get webelement of the course list
    courseListElement = browser.find_element(By.CLASS_NAME, 'courselist')

    # Get webelement of all ___
    courseNameElement = courseListElement.find_elements(By.CLASS_NAME, 'course-name')
    courseDescriptionElement = courseListElement.find_elements(By.CLASS_NAME, 'desc')
    courseCreditElement = courseListElement.find_elements(By.CLASS_NAME, 'sc-credithours')
    courseIntructorElement = courseListElement.find_elements(By.CLASS_NAME, 'instructor')
    courseQuarterElement = courseListElement.find_elements(By.CLASS_NAME, 'quarter')

    # Convert webelements to strings
    descstr = tostr(courseDescriptionElement)
    credstr = tostr(courseCreditElement);
    instructorstr = tostr(courseIntructorElement);
    quartstr = tostr(courseQuarterElement);

    # List of courses
    classList = list()

    # Create a UCSC_Class for each course
    for name in courseNameElement:
        classList.append(UCSC_Class(name.text));


    # Seperate different courses by name/description
    classListCounter = -1;

    for line in courseListElement.text.splitlines():
        for course in classList:
            # If find next class move on
            if course.coursename == line:
                classListCounter += 1;
                break;
                #print(classListCounter)
                #print(line)
        # Assign description of class
        if 0 <= classListCounter < len(classList):
            #print("inside")
            #print(classList[classListCounter].coursename)
            classList[classListCounter].fulldesc += line + "\n";
    
    # Done using webelements and browser
    browser.quit();

    # Add descriptors to class
    for course in classList:
        for line in course.fulldesc.splitlines():
            if line in descstr:
                course.description = line;
            if line in credstr:
                course.credithours = line;
            if line in instructorstr:
                course.instructor = line;
            if line in quartstr:
                course.quarteroffered = line;


#    for course in classList:
#        print(course.coursename, "+", course.description);
    print(classList[91].quarteroffered)


if __name__ == "__main__":
    main();