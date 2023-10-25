
---
Database doctors
===

- CATHELAND Martin
- CHEVALLEY Roxanne
- PERBET Jean
- TOUKKO Rached

### See the website

The website can be accessed [here](https://martincatheland.com/database).

### The concept

We've been brainstorming a project that could genuinely make life easier, and we quickly hit upon the idea of creating an online platform for finding and booking appointments with doctors. As exchange students in Sweden, we've experienced firsthand how tricky it can be to locate doctors and get in touch with them.

### The features


| As a doctor | As a patient 
| - | - |
| Modify personal info | Modify personal info |
| See complete schedule | Search for new appointments in all specialities |
| Manage availability | See already booked apppointments|
| See detailed appointments | Cancel previously booked appointments|


### Project Timeline

```mermaid
gantt
    dateFormat MM-DD
    
    Register patient            :active, 09-05, 09-09
    Register doctor             :active, 09-05, 09-09
    Login / redirection         :active, 09-06, 09-10
    Search bar                  :active, 09-09, 09-12
    User settings               :active, 09-09, 09-12
    Book appointments           :active, 09-10, 09-15
    Display appointments        :active, 09-14, 09-19
    Doctor home page            :active, 09-15, 09-19
    Style / bug fixes           :active, 09-16, 09-20
````


### Infrastructure  

```mermaid
classDiagram
    class Authentication {
        - email: String
        - password: String
        - UID: String (PK)
        - display name: String
    }
    
    class Doctors {
        - uid: String (PK)
        - speciality: String
        - city: String
        - age: int
    }
    
    class Patients {
        - uid: String (PK)
        - age: int
    }
    
    class UsedSlots {
        - slot time: DateTime
        - patient's UID: String (FK)
        - doctor's UID: String (FK)
    }
    
    Authentication --|> Doctors : "uid"
    Authentication --|> Patients : "uid"
    Doctors -- UsedSlots : "doctor's UID"
    Patients -- UsedSlots : "patient's UID"
    


```

We used Firebase as a framework for authentication and database management. More particularly, we use Firebase Authentication to handle sign-in, registration, account deletion and sign-out procedures. We use the provided Firestore model to manage our databases.

1. Authentication is apart : it includes email, password, display name and user ID fields. The user ID allows us to link authentication and the Firestore collections storing both patients and doctors.

2. 'doctors' and 'patients' are collections in Firestore, where each document is identified by its respective user ID from the Authentication component. 'doctors' include the additional fields 'speciality', 'age' and 'location', whereas 'patients' include the additional field 'age'. These documents allow us to have more flexibility in case we need to add more features in the future.

3. 'usedSlots' is another collection in Firestore, used to store appointment information. Each document represents a booked time slot, and includes the following fields : slot time, patient's UID and doctor's UID. The patient's UID and doctor's UID are foreign keys pointing to the Authentication components.

This structure allows you to associate Authentication data with specific user roles (doctors or patients) and manage appointment slots efficently in the usedSlots collection. The foreign keys in the usedSlots collection establish relationships between patients, doctors and their respective appointments.

### Reflections

When initially thinking about our project, we struggled to decide between a runnable prototype on p5.js, or a complete web app. We prefered to separate the source code and the production environment, in order to have a more organized framework. Furthemore, choosing a web app allowed us to make our project available to everyone, as well as to get closer to what is really done in the professional world. 

Our choice of structure to store our databases and handle authentication was made easily. Firebase allowed us to access the databases remotely. Since we are four to be involved in this project, it was very useful to be able to access the databases whenever we wanted and wherever we were.

Regarding to security, we have decided to delegate security issues to Firebase, which already implements all the necessary measures. For example, we cannot see any passwords of our users which are salted and hashed. We are not vulnerable to SQL injection since we do not use SQL, and Firebase is pretty well-protected against other types of injection. We also 


decided to implement passwords instead of asymmetric cryptography to secure accounts, since it is easier to handle for users and the data is not confidential enough to ask our users such complex methods of authentication. We are well-aware that our app has flaws in terms of security, but regarding to the time we had and the needed security guarantees we were coherent.

### Video 
https://github.com/JEANPRBT/databasedoctors/assets/125833841/b12c4b7d-3784-4721-8dc5-1632bc25c911
