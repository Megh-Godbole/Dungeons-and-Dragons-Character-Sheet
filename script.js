// Global Constants.
const USER_NAME_REGEX = /^[A-Za-z0-9-_]{5,15}$/;
const BASE_DND_URL = "https://www.dnd5eapi.co/api";
const GENERIC_NETWORK_ERROR = "Network Error. Please try again later.";

// Global Properties.
let loggedInUser = null;

// Public Classes.
class user {
    constructor(userName, profilePicture) {
        this.userName = userName;
        this.profilePicture = profilePicture;
    }

    setUserClassName = function (userClassName) {
        this.userClassName = userClassName;
    }

    setUserClassDetails = function (classDetail) {
        this.classDetail = classDetail;
    }

    setUserRaceName = function (userRaceName) {
        this.userRaceName = userRaceName;
    }

    setUserRaceDetails = function (userRaceDetails) {
        this.userRaceDetails = userRaceDetails;
    }

    setAbillityDetails = function (userAbilityDetails) {
        this.userAbilityDetails = userAbilityDetails;
    }
};

// Generic functions.

function switchScreen(screen) {
    // Reference: https://www.w3schools.com/js/js_switch.asp
    switch (screen) {
        case 1:
            getClasses();
            document.getElementById("firstScreen").remove();
            break;
        case 2:
            document.getElementById("classScreen").remove();
            break;
        case 3:
            getRaces();
            document.getElementById("classDetailScreen").remove();
            break;
        case 4:
            document.getElementById("raceScreen").remove();
            break;
        case 5:
            document.getElementById("raceDetailScreen").remove();
            buildAbilityPage();
            break;
        case 6:
            document.getElementById("abilityScreen").remove();
            buildCharacterSheet();
            break;
        default:
            break;
    }
}

function createHeader(id, heading, isRaceList) {
    const container = document.createElement('div');
    container.id = id;
    container.className = "container";

    // Create header section
    const header = document.createElement('header');
    const imagePreviewDiv = document.createElement('div');
    imagePreviewDiv.className = "image-preview";
    const profileImg = document.createElement('img');
    profileImg.className = "profileImagePreview";
    profileImg.alt = "Profile Image";
    profileImg.src = loggedInUser.profilePicture;
    imagePreviewDiv.appendChild(profileImg);
    const userNameHeader = document.createElement('h3');
    userNameHeader.className = "userNameHeader";
    userNameHeader.textContent = loggedInUser.userName

    // Append image preview and username header to the header
    header.appendChild(imagePreviewDiv);
    header.appendChild(userNameHeader);

    // Add class name if exsist.
    if (loggedInUser.userClassName) {
        const userClassHeader = document.createElement('h3');
        userClassHeader.className = "userclass";
        userClassHeader.textContent = loggedInUser.userClassName;
        userClassHeader.textContent += loggedInUser.userRaceName ? ` - ${loggedInUser.userRaceName}` : '';
        header.appendChild(userClassHeader);
    }

    // Create main heading
    const mainHeading = document.createElement('h1');
    mainHeading.textContent = heading;

    // Create class list container
    const classList = document.createElement('div');
    classList.id = isRaceList ? "raceList" : "classList";
    classList.className = isRaceList ? "race-list" : "class-list";

    // Append all elements to the container
    container.appendChild(header);
    container.appendChild(mainHeading);
    container.appendChild(classList);

    return container;
}

function generateBoxelement(headings, content) {
    const box = document.createElement('div');
    box.className = 'content-box';

    // Create the heading
    const heading = document.createElement('h2');
    heading.textContent = headings;

    // Create the paragraph
    const paragraph = document.createElement('p');
    if (headings === 'Traits:') {
        paragraph.innerHTML = content
    } else {
        paragraph.textContent = content;
    }

    // Append heading and paragraph to the box
    box.appendChild(heading);
    box.appendChild(paragraph);

    return box;
}

