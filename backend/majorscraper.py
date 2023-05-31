
from selenium import webdriver
from selenium.webdriver.common.by import By
import json

class Major:
    def __init__(self, name):
        self.majorname = name
        self.requiredcourses = "none"
        self.electives = "none"
        self.otherrequirements = "none"


def tostr(x):
    y = "";
    for i in x:
        y += i.text + "\n";
    return y;


def main(): 

    # Grab URL
    url = 'https://registrar.ucsc.edu/enrollment/majors-list.html'
    browser = webdriver.Chrome()
    browser.get(url)

    rows = browser.find_elements(By.XPATH,"/html/body/div[2]/div/div/div[2]/div[1]/div[2]/table/tbody/tr")
    #print(len(rows))

    majorList = list();

    for x in range(2, len(rows)):
        majorElement = browser.find_element(By.XPATH, '/html/body/div[2]/div/div/div[2]/div[1]/div[2]/table/tbody/tr['+str(x)+']')
        # print(majorElement.text)
        if (majorElement.text.partition('\n')[0] != "Combined Majors"):
            majorList.append(Major(majorElement.text.partition('\n')[0]))

    majorsFormatted = []
    for major in majorList:
        majorsFormatted.append({"majorname": major.majorname, "requiredcourses": major.requiredcourses, "electives": major.electives, "otherrequirements": major.otherrequirements})

    y = json.dumps(majorsFormatted, indent=4)
    with open ("majors.json", "w") as outfile:
        outfile.write(y)



if __name__ == "__main__":
=======
from selenium import webdriver
from selenium.webdriver.common.by import By
import json

class Major:
    def __init__(self, name):
        self.majorname = name
        self.requiredcourses = "none"
        self.electives = "none"
        self.otherrequirements = "none"


def tostr(x):
    y = "";
    for i in x:
        y += i.text + "\n";
    return y;


def main(): 

    # Grab URL
    url = 'https://registrar.ucsc.edu/enrollment/majors-list.html'
    browser = webdriver.Chrome()
    browser.get(url)

    rows = browser.find_elements(By.XPATH,"/html/body/div[2]/div/div/div[2]/div[1]/div[2]/table/tbody/tr")
    #print(len(rows))

    majorList = list();

    for x in range(2, len(rows)):
        majorElement = browser.find_element(By.XPATH, '/html/body/div[2]/div/div/div[2]/div[1]/div[2]/table/tbody/tr['+str(x)+']')
        # print(majorElement.text)
        if (majorElement.text.partition('\n')[0] != "Combined Majors"):
            majorList.append(Major(majorElement.text.partition('\n')[0]))

    majorsFormatted = []
    for major in majorList:
        majorsFormatted.append({"majorname": major.majorname, "requiredcourses": major.requiredcourses, "electives": major.electives, "otherrequirements": major.otherrequirements})

    y = json.dumps(majorsFormatted, indent=4)
    with open ("majors.json", "w") as outfile:
        outfile.write(y)



if __name__ == "__main__":

    main();