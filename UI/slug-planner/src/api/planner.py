

def incrementQuarter(planner, quarter, year):
    if quarter == "Spring":
        if year == 3: return planner, quarter, year
        year += 1
        quarter = "Fall"
    elif quarter == "Fall":
        quarter = "Winter"
    else:
        quarter = "Spring"
    return planner, quarter, year

def addCourse(course, planner, quarter, year):

    # if current quarter has 2 courses already in, check others
    if len(planner[year][quarter]) == 2 :
        while len(planner[year][quarter]) == 2:
            planner, quarter, year = incrementQuarter(planner, quarter, year)
    planner[year][quarter].append(course)
    return planner, quarter, year

def create_planner(simplePlanner):
    
    planner = [{"Fall": [], "Winter": [], "Spring": []}, {"Fall": [], "Winter": [], "Spring": []},
                   {"Fall": [], "Winter": [], "Spring": []}, {"Fall": [], "Winter": [], "Spring": []}]
    year = 0
    quarter = "Fall"
    coursesToRemove = []
    # empties simple planner until all prereqs are met and planner is filled
    while simplePlanner:
        for course, prereqs in simplePlanner.items():

            # no prereqs, just add to planner
            if len(prereqs) == 0:
                planner, quarter, year = addCourse(course, planner, quarter, year)
                coursesToRemove.append(course)

        # increment quarter, to order classes based on prereqs
        planner, quarter, year = incrementQuarter(planner, quarter, year)

        # mark remove prereqs from any classes that have been met so they can be placed next in the planner
        if len(coursesToRemove) > 0:
            for courseprereq in coursesToRemove:
                for name, _ in simplePlanner.items():
                    if courseprereq in simplePlanner[name]:
                        simplePlanner[name].remove(courseprereq)
                del simplePlanner[courseprereq]
            coursesToRemove = []
    return planner