// First Screen Code.
{
    let imageObjectURL;
    // Creat and load the first screen.
    function loadFirstScreen() {

        const container = document.createElement('div');
        container.id = "firstScreen";
        container.className = "container";

        const logoDiv = document.createElement('div');
        logoDiv.className = "logo";
        const logoImg = document.createElement('img');
        logoImg.src = "img/logo.jpg";
        logoImg.alt = "Logo";
        logoDiv.appendChild(logoImg);

        const heading = document.createElement('h1');
        heading.textContent = "Enter Your Details";

        const form = document.createElement('form');

        // User Name.
        const usernameLabel = document.createElement('label');
        usernameLabel.setAttribute('for', 'username');
        usernameLabel.textContent = "Choose a Name:";
        const usernameInput = document.createElement('input');
        usernameInput.type = "text";
        usernameInput.id = "username";
        usernameInput.name = "username";
        usernameInput.placeholder = "Enter your name";

        // Profile Picture.
        const profileLabel = document.createElement('label');
        profileLabel.setAttribute('for', 'profilePicture');
        profileLabel.textContent = "Upload Profile Picture:";
        const profileInput = document.createElement('input');
        profileInput.type = "file";
        profileInput.id = "profilePicture";
        profileInput.name = "profilePicture";
        profileInput.accept = "image/*";

        // profile Picture Preview.
        const imagePreviewDiv = document.createElement('div');
        imagePreviewDiv.className = "image-preview";
        const imagePreview = document.createElement('img');
        imagePreview.className = "profileImagePreview";
        imagePreview.src = "img/default-profile.jpg";
        imagePreview.alt = "Profile Image";
        imagePreviewDiv.appendChild(imagePreview);

        // Add preview after selection image.
        profileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                // Reference: https://www.geeksforgeeks.org/html-dom-createobjecturl-method/
                imagePreview.src = imageObjectURL = URL.createObjectURL(file);
            }
        });

        // Start button.
        const startButton = document.createElement('button');
        startButton.textContent = "Start";
        startButton.onclick = saveUserDetails;

        // Add elements to the form.
        form.appendChild(usernameLabel);
        form.appendChild(usernameInput);
        form.appendChild(profileLabel);
        form.appendChild(profileInput);
        form.appendChild(imagePreviewDiv);
        form.appendChild(startButton);

        // Add elements to the container.
        container.appendChild(logoDiv);
        container.appendChild(heading);
        container.appendChild(form);

        // Append coontainer to body.
        document.body.appendChild(container);
    }

    // On start click.
    function saveUserDetails(event) {
        event.preventDefault();

        // Get user inputs.
        let userName = document.getElementById("username").value;
        let profilePicture = document.getElementById("profilePicture").files[0];

        // If no errors, allow the form to be submitted.
        if (validateUserName(userName) && validateProfilePicture(profilePicture) && imageObjectURL) {
            loggedInUser = new user(userName, imageObjectURL);
            switchScreen(1);
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
}

// Class Screen Code.
{
    function getClasses() {
        fetch(`${BASE_DND_URL}/classes`)
            .then((response) => {
                return response.json();
            })
            .then((classes) => {
                document.body.appendChild(createHeader('classScreen', 'Choose A Class'));
                renderClasses(classes);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message || GENERIC_NETWORK_ERROR);
            });
    }

    // Function to render class cards.
    function renderClasses(classes) {
        const classList = document.getElementById('classList');

        classes.results.forEach((classData) => {
            const card = document.createElement('div');
            card.className = 'card';
            classData.image = `img/classes/Class Icon - ${classData.name}.svg`;

            // Class Images.
            const img = document.createElement("img");
            img.src = classData.image;
            img.alt = classData.name;

            // Class Names.
            const heading = document.createElement("h2");
            heading.textContent = classData.name;

            // Append the elements to the card
            card.appendChild(img);
            card.appendChild(heading);

            // Add a click event to redirect to the details page
            card.addEventListener('click', () => {
                switchScreen(2);
                getClassDetails(classData.index);
            });

            // Append the card to the class list
            classList.appendChild(card);
        });
    }
}

// Class Details Screen Code.
{
    const selectedSkills = [];
    let classDetail = {};
    let skillCount = 0;

    function getClassDetails(classID) {

        fetch(`${BASE_DND_URL}/classes/${classID}`)
            .then((response) => {
                return response.json();
            })
            .then((classDetails) => {
                loggedInUser.setUserClassName(classDetails.name);
                document.body.appendChild(createHeader('classDetailScreen', 'Class Features'));
                renderClassDetails(classDetails);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message || GENERIC_NETWORK_ERROR);
            });
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
        classDetail.hitDie = classDetails.hit_die;

        let weaponsAndArmorTag = document.createElement('h2');
        let weaponsAndArmor = document.createElement('span');
        weaponsAndArmorTag.textContent = 'Weapons and Armors: ';
        classDetail.weaponsAndArmor = [];
        for (let i = 0; i < classDetails.proficiencies.length; i++) {
            weaponsAndArmor.textContent += `${classDetails.proficiencies[i].name}${(i === classDetails.proficiencies.length - 1) ? '' : ', '}`;
            classDetail.weaponsAndArmor.push(classDetails.proficiencies[i].name);
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
                spellContainer.appendChild(generateBoxelement(info.name, info.desc.map(desc => `${desc} `).join('')));
            });
            classDetailScreen.appendChild(spellContainer);
        }
        const nextbutton = document.createElement('button');
        nextbutton.textContent = 'Next';
        nextbutton.addEventListener('click', function () {
            if (selectedSkills.length === skillCount) {
                classDetail.selectedSkills = selectedSkills;
                loggedInUser.setUserClassDetails(classDetail);
                switchScreen(3);
            } else {
                alert("Select all skill drop-downs.");
            }
        });
        classDetailScreen.appendChild(nextbutton);
    }
}

