import axios from "../setup/axios";

const createReservation = (fullname, phonenumber, email, numberOfGuests, reservationDate, reservationTime) =>{
    return axios.post('/api/reservation', {
        fullname, phonenumber, email, numberOfGuests, reservationDate, reservationTime
    })
}

const createContact = (fullname, phonenumber, email, message) => {
    return axios.post('/api/contact', {
        fullname, phonenumber, email, message
    })
}

export {
    createReservation,
    createContact
};