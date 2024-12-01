// Global Constants.
const USER_NAME_REGEX = /^[A-Za-z0-9-_]{5,15}$/;
const BASE_DND_URL = "https://www.dnd5eapi.co/api";
const GENERIC_NETWORK_ERROR = "Network Error. Please try again later.";

// Global Properties.
let loggedInUser = null;

// Public Class.
class user {
    constructor(userName, profilePicture) {
        this.userName = userName;
        this.profilePicture = profilePicture;
        this.userClassName = null;
        this.classDetails = null;
        this.selectedSkills = null;
        this.userRaceName = null;
        this.userRaceDetails = null;
    }

    setUserClassName = function (userClassName) {
        this.userClassName = userClassName;
    }

    setUserClassDetail = function (classDetails, selectedSkills) {
        this.classDetails = classDetails;
        this.selectedSkills = selectedSkills;
    }

    setUserRaceName = function (userRaceName) {
        this.userRaceName = userRaceName;
    }

    setUserRaceDetails = function (userRaceDetails) {
        this.userRaceDetails = userRaceDetails;
    }
};

// Generic functions.
function generateBoxelement(headings, content) {
    const box = document.createElement('div');
    box.className = 'content-box';

    // Create the heading
    const heading = document.createElement('h2');
    heading.textContent = headings;

    // Create the paragraph
    const paragraph = document.createElement('p');
    paragraph.textContent = content;

    // Append heading and paragraph to the box
    box.appendChild(heading);
    box.appendChild(paragraph);

    return box;
}

// First Screen Code.
{
    // On start click.
    function saveUserDetails(event) {
        event.preventDefault();

        // Get user inputs.
        let userName = document.getElementById("username").value;
        let profilePicture = document.getElementById("profilePicture").files[0];

        // If no errors, allow the form to be submitted.
        if (validateUserName(userName) && validateProfilePicture(profilePicture)) {
            document.getElementById("firstScreen").style.display = "none";
            document.getElementById("classScreen").style.display = "block";
            loggedInUser = new user(userName, document.getElementsByClassName('profileImagePreview')[0].src);
            buildClassesPage();
        }
    };

    // Validation for username.
    function validateUserName(userName) {
        if (userName === '') {
            alert("Name cannot be empty.");
            return false;
        } else if (userName?.split(" ")?.length > 2) {
            alert("Name cannot be more than two words.");
            return false;
        } else if (!USER_NAME_REGEX.test(userName)) {
            alert("Name must be between 5 and 15 characters and can only contain letters, numbers, '-' or '_'. The first character cannot be a number.");
            return false;
        } else {
            return true;
        }
    };

    // Validation for profile picture.
    function validateProfilePicture(profilePicture) {
        if (!profilePicture) {
            alert("Please upload a profile picture.");
            return false;
        } else {
            return true;
        }
    };

    // Show image preview when the user selects a profile picture.
    document.getElementById('profilePicture').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const imagePreview = document.getElementsByClassName('profileImagePreview')[0];

        if (file) {
            imagePreview.src = URL.createObjectURL(file);
            // Reference: https://www.geeksforgeeks.org/html-dom-createobjecturl-method/
        }
    });
}

// Class Screen Code.
{
    function buildClassesPage() {
        document.getElementsByClassName("userNameHeader")[0].textContent = loggedInUser.userName;
        document.getElementsByClassName('profileImagePreview')[1].src = loggedInUser.profilePicture;
        getClasses();
    }

    // 
    function getClasses() {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open("GET", `${BASE_DND_URL}/classes`, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let classes = xhr.response;
                renderClasses(classes)
            } else {
                alert("Error fetching classes data.");
            }
        };
        xhr.onerror = function () {
            alert(GENERIC_NETWORK_ERROR)
        };
        xhr.send();
    }

    // Function to render class cards
    function renderClasses(classes) {
        const classList = document.getElementById('classList');

        classes.results.forEach((classData) => {
            const card = document.createElement('div');
            card.className = 'card';
            classData.image = `img/classes/Class Icon - ${classData.name}.svg`;

            // Set the inner HTML of the card
            card.innerHTML = `<img src="${classData.image || 'default-class.jpg'}" alt="${classData.name}"><h2>${classData.name}</h2>`;

            // Add a click event to redirect to the details page
            card.addEventListener('click', () => {
                document.getElementById("classScreen").style.display = "none";
                document.getElementById("classDetailScreen").style.display = "block";
                buildClassDetailsPage(classData.index);
            });

            // Append the card to the class list
            classList.appendChild(card);
        });
    }
}

