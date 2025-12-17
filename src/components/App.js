import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Popup from "react-popup";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-popup/style.css";

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  // Add Event
  const handleSelectSlot = ({ start }) => {
    Popup.create({
      title: "Create Event",
      content: `
        <input placeholder="Event Title" id="event-title" />
        <input placeholder="Event Location" id="event-location" />
      `,
      buttons: {
        right: [
          {
            text: "Save",
            className: "mm-popup__btn",
            action: () => {
              const title = document.getElementById("event-title").value;
              const location = document.getElementById("event-location").value;
              if (title) {
                setEvents([...events, { start, title, location }]);
              }
              Popup.close();
            },
          },
        ],
      },
    });
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const now = new Date();
    if (filter === "past") return new Date(event.start) < now;
    if (filter === "upcoming") return new Date(event.start) >= now;
    return true;
  });

  // Event styling
  const eventStyleGetter = (event) => {
    const now = new Date();
    const style = {
      backgroundColor:
        new Date(event.start) < now
          ? "rgb(222, 105, 135)" // past
          : "rgb(140, 189, 76)", // upcoming
      color: "white",
    };
    return { style };
  };

  // Edit/Delete Event
  const handleSelectEvent = (event) => {
    Popup.create({
      title: "Edit/Delete Event",
      content: `
        <input placeholder="Event Title" id="edit-title" value="${event.title}" />
      `,
      buttons: {
        right: [
          {
            text: "Save",
            className: "mm-popup__btn--info",
            action: () => {
              const newTitle = document.getElementById("edit-title").value;
              setEvents(
                events.map((e) => (e === event ? { ...e, title: newTitle } : e))
              );
              Popup.close();
            },
          },
          {
            text: "Delete",
            className: "mm-popup__btn--danger",
            action: () => {
              setEvents(events.filter((e) => e !== event));
              Popup.close();
            },
          },
        ],
      },
    });
  };

  return (
    <div>
      <div className="filters">
        <button className="btn" onClick={() => setFilter("all")}>
          All
        </button>
        <button className="btn" onClick={() => setFilter("past")}>
          Past
        </button>
        <button className="btn" onClick={() => setFilter("upcoming")}>
          Upcoming
        </button>
      </div>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="start"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default App;