// Race Screen Code.
{
    function getRaces() {
        fetch(`${BASE_DND_URL}/races`)
            .then((response) => {
                return response.json();
            })
            .then((races) => {
                document.body.appendChild(createHeader('raceScreen', 'Choose A Class', true));
                renderRaces(races);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message || GENERIC_NETWORK_ERROR);
            });
    }

    function renderRaces(races) {
        const raceList = document.getElementById('raceList');

        races.results.forEach((racesData) => {
            const card = document.createElement('div');
            card.className = 'card';
            racesData.image = `img/races/${racesData.name}.jpg`;

            // Class Images.
            const img = document.createElement("img");
            img.src = racesData.image;
            img.alt = racesData.name;

            // Class Names.
            const heading = document.createElement("h2");
            heading.textContent = racesData.name;

            // Append the elements to the card
            card.appendChild(img);
            card.appendChild(heading);

            // Add a click event to redirect to the details page
            card.addEventListener('click', () => {
                getRaceDetails(racesData.index);
                switchScreen(4);
            });

            // Append the card to the class list
            raceList.appendChild(card);
        });
    }
}

// Race Details Screen Code.
{
    let raceDetail = {};
    function getRaceDetails(raceId) {
        fetch(`${BASE_DND_URL}/races/${raceId}`)
            .then((response) => {
                return response.json();
            })
            .then((raceDetails) => {
                loggedInUser.setUserRaceName(raceDetails.name);
                document.body.appendChild(createHeader('raceDetailScreen', 'Race Feature'));
                renderRaceDetails(raceDetails);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message || GENERIC_NETWORK_ERROR);
            });
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
        raceDetail.speed = raceDetails.speed;

        raceDetailScreen.appendChild(container);

        let spellContainer = document.createElement('div');
        spellContainer.appendChild(generateBoxelement(`Size: ${raceDetails.size}`, raceDetails.size_description));
        raceDetail.size = raceDetails.size;
        spellContainer.appendChild(generateBoxelement('Age:', raceDetails.age));
        raceDetail.age = raceDetails.age;

        raceDetail.traits = [];
        const traitPromises = raceDetails.traits.map(trait => {
            return fetch(`${BASE_DND_URL}/traits/${trait.index}`)
                .then(response => response.json())
                .then(traitDetails => {
                    raceDetail.traits[trait.name] = traitDetails.desc.join(' ');
                    return `<strong>${trait.name}</strong> <br>${traitDetails.desc.join(' ')}`;
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert(error.message || GENERIC_NETWORK_ERROR);
                    return ""; // Return an empty string if there's an error
                });
        });

        Promise.all(traitPromises)
            .then(traitsArray => {
                const traitsContent = traitsArray.join('<br><br>');
                spellContainer.appendChild(generateBoxelement('Traits:', traitsContent));
            });

        spellContainer.appendChild(generateBoxelement(`Languages: ${raceDetails.languages.map(language => language.name).toString()}`, raceDetails.language_desc));
        raceDetail.languages = raceDetails.languages.map(language => language.name);
        raceDetailScreen.appendChild(spellContainer);

        const nextbutton = document.createElement('button');
        nextbutton.textContent = 'Next';
        nextbutton.addEventListener('click', function () {
            loggedInUser.setUserRaceDetails(raceDetail);
            switchScreen(5);
        });
        raceDetailScreen.appendChild(nextbutton);
    }
}