// Class Details Screen Code.
{
    const selectedSkills = [];
    let skillCount = 0;

    function buildClassDetailsPage(classID) {
        document.getElementsByClassName("userNameHeader")[1].textContent = loggedInUser.userName;
        document.getElementsByClassName('profileImagePreview')[2].src = loggedInUser.profilePicture;
        getClassDetails(classID);
    }

    function getClassDetails(classID) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open("GET", `${BASE_DND_URL}/classes/${classID}`, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let classDetails = xhr.response;
                loggedInUser.setUserClassName(classDetails.name);
                document.getElementsByClassName('userclass')[0].textContent = loggedInUser.userClassName;
                renderClassDetails(classDetails);
            } else {
                alert("Error fetching class detail data.");
            }
        };
        xhr.onerror = function () {
            alert(GENERIC_NETWORK_ERROR)
        };
        xhr.send();
    }

    function renderClassDetails(classDetails) {
        const classDetailScreen = document.getElementById("classDetailScreen");

        const container = document.createElement('div');
        container.id = "container";
        let hitDieTag = document.createElement('h2');
        let hitDie = document.createElement('span');
        hitDieTag.textContent = 'Hit Die: ';
        hitDie.textContent = classDetails.hit_die;
        hitDieTag.appendChild(hitDie);
        container.appendChild(hitDieTag);

        let weaponsAndArmorTag = document.createElement('h2');
        let weaponsAndArmor = document.createElement('span');
        weaponsAndArmorTag.textContent = 'Weapons and Armors: ';
        for (let i = 0; i < classDetails.proficiencies.length; i++) {
            weaponsAndArmor.textContent += `${classDetails.proficiencies[i].name}${(i === classDetails.proficiencies.length - 1) ? '' : ', '}`;
        }
        weaponsAndArmorTag.appendChild(weaponsAndArmor);
        container.appendChild(weaponsAndArmorTag);
        classDetailScreen.appendChild(container);

        classDetails.proficiency_choices.forEach(function (choice, index) {

            const skilldescription = document.createElement('h2');
            skilldescription.textContent = `${choice.desc}:`;
            classDetailScreen.appendChild(skilldescription);

            const skillsContainer = document.createElement('div');
            skillsContainer.id = 'skillsContainer';
            // Loop through proficiency choices and render dropdowns
            for (let i = 0; i < choice.choose; i++) {
                skillCount++;
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';

                // Create dropdown
                const select = document.createElement('select');
                select.id = `skill-${index}-${i}`;
                select.name = `skill-${i}`;

                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select a skill';
                select.appendChild(defaultOption);

                // Populate options
                choice.from.options.forEach((option) => {
                    if (option.item && option.item.index) {
                        const opt = document.createElement('option');
                        opt.value = option.item.index;
                        opt.textContent = option.item.name;
                        select.appendChild(opt);
                    } else {
                        option.choice.from.options.forEach((option) => {
                            const opt = document.createElement('option');
                            opt.value = option.item.index;
                            opt.textContent = option.item.name;
                            select.appendChild(opt);
                        });

                    }
                });

                skillItem.appendChild(select);
                skillsContainer.appendChild(skillItem);
                classDetailScreen.appendChild(skillsContainer);
            }

            skillsContainer.querySelectorAll("select").forEach((dropdown) => {
                dropdown.addEventListener("change", function () {
                    const selectedSkill = { id: dropdown.id, index: dropdown.value };
                    if (selectedSkill.index !== '') {
                        let existingValue = selectedSkills.filter(skill => skill.index === selectedSkill.index);
                        if (existingValue.length == 0) {
                            // Check if the ID already exists in the array, If exsist update the value else add new value.
                            const existingSkillIndex = selectedSkills.findIndex(skill => skill.id === selectedSkill.id);
                            existingSkillIndex !== -1 ? selectedSkills[existingSkillIndex] = selectedSkill : selectedSkills.push(selectedSkill);
                        } else {
                            alert("Skills must be distinct. Please select different skills.");
                            dropdown.value = '';
                        }
                    } else {
                        const existingSkillIndex = selectedSkills.findIndex(skill => skill.id === selectedSkill.id);
                        if (existingSkillIndex !== -1) { selectedSkills.splice(existingSkillIndex, 1) }
                    }
                });
            });
        }

        );

        if (classDetails.spellcasting && classDetails.spellcasting.info) {
            let spellContainer = document.createElement('div');
            let spellsh2 = document.createElement('h2');
            spellsh2.textContent = 'Spells:';
            spellContainer.appendChild(spellsh2);
            classDetailScreen.appendChild(spellContainer);

            spellContainer = document.createElement('div');
            spellContainer.className = 'contentContainer';
            classDetails.spellcasting.info.forEach(function (info) {

                const box = document.createElement('div');
                box.className = 'content-box';

                // Create the heading
                const heading = document.createElement('h2');
                heading.textContent = info.name;

                // Create the paragraph
                const paragraph = document.createElement('p');
                info.desc.forEach(function (desc) {
                    paragraph.textContent += `${desc} `;
                });

                // Append heading and paragraph to the box
                box.appendChild(heading);
                box.appendChild(paragraph);

                // Append the box to the container
                spellContainer.appendChild(box);

            });
            classDetailScreen.appendChild(spellContainer);
        }
        const nextbutton = document.createElement('button');
        nextbutton.textContent = 'Next';
        nextbutton.addEventListener('click', function () {
            if (selectedSkills.length === skillCount) {
                document.getElementById("classDetailScreen").style.display = "none";
                document.getElementById("raceScreen").style.display = "block";
                loggedInUser.setUserClassDetail(classDetails, selectedSkills);
                buildRacesPage();
            } else {
                alert("Select all skill drop-downs.");
                console.log(selectedSkills);
                console.log(skillCount);
            }
        });
        classDetailScreen.appendChild(nextbutton);


    }
}

