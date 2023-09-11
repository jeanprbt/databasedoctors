import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
    getAuth,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
    getFirestore,
    getDocs,
    collection,
    where,
    query, 
    addDoc
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeiRIFp3pz2fNxMlGCsTc-NA7GviQghZU",
    authDomain: "database-project-bd7e8.firebaseapp.com",
    projectId: "database-project-bd7e8",
    storageBucket: "database-project-bd7e8.appspot.com",
    messagingSenderId: "771888139690",
    appId: "1:771888139690:web:6b1e5ee383ec06df976fd3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Restrict page to logged-in users
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Add a welcome message
        const welcomeMessage = document.getElementById('welcome-message');
        welcomeMessage.textContent = `Welcome ${user.displayName} !`;

    } else {
        window.location = 'index.html'; // If user is not logged in, redirect to login page
    }
});

// Handle sign-out
document.getElementById('sign-out')
    .addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log("Sign out successful.");
        }).catch((error) => {
            console.error("An error happened during sign out.");
        });
});


// Define an array of allowed cities in Sweden
const allowedPlaces = [
    "All Cities",
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
// Add the options to the select element for city
const selectCity = document.getElementById("city");
for (let i = 0; i < allowedPlaces.length; i++) {
    const option = document.createElement("option");
    option.value = allowedPlaces[i];
    option.text = allowedPlaces[i];
    selectCity.appendChild(option);
}

const specialities = [
    "All Specialities",
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

// Add the options to the select element
const select = document.getElementById("speciality");
for (let i = 0; i < specialities.length; i++) {
    const option = document.createElement("option");
    option.value = specialities[i];
    option.text = specialities[i];
    select.appendChild(option);
}

// Get the doctors database
const doctorsDB = collection(db, 'doctors');
const searchForm = document.querySelector('form');
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Collect user input
    const speciality = document.getElementById('speciality').value;
    // const date = document.getElementById('date').value;
    const city = document.getElementById('city').value;

    // Query the Firebase database based on user input
    let answer = query(doctorsDB);

    if (speciality !== 'All Specialities') {
        answer = query(answer, where('speciality', '==', speciality));
    }

    //TODO, gérer la date
    //if (date !== '') {
    //answer = ;
    //}

    if (city !== 'All Cities') {
        answer = query(answer, where('city', '==', city));
    }
    // Execute the query
    const querySnapshot = await getDocs(answer);

    // Display the search results
    displaySearchResults(querySnapshot);
});

//Function to display
async function displaySearchResults(querySnapshot) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results
    const resultTitle = document.createElement('h2'); 

    if (querySnapshot.empty) {
        resultTitle.textContent = 'No doctor found for you requirements...';
        resultDiv.appendChild(resultTitle);
        return;
    }else{
        resultTitle.textContent = 'Results : '; 
        resultDiv.appendChild(resultTitle); 
    }

    querySnapshot.forEach(async (doc) => {

        const doctorData = doc.data();

        // Create a container for each doctor Card + calendar
        const doctorContainer = document.createElement('div');
        doctorContainer.classList.add('doctor-container');

        // Create elements to display doctor information (e.g., name, speciality, etc.)
        const doctorCard = document.createElement('div');
        doctorCard.classList.add('doctor-card');

        //Create elements for calendar + button
        const doctorCalendar = document.createElement('div'); 
        doctorCalendar.classList.add('doctor-calendar'); 

        // Add doctor information to the card

        const doctorName = document.createElement('h3');
        doctorName.textContent = doctorData.name;

        const doctorSpeciality = document.createElement('p');
        doctorSpeciality.textContent = `Speciality: ${doctorData.speciality}`;

        const doctorCity = document.createElement('p');
        doctorCity.textContent = `City: ${doctorData.city}`;

        const doctorEmail = document.createElement('p'); 
        doctorEmail.textContent = `Contact : ${doctorData.email}`; 

        // Create a div for the calendar
        const calendarDiv = document.createElement('div');
        calendarDiv.classList.add('calendar');

        // Append the elements to the card
        doctorCard.appendChild(doctorName);
        doctorCard.appendChild(doctorSpeciality);
        doctorCard.appendChild(doctorCity);
        doctorCard.appendChild(doctorEmail); 

        //Append elements to the calendar division
        doctorCalendar.appendChild(calendarDiv); 

        //DO THE CALENDER 
        const calendar = await createCalendar(calendarDiv, doc)
        calendar.render();

        //Put both parts together
        doctorContainer.appendChild(doctorCard); 
        doctorContainer.appendChild(doctorCalendar); 

        // Append the full doctor info to the appointmentsDiv
        resultDiv.appendChild(doctorContainer);
    });
}

