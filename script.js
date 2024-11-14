const USERNAMEREGEX = /^[A-Za-z0-9-_]{5,15}$/;

// On start click.
function saveUserDetails() {
    
    // Get user inputs.
    let username = document.getElementById("username").value;
    let profilePicture = document.getElementById("profilePicture").files[0];

    // If no errors, allow the form to be submitted.
    if (validateUserName(username) && validateProfilePicture(profilePicture)) {
        alert("Form submitted successfully!");
        // document.getElementsByClassName("container")[0].style.display = "none";
        // You can proceed to further processing here (e.g., sending data to a server)
    }
};

// Validation for username.
function validateUserName(username) {
    if (username === '') {
        alert("Name cannot be empty.");
        return false;
    } else if (username?.split(" ")?.length > 2) {
        alert("Name cannot be more than two words.");
        return false;
    } else if (!USERNAMEREGEX.test(username)) {
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
    event.preventDefault(); // Prevent form submission to handle validation.
    const file = event.target.files[0];
    const imagePreview = document.getElementById('profileImagePreview');

    if (file) {
        imagePreview.src = URL.createObjectURL(file);
    }
});