// Ability Scores Screen Code.
{
    const abilities = [{ key: "CON", value: 0, count: 0 }, { key: "CHA", value: 0, count: 0 }, { key: "STR", value: 0, count: 0 }, { key: "INT", value: 0, count: 0 }, { key: "WIS", value: 0, count: 0 }, { key: "DEX", value: 0, count: 0 }];
    const aditionalAbilities = [];

    function buildAbilityPage() {

        document.body.appendChild(createHeader('abilityScreen', 'Ability Scores'));
        let container = document.getElementById("abilityScreen");

        const gems = document.createElement("div");
        const gemValue = document.createElement("span");
        gemValue.id = "gemsCount";
        gemValue.textContent = "1500";
        gems.appendChild(gemValue);
        gems.innerHTML += " gems";
        container.appendChild(gems);

        // Ability Scores Section
        const abilityScoresSection = document.createElement("div");
        abilityScoresSection.className = "contentContainer";

        const abilityScores = document.createElement("div");
        abilityScores.className = "ability-scores";

        abilities.forEach((ability) => {
            const scoreRow = document.createElement("div");
            scoreRow.className = "score-row";

            const select = document.createElement("select");
            select.className = "ability-select";
            const option = document.createElement("option");
            option.textContent = ability.key;
            select.appendChild(option);

            const rollBtn = document.createElement("button");
            rollBtn.id = ability.key;
            rollBtn.className = "roll-btn";
            rollBtn.textContent = "Roll";

            const rollValues = document.createElement("div");
            rollValues.className = "roll-values";

            const scoreInput = document.createElement("input");
            scoreInput.className = "score-input";
            scoreInput.type = "text";
            scoreInput.value = "0";
            scoreInput.readOnly = true;

            scoreRow.appendChild(select);
            scoreRow.appendChild(rollBtn);
            scoreRow.appendChild(rollValues);
            scoreRow.appendChild(scoreInput);

            abilityScores.appendChild(scoreRow);

            // Add rolling functionality
            rollBtn.addEventListener("click", function () {

                let abilityCount;
                let btnID = this.id;
                abilityCount = abilities.filter(ability => ability.key === btnID)[0].count + 1;

                let gemsCount = parseInt(document.getElementById("gemsCount").textContent);
                if (abilityCount === 2) {
                    gemsCount -= 50;
                } else if (abilityCount === 3) {
                    gemsCount -= 100;
                } else if (abilityCount === 4) {
                    gemsCount -= 200;
                } else if (abilityCount >= 5) {
                    gemsCount -= 500;
                }

                if (gemsCount >= 0) {
                    document.getElementById("gemsCount").textContent = gemsCount;

                    const rolls = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
                    rollValues.textContent = rolls.join(" | ");

                    // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
                    rolls.sort((a, b) => b - a)
                    let score = 0;
                    // Add the top 3 rolls.
                    for (let i = 0; i < 3; i++) {
                        score += rolls[i];
                    }
                    scoreInput.value = score;
                    abilities.forEach(function (ability) {
                        if (ability.key === btnID) {
                            ability.value = score;
                            abilityCount = ++ability.count;
                        }
                    });
                } else {
                    alert("Insufficient Gems!!!")
                }
            });
        });

        abilityScoresSection.appendChild(abilityScores);
        container.appendChild(abilityScoresSection);

        // Ability Score Increases Section
        const scoreIncreaseSection = document.createElement("div");
        scoreIncreaseSection.className = "score-increase-section";

        const increaseTitle = document.createElement("h3");
        increaseTitle.textContent = "Ability Score Increases";

        const scoreIncreaseSelect = document.createElement("select");
        scoreIncreaseSelect.className = "score-increase-select";
        let increaseOption = document.createElement("option");
        increaseOption.textContent = "Increase 3 scores (+1/+1/+1)";
        increaseOption.value = "3";
        scoreIncreaseSelect.appendChild(increaseOption);
        let increaseOption2 = document.createElement("option");
        increaseOption2.textContent = " Increase 2 scores (+2/+1)";
        increaseOption2.value = "2";
        scoreIncreaseSelect.appendChild(increaseOption2);

        scoreIncreaseSection.appendChild(increaseTitle);
        scoreIncreaseSection.appendChild(scoreIncreaseSelect);
        container.appendChild(scoreIncreaseSection);

        const nextbutton = document.createElement('button');
        nextbutton.textContent = 'Next';
        nextbutton.addEventListener('click', function () {
            if (abilities.map(ability => ability.count > 0).length === abilities.length) {
                let increaseScore = document.getElementsByClassName("increase-select");
                for (let i = 0; i < increaseScore.length; i++) {
                    let finalScore = (i === 0 && increaseScore.length === 2) ? 2 : 1;
                    aditionalAbilities.push({ ability: increaseScore[i].value, score: finalScore });
                }
                loggedInUser.setAbillityDetails({ abilities: abilities, aditionalAbilities: aditionalAbilities });
                switchScreen(6);
            } else {
                alert("Please roll all the dice.");
            }
        });

        container.appendChild(nextbutton);

        scoreIncreaseSection.querySelectorAll("select").forEach((dropdown) => {
            dropdown.addEventListener("change", function () {
                document.getElementsByClassName("increase-scores")[0].remove();
                bindIncreaseScoresAbilityOptions(parseInt(dropdown.value), scoreIncreaseSection)
            })
        });

        // for default selaction bind the options.
        bindIncreaseScoresAbilityOptions(3, scoreIncreaseSection);
    }

    function bindIncreaseScoresAbilityOptions(count, rootElement) {
        const increaseScores = document.createElement("div");
        increaseScores.className = "increase-scores";
        increaseScores.innerHTML = "";
        for (let i = 0; i < count; i++) {
            const select = document.createElement("select");
            select.className = "increase-select";

            abilities.forEach((ability) => {
                const option = document.createElement("option");
                option.textContent = ability.key;
                select.appendChild(option);
            });

            increaseScores.appendChild(select);
        }
        rootElement.appendChild(increaseScores);
    }
}