// Race Screen Code.
{
    function buildRacesPage() {
        document.getElementsByClassName('userclass')[1].textContent = `${loggedInUser.userClassName}`;
        document.getElementsByClassName("userNameHeader")[2].textContent = loggedInUser.userName;
        document.getElementsByClassName('profileImagePreview')[3].src = loggedInUser.profilePicture;
        getRaces();
    }

    // 
    function getRaces() {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open("GET", `${BASE_DND_URL}/races`, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let races = xhr.response;
                renderRaces(races);
            } else {
                alert("Error fetching races data.");
            }
        };
        xhr.onerror = function () {
            alert(GENERIC_NETWORK_ERROR)
        };
        xhr.send();
    }

    // Function to render class cards
    function renderRaces(races) {
        const classList = document.getElementById('raceList');

        races.results.forEach((racesData) => {
            const card = document.createElement('div');
            card.className = 'card';
            racesData.image = `img/races/${racesData.name}.jpg`;

            // Set the inner HTML of the card
            card.innerHTML = `<img src="${racesData.image || 'default-class.jpg'}" alt="${racesData.name}"><h2>${racesData.name}</h2>`;

            // Add a click event to redirect to the details page
            card.addEventListener('click', () => {
                document.getElementById("raceScreen").style.display = "none";
                document.getElementById("raceDetailScreen").style.display = "block";
                buildRaceDetailsPage(racesData.index);
            });

            // Append the card to the class list
            classList.appendChild(card);
        });
    }
}

// Race Details Screen Code.
{
    function buildRaceDetailsPage(raceId) {
        document.getElementsByClassName("userNameHeader")[3].textContent = loggedInUser.userName;
        document.getElementsByClassName('profileImagePreview')[4].src = loggedInUser.profilePicture;
        getRaces(raceId);
    }

    function getRaces(raceId) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open("GET", `${BASE_DND_URL}/races/${raceId}`, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let raceDetails = xhr.response;
                loggedInUser.setUserRaceName(raceDetails.name);
                document.getElementsByClassName('userclass')[2].textContent = `${loggedInUser.userClassName} - ${loggedInUser.userRaceName}`;
                renderRaceDetails(raceDetails);
                console.log(raceDetails);
            } else {
                alert("Error fetching class detail data.");
            }
        };
        xhr.onerror = function () {
            alert(GENERIC_NETWORK_ERROR)
        };
        xhr.send();
    }

    function renderRaceDetails(raceDetails) {
        const raceDetailScreen = document.getElementById("raceDetailScreen");

        const container = document.createElement('div');
        container.id = "container";
        let speedTaf = document.createElement('h2');
        let speed = document.createElement('span');
        speedTaf.textContent = 'Speed: ';
        speed.textContent = raceDetails.speed;
        speedTaf.appendChild(speed);
        container.appendChild(speedTaf);

        raceDetailScreen.appendChild(container);

        let spellContainer = document.createElement('div');
        spellContainer.appendChild(generateBoxelement(`Size: ${raceDetails.size}`, raceDetails.size_description));
        spellContainer.appendChild(generateBoxelement('Age:', raceDetails.age));
        let traitsContent;
        raceDetails.traits.forEach(function (trait) {
            const brTag = document.createElement('br');
            traitsContent += (trait.Name + brTag)
        });
        spellContainer.appendChild(generateBoxelement('Traits:', traitsContent));
        spellContainer.appendChild(generateBoxelement(`Languages: ${raceDetails.languages.map(language => language.name).toString()}`, traitsContent));
        raceDetailScreen.appendChild(spellContainer);

        const nextbutton = document.createElement('button');
        nextbutton.textContent = 'Next';
        nextbutton.addEventListener('click', function () { buildAbilityPage() });
        raceDetailScreen.appendChild(nextbutton);
    }
}

// Ability Scores Screen Code.
{
    function buildAbilityPage() {
        document.getElementsByClassName('userclass')[3].textContent = `${loggedInUser.userClassName} - ${loggedInUser.userRaceName}`;
        document.getElementsByClassName("userNameHeader")[4].textContent = loggedInUser.userName;
        document.getElementsByClassName('profileImagePreview')[5].src = loggedInUser.profilePicture;
        document.getElementById("raceDetailScreen").style.display = "none";
        document.getElementById("abilityScreen").style.display = "block";
    }

}