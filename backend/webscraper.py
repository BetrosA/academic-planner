from selenium import webdriver
from selenium.webdriver.common.by import By
import json

class UCSC_Class:
    def __init__(self, name):
        self.coursename = name
        self.description = "none"
        self.genEd = "none"
        self.credithours = "none"
        self.instructor = "none"
        self.extrarequirements = "none"
        self.quarteroffered = "none"
        self.fulldesc = ""


def tostr(x):
    y = "";
    for i in x:
        y += i.text + "\n";
    return y;


def main():
    courseurls = [
            
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ACEN-Academic-English",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/AM-Applied-Mathematics",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ANTH-Anthropology",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/APLX-Applied-Linguistics",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ARBC-Arabic",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ART-Art",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ARTG-Art-and-Design-Games-and-Playable-Media",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ASTR-Astronomy-and-Astrophysics",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/BIOC-Biochemistry-and-Molecular-Biology",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/BIOE-Biology-Ecology-and-Evolutionary",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/BIOL-Biology-Molecular-Cell-and-Developmental",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/BME-Biomolecular-Engineering",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CHEM-Chemistry-and-Biochemistry",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CHIN-Chinese",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CLNI-College-Nine",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CLST-Classical-Studies",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CMMU-Community-Studies",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CMPM-Computational-Media",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/COWL-Cowell-College",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CRES-Critical-Race-and-Ethnic-Studies",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CRSN-Carson-College",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CRWN-Crown-College",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CSE-Computer-Science-and-Engineering",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/CSP-Coastal-Science-and-Policy",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/DANM-Digital-Arts-and-New-Media",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/EART-Earth-Sciences",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ECE-Electrical-and-Computer-Engineering",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ECON-Economics",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/EDUC-Education",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ENVS-Environmental-Studies",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ESCI-Environmental-Sciences",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/FILM-Film-and-Digital-Media",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/FMST-Feminist-Studies",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/FREN-French",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/GAME-Games-and-Playable-Media",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/GCH-Global-Community-Health",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/GERM-German",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/GRAD-Graduate",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/GREE-Greek",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/HAVC-History-of-Art-and-Visual-Culture",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/HEBR-Hebrew",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/HISC-History-of-Consciousness",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/HIS-History",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/HCI-Human-Computer-Interaction",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/ITAL-Italian",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/JAPN-Japanese",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/JRLC-John-R-Lewis-College",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/JWST-Jewish-Studies",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/KRSG-Kresge-College",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/LAAD-Languages",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/LALS-Latin-American-and-Latino-Studies",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/LATN-Latin",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/LGST-Legal-Studies",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/LING-Linguistics",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/LIT-Literature",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/MATH-Mathematics",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/MERR-Merrill-College",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/METX-Microbiology-and-Environmental-Toxicology",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/MUSC-Music",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/NLP-Natural-Language-Processing",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/OAKS-Oakes-College",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/OCEA-Ocean-Sciences",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/PBS-Physical-Biological-Sciences",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/PERS-Persian",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/PHIL-Philosophy",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/PHYE-Physical-Education",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/PHYS-Physics",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/POLI-Politics",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/PORT-Portuguese",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/PRTR-Porter-College",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/PSYC-Psychology",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/PUNJ-Punjabi",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/RUSS-Russian",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/SCIC-Science-Communication",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/SOCD-Social-Documentation",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/SOCY-Sociology",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/SPAN-Spanish",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/SPHS-Spanish-for-Heritage-Speakers",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/STAT-Statistics",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/STEV-Stevenson-College",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/THEA-Theater-Arts",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/TIM-Technology-Information-Management",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/UCDC-UCDC",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/WRIT-Writing",
            "https://ucsc.smartcatalogiq.com/current/General-Catalog/Courses/YIDD-Yiddish"
        ]
    
    for i in range(len(courseurls)):

        # Grab URL
        url = courseurls[i]
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
        courseExtraElement = courseListElement.find_elements(By.CLASS_NAME, 'extraFields')
        courseGenEdElement = courseListElement.find_elements(By.CLASS_NAME, 'genEd')

        # Convert webelements to strings
        descstr = tostr(courseDescriptionElement)
        credstr = tostr(courseCreditElement);
        instructorstr = tostr(courseIntructorElement);
        quartstr = tostr(courseQuarterElement);
        extrastr = tostr(courseExtraElement);
        genedstr = tostr(courseGenEdElement);

        # print(extrastr)

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
            # Assign description of class
            if 0 <= classListCounter < len(classList):
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
                if line in genedstr:
                    course.genEd = line;
                if line in extrastr:
                    course.extrarequirements = line;
        

        # Format Classes and write to JSON
        classesformatted = []
        for course in classList:
            classesformatted.append({"coursename": course.coursename, "description": course.description, "genEd": course.genEd, "credithours": course.credithours, 
                                    "instructor": course.instructor, "extrarequirements": course.extrarequirements, "quarteroffered": course.quarteroffered, "fulldesc": course.fulldesc})
            
        path = "courses\{}courses.json".format(courseurls[i][64:].partition("-")[0])
        y = json.dumps(classesformatted, indent=4)
        with open (path, "w") as outfile:
            outfile.write(y)


if __name__ == "__main__":
    main();