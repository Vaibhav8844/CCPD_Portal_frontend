import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { api } from "../api/client";
import "./styles/ViewCalendar.css";

export default function ViewCalendar() {
  const [events, setEvents] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
  api.get("/placements/calendar").then((res) => {
    console.log("Calendar API response:", res.data);
  });
}, []);


  useEffect(() => {
    api.get("/placements/calendar").then((res) => {
      const evts = [];

      res.data.data.forEach((c) => {
        if (c.ppt) evts.push(buildEvent(c, "PPT", c.ppt, "#2563eb"));
        if (c.ot) evts.push(buildEvent(c, "OT", c.ot, "#16a34a"));
        if (c.interview)
          evts.push(buildEvent(c, "Interview", c.interview, "#dc2626"));
      });

      setEvents(evts);
    });
  }, []);

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <div>
          <h1>Company Drive Calendar</h1>
          <div className="calendar-subtitle">
            Approved PPTs, OTs and Interviews
          </div>
        </div>
      </div>

      <div className="calendar-card">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="70vh"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "",
          }}
          eventMouseEnter={(info) => {
            const rect = info.el.getBoundingClientRect();
            const tooltipWidth = 18 * 16;
            const pad = 12;

            let x = rect.right + pad;
            let y = rect.top + window.scrollY;

            if (x + tooltipWidth > window.innerWidth) {
              x = rect.left - tooltipWidth - pad;
            }

            if (y + 240 > window.innerHeight + window.scrollY) {
              y = window.innerHeight + window.scrollY - 260;
            }

            setTooltip({
              x,
              y,
              ...info.event.extendedProps,
            });
          }}
          eventMouseLeave={() => setTooltip(null)}
        />
      </div>

      {tooltip && <Tooltip data={tooltip} />}
    </div>
  );
}
function buildEvent(company, type, date, color) {
  return {
    title: `${company.company} – ${type}`,
    date,
    backgroundColor: color,
    borderColor: color,
    textColor: "#fff",
    extendedProps: {
      company: company.company,
      spoc: company.spoc_name,
      eligible_pool: company.eligible_pool,
      fte_ctc: company.fte_ctc,
      fte_base: company.fte_base,
      expected_hires: company.expected_hires,
      type,
      date,
    },
  };
}
function Tooltip({ data }) {
  return (
    <div className="calendar-tooltip" style={{ top: data.y, left: data.x }}>
      <div className="tooltip-header">
        <strong>{data.company}</strong>
        <span className="tooltip-chip">{data.type}</span>
      </div>

      <div className="tooltip-row">
        <span>SPOC</span>
        <b>{data.spoc || "—"}</b>
      </div>

      <div className="tooltip-row">
        <span>Eligible</span>
        <b>{data.eligible_pool || "—"}</b>
      </div>

      <div className="tooltip-row">
        <span>CTC</span>
        <b>{data.fte_ctc || "—"}</b>
      </div>

      <div className="tooltip-row">
        <span>Base</span>
        <b>{data.fte_base || "—"}</b>
      </div>

      <div className="tooltip-row">
        <span>Hires</span>
        <b>{data.expected_hires || "—"}</b>
      </div>

      <div className="tooltip-date">{new Date(data.date).toLocaleString()}</div>
    </div>
  );
}
