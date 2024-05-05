// CustomCalendar.js
import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import axios from "axios";
import { UserContext } from "../../App";

function CustomCalendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  let { currentUser, token } = useContext(UserContext);
  useEffect(() => {
    fetchEvents();
  }, [date]); // Reload events when date changes

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5555/events/${currentUser._id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      ); // Replace userId with actual user ID
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = formatDate(date);
      const hasEvents = events.some(event => formatDate(new Date(event.date)) === formattedDate);
      return hasEvents ? <div className="event-indicator"></div> : null;
    }
  };

  return (
    <div className="CustomCalendar">
      <Sidebar />
      <div className="main-calendar-container">
        <h1>Schedule</h1>
        <div className="calendar-container">
          <Calendar
            onChange={setDate}
            value={date}
            className="react-calendar"
            tileContent={tileContent}
          />
          <div className="event-details">
            <h2>{date.toDateString()}</h2>
            {events
              .filter(
                (event) => formatDate(new Date(event.date)) === formatDate(date)
              )
              .map((event, index) => (
                <div key={index} className="event">
                  <p>
                    <strong>{event.time}</strong> - {event.title}{" "}
                    {event.location}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomCalendar;
