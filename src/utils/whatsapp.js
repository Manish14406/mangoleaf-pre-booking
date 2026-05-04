export function generateWhatsAppLink(type, bookingData) {
  let message = "";

  if (type === "party") {
    message = `New Party Booking:
Name: ${bookingData.name}
Guests: ${bookingData.guests || bookingData.people}
Date: ${bookingData.date}
Time: ${bookingData.time === "morning" ? "12 PM - 3 PM" : bookingData.time === "night" ? "7 PM - 11 PM" : bookingData.time}
Type: ${bookingData.partyType || bookingData.menuType || bookingData.eventType}
Total: ₹${bookingData.total}
Advance Paid: ₹${bookingData.advance}`;
  }

  if (type === "table") {
    message = `New Table Booking:
Name: ${bookingData.name}
People: ${bookingData.people || bookingData.guests}
Date: ${bookingData.date}
Time: ${bookingData.time}`;
  }

  return `https://wa.me/917899402143?text=${encodeURIComponent(message)}`;
}
