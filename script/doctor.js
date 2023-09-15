import {initializeApp} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
    getFirestore,
    getDoc,
    getDocs,
    doc,
    collection,
    where,
    query,
    addDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {signOutButton} from "./utils.js";

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

// Restrict page to logged-in doctor users
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "doctors", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Add a welcome message
            const welcomeMessage = document.getElementById('welcome-message');
            welcomeMessage.textContent = `Welcome ${user.displayName} !`;
        } else {
            window.location.href = "patient.html"; // If user is a patient, redirect to doctor page
        }
    } else {
        window.location = 'index.html'; // If user is not logged in, redirect to login page
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utils functions 

// Handle sign-out
signOutButton(document.getElementById('sign-out'), auth);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Function to display the calendar
async function createCalendar(calendarDiv,doc) {

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
    const usedSlotsQuery = query(collection(db, 'usedSlots'), where('doctorId', '==',doc.id));
    const usedSlotsSnapshot = await getDocs(usedSlotsQuery);
    const usedSlots = [];

    //upload the used slots for the doctor
    usedSlotsSnapshot.forEach((slotDoc) => {
        const slotData = slotDoc.data();
        usedSlots.push({
            slotStartTime: slotData.slotStartTime,
            doctorId: slotData.doctorId,
            patientId: slotData.patientId,
        });
    });


    //show availabilitites for the 50 next days
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
                if (available){
                    const event = {
                        title: 'Available',
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        dow: [currentDay.getDay()],
                        backgroundColor: 'dodgerblue',
                    };
                    events.push(event);
                }


                else if (doctor_app){
                    const event = {

                        title: 'Not Available',
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        dow: [currentDay.getDay()],
                        backgroundColor: 'red', // Set the background color to grey
                    };
                    events.push(event);

                }else{
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
        headerToolbar: {
            left: 'prev,next', // Customize the left section of the toolbar
            center: 'title',   // Customize the center section of the toolbar
            right: 'timeGridWeek,timeGridDay', // Customize the right section of the toolbar
        },
        eventContent: function (arg) {
            if (arg.event.backgroundColor === 'grey') {
                return 'Booked';
            } else if(arg.event.backgroundColor === 'red'){
                return 'Not Available';
            }
            else
            {
                return 'Available Slot';
            }
        },

        //this function is called when you click on an available slot
        eventClick: function (info) {
            const event = info.event; // The event object
            const slotStartTime = event.start.toISOString();
            const doctorId = doc.id;
            const eventDate = formatTime(event.start);

            if (event.backgroundColor === 'grey') {
                console.log(`Event is already booked: ${eventDate}`);
                return; // Exit the function if the slot is already booked
            }
            else if(event.backgroundColor === 'red'){
                //delete the event from the used slots
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
                console.log(`Event freed: ${eventDate}`);
                return;
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


            if(newUsedSlot.doctorId===newUsedSlot.patientId){
                addDoc(usedSlotsCollection, newUsedSlot)
                    .then(() => {
                        // Slot added successfully
                        console.log('Slot added to usedSlots:', slotStartTime);
                        //make the cell red
                        event.setProp('backgroundColor', 'red');
                        calendar.render();
                    })
                    .catch((error) => {
                        console.error('Error adding slot to usedSlots:', error);
                    });

            }
            else{
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
        },
    });

    await calendar.render();
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

document.addEventListener("DOMContentLoaded", function () {
    auth.onAuthStateChanged(function (user) {
        if (user) {
            const doctorInfo = {
                id: user.uid
            };
            const calendarDiv = document.getElementById("doccal");
            createCalendar(calendarDiv,doctorInfo);
        } else {
            // No user is authenticated, handle it here
            console.error("No authenticated user found.");
            // You might want to redirect the user to a login page or handle it differently.
        }
    });
});
    
