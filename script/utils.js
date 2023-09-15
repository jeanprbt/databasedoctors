import {
    signOut,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";


// Function to add the cities to the given select element

export function addCitiesToSelect(selectElement) {
    // Define an array of allowed cities in Sweden
    const allowedPlaces = [
        "Stockholm",
        "Gothenburg",
        "Malmö",
        "Uppsala",
        "Västerås",
        "Örebro",
        "Linköping",
        "Helsingborg",
        "Jönköping",
        "Norrköping",
        "Lund",
        "Umeå",
    ];

    for (let i = 0; i < allowedPlaces.length; i++) {
        const option = document.createElement("option");
        option.value = allowedPlaces[i];
        option.text = allowedPlaces[i];
        selectElement.appendChild(option);
    }
}

export function addCitiesAndAllCitiesToSelect(selectElement) {
    const option = document.createElement("option");
    option.value = "All Cities";
    option.text = "All Cities";
    selectElement.appendChild(option);
    addCitiesToSelect(selectElement);
}


// Function to add the specialities to the given select element

export function addSpecialitiesToSelect(selectElement) {
    // Define an array of allowed specialities
    const specialities = [
        "Cardiology",
        "Dentistry",
        "Dermatology",
        "Orthopedics",
        "Neurology",
        "Pediatrics",
        "Oncology",
        "Psychiatry",
        "Radiology",
        "Ophthalmology",
        "Gynecology",
    ];

    for (let i = 0; i < specialities.length; i++) {
        const option = document.createElement("option");
        option.value = specialities[i];
        option.text = specialities[i];
        selectElement.appendChild(option);
    }
}

export function addSpecialitiesAndAllSpecialitiesToSelect(selectElement) {
    const option = document.createElement("option");
    option.value = "All Specialities";
    option.text = "All Specialities";
    selectElement.appendChild(option);
    addSpecialitiesToSelect(selectElement);
}

export function signOutButton(element, auth) {
    element.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log("Sign out successful.");
        }).catch((error) => {
            console.error("An error happened during sign out.");
        });
    });
}
export function getErrorMessageForFirebaseErrorCode(errorCode) {
    switch (errorCode) {
        case "auth/email-already-in-use":
            return "The email address is already in use by another account.";
        case "auth/invalid-email":
            return "Invalid email address. Please check the email format.";
        case "auth/weak-password":
            return "The password is too weak. Please use a stronger password.";
        case "auth/user-not-found":
            return "User not found. Please check your email or register.";
        case "auth/wrong-password":
            return "Incorrect password. Please try again.";
        // Add more cases for other error codes as needed
        default:
            return "An error occurred. Please try again later.";
    }
}