
---
Database doctors
===

- CATHELAND Martin
- CHEVALLEY Roxanne
- PERBET Jean
- TOUKKO Rached

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


