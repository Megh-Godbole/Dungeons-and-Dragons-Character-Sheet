const USERNAMEREGEX = /^[A-Za-z0-9-_]{5,15}$/;

let loggedInUser = null; 

class user{
    constructor(userName, profilePicture){
        this.userName = userName;
        this.profilePicture = profilePicture;
    }
};

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
            document.getElementById("secondScreen").style.display = "block";
            loggedInUser = new user(userName, profilePicture);
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
        } else if (!USERNAMEREGEX.test(userName)) {
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
        const imagePreview = document.getElementById('profileImagePreview');

        if (file) {
            imagePreview.src = URL.createObjectURL(file);
        }
    });
}