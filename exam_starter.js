//// ACTIVITY DETAILS
//   You be using SWAPI to display some species from the Star Wars universe and the people within that species

//// DOCUMENTATION & RESOURCES
//   https://swapi.dev/documentation
//   https://blog.hubspot.com/website/api-endpoint

//// ADDITIONAL COMMENTS
//   1. It's very important that you briefly familiarize with the documentation BEFORE beginning as using the
//      documentation is a major part of this activity
//   2. Ensure that you remember to utilize your console.log to preview schemas, structures, and results
//   3. This practical should be done using **FETCHAPI** - not XMLHttpRequest or JQuery!
//   4. Good luck!




//// Begin Final Exam




/// 0. Create a class named Species based on the documentation
//  This class will need to hold a name, classification, and a list of people URLs


class Species{
    constructor(name,classification,people){
        this.name= name;
        this.classification = classification;
        this.people = people;

    }
}


/// 1. Create a class named People based on the documentation
//  This class will need to hold a name, gender, birth year, hair colour, and one more property of your choosing - 5 in total

class People{
     constructor(name, gender, birthyear, haircolour , age ){
        this.name = name;
        this.gender = gender;
        this.birthyear = birthyear;
        this.haircolour = haircolour;
        this.age = age;
     }
}


/// 2. Grab a list of Species
//  Wrap this call in a function, check the HTML for what to name this!
//  You will need to utilize createSpeciesButton() to add these to the screen for each species
//  Notice that this function is setting the click event for you

 
async function performInitialLoad() {
    try {
        const response = await fetch('https://swapi.dev/api/species/');
        const data = await response.json();
        data.results.forEach(speciesData => {
            const species = new Species(speciesData.name, speciesData.classification, speciesData.people);
            createSpeciesButton(species);
        });
    } catch (error) {
        console.error('Error fetching species:', error);
    }
}



/// 3. Create a function to sort out a way to complete the click functionality - check createSpeciesButton() for what to name this function
//  The idea is: When a user clicks on a species - use its people URLs to create and fill a list of Characters
//  Show a "people" icon beside each Character
//  Display these Characters on screen using createKeyValueSet similar to Activity #10

async function getPeople(peopleUrls) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; 

    try {
        for (const url of peopleUrls) {
            const response = await fetch(url);
            const personData = await response.json();
            const person = new People(
                personData.name,
                personData.gender,
                personData.birth_year,
                personData.hair_color,
                personData.age
            );

            const personContainer = document.createElement('div');
            personContainer.style.display = 'flex';
            personContainer.style.alignItems = 'center';
            personContainer.style.marginBottom = '10px';

            const icon = document.createElement('img');
            icon.src = './assets/people.png';
            icon.className = 'listIcon';

            personContainer.appendChild(icon);
            personContainer.appendChild(createKeyValueSet("Name", person.name));
            personContainer.appendChild(createKeyValueSet("Gender", person.gender));
            personContainer.appendChild(createKeyValueSet("Birth Year", person.birthYear));
            personContainer.appendChild(createKeyValueSet("Hair Color", person.hairColor));
            personContainer.appendChild(createKeyValueSet("age", person.age));

            resultsContainer.appendChild(personContainer);
        }
    } catch (error) {
        console.error('Error fetching people:', error);
    }
}



/// 4. Finally, ensure that only one set of people are visible at any given time






/// Finally, ensure that when a user clicks a species button only one set of results are visible at a time






//// Complete!




/*  !!!DO NOT MAKE ANY CHANGES TO THESE FUNCTIONS!!!  */



//  Parameters: Species
//  Returns: <button> element
function createSpeciesButton(species) {
    let button = document.createElement("button");
    button.id = species.name;
    button.textContent = species.name;
    button.addEventListener("click", function () {
        let results = document.getElementById("resultsContainer")
        results.innerHTML = ""

        getPeople(species.people)
    })
    
    speciesButtons.append(button);
}



//  Parameters: Key and Value
//  Returns: <span> element
function createKeyValueSet(key, value) {
    /// Parent Container
    var elementSet = document.createElement("span")

    /// Key Element
    var keyElement = document.createElement("p")
    keyElement.className = "rowkey"
    keyElement.innerText = key
    elementSet.append(keyElement)

    /// Value element
    // If its empty just show "N/A" meaning "Not Available"
    if (value === undefined || value.length == 0) {
        var valueElement = document.createElement("p")
        valueElement.className = "rowvalue"
        valueElement.innerText = "N/A"
        elementSet.append(valueElement)
    }
    // If this is an array we need a <p> for each element
    else if (Array.isArray(value)) {
        for(v of value) {
            var valueElement = document.createElement("p")
            valueElement.className = "rowvalue"
            valueElement.innerText = v
            elementSet.append(valueElement)
        }
    } else {
        var valueElement = document.createElement("p")
        valueElement.className = "rowvalue"
        valueElement.innerText = value
        elementSet.append(valueElement)
    }

    return elementSet
}




/*  !!!DO NOT MAKE ANY CHANGES TO THESE FUNCTIONS!!!  */