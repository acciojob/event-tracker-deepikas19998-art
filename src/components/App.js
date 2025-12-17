
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Popup from "react-popup";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-popup/style.css";

const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [filter, setFilter] = useState("all");

  const handleSelectSlot = ({ start }) => {
    Popup.create({
      title: "Create Event",
      content: (
        <div>
          <input placeholder="Event Title" id="title" />
          <input placeholder="Event Location" id="location" />
        </div>
      ),
      buttons: {
        right: [
          {
            text: "Save",
            className: "mm-popup__btn",
            action: () => {
              const title = document.getElementById("title").value;
              const location = document.getElementById("location").value;
              if (title) {
                setEvents([
                  ...events,
                  {
                    start,
                    end: start,
                    title,
                    location,
                  },
                ]);
                Popup.close();
              }
            },
          },
        ],
      },
    });
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    Popup.create({
      title: "Edit/Delete Event",
      content: (
        <div>
          <input
            defaultValue={event.title}
            id="editTitle"
            placeholder="Event Title"
          />
        </div>
      ),
      buttons: {
        right: [
          {
            text: "Save",
            className: "mm-popup__btn--info",
            action: () => {
              const updatedTitle = document.getElementById("editTitle").value;
              setEvents(
                events.map((e) =>
                  e === event ? { ...e, title: updatedTitle } : e
                )
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

  const filteredEvents = events.filter((e) => {
    if (filter === "past") return moment(e.start).isBefore(moment(), "day");
    if (filter === "upcoming") return moment(e.start).isAfter(moment(), "day");
    return true;
  });

  const eventStyleGetter = (event) => {
    const bgColor = moment(event.start).isBefore(moment(), "day")
      ? "rgb(222, 105, 135)" // Past
      : "rgb(140, 189, 76)"; // Upcoming
    return { style: { backgroundColor: bgColor, color: "white" } };
  };

  return (
    <div className="App" style={{ margin: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
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
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
      <Popup />
    </div>
  );
}

export default App;