// Character Sheet Screen Code
{
    function buildCharacterSheet() {
        console.log(loggedInUser);

        document.body.appendChild(createHeader('characterSheet', 'D&D Beyond - Character Sheet'));

        // Main Container
        const container = document.getElementById("characterSheet");

        const userClassName = document.createElement("h3");
        userClassName.textContent = `Class: ${loggedInUser.userClassName}`;

        const classDetails = document.createElement("div");
        classDetails.innerHTML = `| <strong>Hit-Die:</strong> ${loggedInUser.classDetail.hitDie}`;
        classDetails.innerHTML += ` | <strong>Selected Skills:</strong> ${loggedInUser.classDetail.selectedSkills.map(skill => skill.index.split('-')[1])}`;
        classDetails.innerHTML += ` | <strong>Weapons & Armors:</strong> ${loggedInUser.classDetail.weaponsAndArmor.toString()} |`;

        const userRaceName = document.createElement("h3");
        userRaceName.textContent = `Race: ${loggedInUser.userRaceName}`;

        const raceDetails = document.createElement("div");
        raceDetails.innerHTML = `| <strong>Speed:</strong> ${loggedInUser.userRaceDetails.speed}`;
        raceDetails.innerHTML += `| <strong>Size:</strong> ${loggedInUser.userRaceDetails.size}`;
        raceDetails.innerHTML += `| <strong>Age:</strong> ${loggedInUser.userRaceDetails.age}`;

        raceDetails.innerHTML += ` | <strong>Languages:</strong> ${loggedInUser.userRaceDetails.languages.toString()} |`;

        // Abilities Section
        const abilitiesSection = document.createElement("div");

        const abilitiesTitle = document.createElement("h3");
        abilitiesTitle.textContent = "Abilities";

        const abilityItem = document.createElement("p");
        abilityItem.textContent = '| '

        loggedInUser.userAbilityDetails.abilities.forEach((ability) => {
            abilityItem.textContent += `${ability.key}: ${ability.value} | `;
        });

        abilitiesSection.appendChild(abilitiesTitle);
        abilitiesSection.appendChild(abilityItem);

        // Additional Abilities Section
        const additionalAbilitiesSection = document.createElement("div");

        const additionalAbilitiesTitle = document.createElement("h3");
        additionalAbilitiesTitle.textContent = "Additional Abilities";

        const additionalAbilityItem = document.createElement("p");
        additionalAbilityItem.textContent = '| '

        loggedInUser.userAbilityDetails.aditionalAbilities.forEach((ability) => {
            additionalAbilityItem.textContent += `${ability.ability}: ${ability.score} | `;
        });

        additionalAbilitiesSection.appendChild(additionalAbilitiesTitle);
        additionalAbilitiesSection.appendChild(additionalAbilityItem);

        // Append all sections to the main container
        container.appendChild(userClassName);
        container.appendChild(classDetails);
        container.appendChild(userRaceName);
        container.appendChild(raceDetails);
        container.appendChild(abilitiesSection);
        container.appendChild(additionalAbilitiesSection);

        // Append container to root
        document.body.appendChild(container);
    }
}

// Initial function to first screen.
loadFirstScreen();