//Function to display the calendar
async function createCalendar(calendarDiv, doc){
    // Create an array to store the events for the doctor's calendar
    const events = [];

    // Define the time slots (8 AM to 12 PM and 1 PM to 5 PM) in one-hour increments
    const timeSlots = [
        { start: '08:00', end: '09:00' },
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' },
    ];

    // Fetch the used slots from the database (replace with your database query)
    const usedSlotsQuery = query(collection(db,'usedSlots'), where('doctorId', '==', doc.id));
    const usedSlotsSnapshot = await getDocs(usedSlotsQuery);
    const usedSlots = [];

    //TODO : upload the used slots for the doctor
    usedSlotsSnapshot.forEach((slotDoc) => {
        const slotData = slotDoc.data();
        usedSlots.push(slotData.slotStartTime); // Assuming 'slot' is the field containing the slot start time
    });


    for (let i = 0; i <= 50; i++) {
        const currentDay = new Date();
        currentDay.setDate(currentDay.getDate() + i);

        // Check if it's a weekday (Monday to Friday)
        if (currentDay.getDay() >= 1 && currentDay.getDay() <= 5) {
            timeSlots.forEach((slot) => {
                const startDate = new Date(currentDay);
                startDate.setHours(slot.start.split(':')[0], slot.start.split(':')[1], 0, 0);
                const endDate = new Date(currentDay);
                endDate.setHours(slot.end.split(':')[0], slot.end.split(':')[1], 0, 0);

                // Check if the slot is not in the usedSlots array (i.e., it's available)
                if (!usedSlots.some(usedSlot => {
                    // Compare both date and time
                    const usedSlotDate = new Date(usedSlot);
                    return usedSlotDate.getTime() === startDate.getTime();
                })) {
                    const event = {
                        title: 'Available Slot', // You can customize the title as needed
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        dow: [currentDay.getDay()], // Day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
                    };

                    events.push(event);
                }
            });
        }
    }

    const calendar = new FullCalendar.Calendar(calendarDiv, {
        // Your FullCalendar options go here
        // For example, you can define events as available appointment slots
        events: events,
        initialView: 'timeGridWeek',
        // Customize the slot duration and other options as needed
        themeSystem: 'rounded',
        slotDuration: '01:00', // Each slot represents one hour
        slotLabelInterval: { hours: 1 }, // Show hour labels on each slot
        allDaySlot: false, // Hide the all-day slot
        nowIndicator: true, // Show a "now" indicator line
        columnHeaderFormat: { weekday: 'long' }, // Show full weekday names
        slotMinTime: '08:00:00', // Display slots starting from 8:00 AM
        slotMaxTime: '17:00:00', // Display slots ending at 6:00 PM
        hiddenDays: [0, 6], // Hide Sunday (0) and Saturday (6)
        eventContent: function(arg) {
            return 'book'; // Return an empty string to hide event titles
        },
        eventClick: function(info) {
            // This function is called for each event when it is rendered in the calendar
            const event = info.event; // The event object
            const element = info.el;   // The HTML element representing the event
            const slotStartTime = event.start.toISOString(); // Start time of the clicked event
            const doctorId = doc.id; // Replace with the actual doctor's ID
            const eventDate = formatTime(event.start);
            console.log(`Event booked: ${eventDate}`)
            
            // Add the clicked slot to the "usedSlots" database (replace this with your Firebase update logic)
            // Assume you have a Firestore collection "usedSlots" with a field "doctorId" and "slotStartTime"
            // Make sure to replace this with your Firestore code to add the slot to the database
            const usedSlotsCollection = collection(db, 'usedSlots');
            const newUsedSlot = {
                doctorId: doctorId,
                slotStartTime: slotStartTime,
                patientId: auth.currentUser.uid,
            };

            addDoc(usedSlotsCollection, newUsedSlot)
            .then(() => {
                // Slot added successfully, you can show a success message if needed
                console.log('Slot added to usedSlots:', slotStartTime);
            })
            .catch((error) => {
                // Handle any errors that occur during the database update
                console.error('Error adding slot to usedSlots:', error);
            });
        },
    });

    return calendar; 
}


// Function to format date and time to be readable
function formatTime(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}