// Import required React functions
import { createContext, useContext, useState } from "react";

/*
  1. Create a Context
  This will act like a global container for your booking data
*/
const BookingContext = createContext();

/*
  2. Create a Provider Component
  This wraps your app and provides data to all pages
*/
export const BookingProvider = ({ children }) => {

  /*
    bookingData = stores all booking information
    setBookingData = function to update it
  */
  const [bookingData, setBookingData] = useState({

    // Type of booking (table or party)
    type: "",

    // Date selected by user
    date: "",

    // Time slot selected
    time: "",

    // Number of people
    people: 0,

    // Selected hall (for party booking)
    hall: "",

    // Menu type (liquor / non-liquor)
    menuType: "",

    // Selected food items (array)
    foodItems: [],

    // Total calculated amount
    total: 0,

    // Customer details
    name: "",
    phone: ""
  });

  /*
    Provider makes bookingData available to ALL components
  */
  return (
    <BookingContext.Provider value={{ bookingData, setBookingData }}>
      {children}
    </BookingContext.Provider>
  );
};

/*
  3. Custom Hook
  This makes it easy to use context in any page
*/
export const useBooking = () => useContext(BookingContext);