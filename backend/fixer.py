yo = """


CMPM 121	Game Technologies	5
CMPM 131	User Experience for Interactive Media	5
CMPM 132	Interaction Design Studio	5
CMPM 146	Game AI	5
CMPM 147	Generative Design	5
CMPM 148	Interactive Storytelling	5
CMPM 150	Creating Digital Audio	5
CMPM 151	Algorithmic Music for Games	5
CMPM 152	Musical Data	5
CMPM 163	Game Graphics and Real-Time Rendering	5
CMPM 164	Game Engines	5
CMPM 169	Creative Coding	5
CMPM 177	Creative Strategies for Designing Interactive Media	5
CMPM 178	Human-Centered Design Research	5
CMPM 179	Game Design Practicum	5
CSE 102	Introduction to Analysis of Algorithms	5
CSE 103	Computational Models	5
CSE 104	Computability and Computational Complexity	5
CSE 110A	Fundamentals of Compiler Design I	5
CSE 110B	Fundamentals of Compiler Design II	5
CSE 113	Parallel and Concurrent Programming	5
CSE 112	Comparative Programming Languages	5
CSE 115A	Introduction to Software Engineering	5
CSE 115B	Software Design Project	5
CSE 115C	Software Design Project II	5
CSE 118	Mobile Applications	5
CSE 119	Software for Society	5
CSE 120	Computer Architecture	5
CSE 132	Computer Security	5
CSE 138	Distributed Systems	5
CSE 140	Artificial Intelligence	5
CSE 142	Machine Learning	5
CSE 150	Introduction to Computer Networks	7
CSE 160	Introduction to Computer Graphics	7
CSE 161	Introduction to Data Visualization	5
CSE 162	Advanced Computer Graphics and Animation	5
CSE 163	Data Programming for Visualization	5
CSE 180	Database Systems I	5
CSE 181	Database Systems II	5
CSE 183	Web Applications	5
CSE 184	Data Wrangling and Web Scraping	5
ECON 166A	Game Theory and Applications I	5
ECE 118	Introduction to Mechatronics	10
"""

counter = 0;
placeholder = ""
for i in yo.splitlines():
    placeholder+= "\""
    for j in i.split()[:2]:
        if (counter == 1):
            placeholder += " "
        placeholder += j
        counter += 1;
    counter = 0;
    placeholder+= "\",\n"

print(placeholder)

str = "Hi my name is"
print(str.split()[:2])
