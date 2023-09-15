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

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeiRIFp3pz2fNxMlGCsTc-NA7GviQghZU",
    authDomain: "database-project-bd7e8.firebaseapp.com",
    projectId: "database-project-bd7e8",
    storageBucket: "database-project-bd7e8.appspot.com",
    messagingSenderId: "771888139690",
    appId: "1:771888139690:web:6b1e5ee383ec06df976fd3",
};

// Initializations of Firebase, Firebase Authentication and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
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

//THIS PART TAKES CARE OF GETTING THE PATIENT QUERY AND SEARCHING DOCTORS

// Get the doctors database
const doctorsDB = collection(db, 'doctors');
const searchForm = document.querySelector('form');
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Collect user input
    const speciality = document.getElementById('speciality').value;
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
    await displaySearchResults(querySnapshot);
});

//Function to display the doctors found
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

    //iterate over each
    querySnapshot.forEach((doc) => {

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
        createCalendar(calendarDiv, doc);

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
        const slotTuple = {
            slotStartTime: slotData.slotStartTime,
            patientId: slotData.patientId,
            doctorId: slotData.doctorId
        };
        usedSlots.push(slotTuple);
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

                var available = true;
                var booked_by_self = false;
                usedSlots.forEach((usedSlot => {
                    const usedSlotDate = new Date(usedSlot.slotStartTime);
                    if(usedSlotDate.getTime() === startDate.getTime()){
                        available = false;
                        if(usedSlot.patientId === auth.currentUser.uid){
                            booked_by_self = true;
                        }
                    }
                }));

                // if the slot is available for booking
                if (available) {
                    const event = {
                        title: 'Available',
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        dow: [currentDay.getDay()],
                    };
                    events.push(event);

                //if the slot is already booked by patient
                } else if (booked_by_self){
                    const event = {
                        title: 'BOOKED',
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        dow: [currentDay.getDay()],
                        backgroundColor: 'green', // Set the background color to green
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
        headerToolbar: {
            left: 'prev,next', // Customize the left section of the toolbar
            center: 'title',   // Customize the center section of the toolbar
            right: ',timeGridWeek,timeGridDay', // Customize the right section of the toolbar
        },
        eventContent: function (arg) {
            if (arg.event.backgroundColor === 'green') {
                return 'BOOKED';
            } else {
                return 'BOOK';
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
                    //make the cell green
                    event.setProp('backgroundColor', 'green');
                    //calendar.render();
                })
                .catch((error) => {
                    console.error('Error adding slot to usedSlots:', error);
                });
            
        }
    });

    await calendar.render();
    return calendar;
}


