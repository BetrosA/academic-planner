yo = """


HAVC 30-HAVC 46, HAVC 48, HAVC 85, HAVC 133A-HAVC 143B, HAVC 143D-HAVC 143G, HAVC 157B-HAVC 157D, HAVC 186, HAVC 190O-HAVC 190S, HAVC 191B-HAVC 191N, HAVC 191P-HAVC 191S.
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
