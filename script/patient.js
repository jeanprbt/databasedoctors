import {initializeApp} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    deleteDoc,
    collection,
    where,
    query,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
    addCitiesAndAllCitiesToSelect,
    addSpecialitiesAndAllSpecialitiesToSelect,
    signOutButton,
    formatTime
} from "./utils.js";

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

// Restrict page to logged-in patient users
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "patients", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Add a welcome message
            const welcomeMessage = document.getElementById('welcome-message');
            welcomeMessage.textContent = `Welcome ${user.displayName} !`;
        } else {
            window.location.href = "doctor.html"; // If user is a doctor, redirect to doctor page
        }
    } else {
        window.location.href = 'index.html'; // If user is not logged in, redirect to login page
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utils functions 

// Handle sign-out
signOutButton(document.getElementById('sign-out'), auth);

// Add the options to the select element for city
const selectCity = document.getElementById("city");
addCitiesAndAllCitiesToSelect(selectCity);

// Add the options to the select element
const selectSpecialities = document.getElementById("speciality");
addSpecialitiesAndAllSpecialitiesToSelect(selectSpecialities);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
    resultDiv.style.visibility = 'visible';
    const resultTitle = document.createElement('h2');

    if (querySnapshot.empty) {
        resultTitle.textContent = 'No doctor found for your requirements...';
        resultDiv.appendChild(resultTitle);
        return;
    } else {
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

        //Append element to the calendar division
        doctorCalendar.appendChild(calendarDiv);
        const calendar = createCalendar(calendarDiv, doc)

        //Put both parts together
        doctorContainer.appendChild(doctorCard);
        doctorContainer.appendChild(doctorCalendar);

        // Append the full doctor info to the appointmentsDiv
        resultDiv.appendChild(doctorContainer);
    });
}

//Function to display the calendar
async function createCalendar(calendarDiv, doc) {

    // Create an array to store the events for the doctor's calendar
    const events = [];

    // Define the time slots
    const timeSlots = [
        {start: '08:00', end: '09:00'},
        {start: '09:00', end: '10:00'},
        {start: '10:00', end: '11:00'},
        {start: '11:00', end: '12:00'},
        {start: '13:00', end: '14:00'},
        {start: '14:00', end: '15:00'},
        {start: '15:00', end: '16:00'},
        {start: '16:00', end: '17:00'},
    ];

    // Fetch the used slots from the database
    const usedSlotsQuery = query(collection(db, 'usedSlots'), where('doctorId', '==', doc.id));
    const usedSlotsSnapshot = await getDocs(usedSlotsQuery);
    const usedSlots = [];

    //upload the used slots for the doctor
    usedSlotsSnapshot.forEach((slotDoc) => {
        const slotData = slotDoc.data();
        usedSlots.push(slotData.slotStartTime);
    });


    //show availabilities for the 50 next days
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
                        title: 'Available',
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        dow: [currentDay.getDay()],
                    };

                    events.push(event);
                } else {
                    // This slot is already used
                    const event = {
                        title: 'Used Slot',
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        dow: [currentDay.getDay()],
                        backgroundColor: 'grey', // Set the background color to grey
                    };
                
                    events.push(event);
                    
                }
            });
        }
    }

    let calendar;
    calendar = new FullCalendar.Calendar(calendarDiv, {
        events: events,
        initialView: 'timeGridWeek',
        themeSystem: 'rounded',
        slotDuration: '01:00',
        slotLabelInterval: {hours: 1}, // Show hour labels on each slot
        allDaySlot: false,
        nowIndicator: true,
        columnHeaderFormat: {weekday: 'long'},
        slotMinTime: '08:00:00',
        slotMaxTime: '17:00:00',
        hiddenDays: [0, 6], // Hide Sunday (0) and Saturday (6)
        eventContent: function (arg) {
            if (arg.event.backgroundColor === 'grey') {
                return 'Booked';
            } else {
                return 'Available';
            }
        },
        eventRender: function (info) {
        if (info.event.backgroundColor === 'grey') {
            // Disable click for used slots
            info.el.classList.add('fc-non-clickable');
        }
    },

        //this function is called when you click on an available slot
        eventClick: function (info) {
            const event = info.event; // The event object
            const slotStartTime = event.start.toISOString();
            const doctorId = doc.id;
            const eventDate = formatTime(event.start);
            
            if (event.backgroundColor === 'green') {

                // Delete the event from the used slots
                const usedSlotsCollection = collection(db, 'usedSlots');
                const usedSlotsQuery = query(usedSlotsCollection, where('doctorId', '==', doctorId),
                    where('slotStartTime', '==', slotStartTime));
                const usedSlotsSnapshot = getDocs(usedSlotsQuery);
                usedSlotsSnapshot.then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        deleteDoc(doc.ref);
                    });
                });
                event.setProp('backgroundColor', 'dodgerblue');
                calendar.render();
                return; // E
            }
            console.log(`Event booked: ${eventDate}`)
            //consider the event as an appointment between the patient and doctor and add it
            //to used slots
            const usedSlotsCollection = collection(db, 'usedSlots');
            const newUsedSlot = {
                doctorId: doctorId,
                slotStartTime: slotStartTime,
                patientId: auth.currentUser.uid,
            };

            addDoc(usedSlotsCollection, newUsedSlot)
                .then(() => {
                    // Slot added successfully
                    console.log('Slot added to usedSlots:', slotStartTime);
                    //make the cell grey
                    event.setProp('backgroundColor', 'grey');
                    
                
                    calendar.render();
                })
                .catch((error) => {
                    console.error('Error adding slot to usedSlots:', error);
                });
            
        }
    });

    await calendar.render();
    return calendar;
}


    return `${day}-${month}-${year} ${hours}:${minutes}`;
}