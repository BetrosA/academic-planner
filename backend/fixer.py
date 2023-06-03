yo = """




BIOL 130L	Human Physiology Laboratory	2
BIOL 189W	Disciplinary Communication: Human Biology	3

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
