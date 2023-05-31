yo = """

ART 20G	Introduction to Print Media and Drawing	5
ART 20H	Introduction to Sculpture and Public Art	5
ART 20I	Introduction to Photography	5
ART 20J	Introduction to Drawing and Painting	5
ART 20K	Introduction to New Media and Digital Artmaking	5
ART 20L
ART 80T
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