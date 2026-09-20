let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth(); // 0-indexed

function openMonthView() {
  document.getElementById("month-view").style.display = "block";
  renderMonthGrid();
}

function closeMonthView() {
  document.getElementById("month-view").style.display = "none";
}

function changeMonth(direction) {
  viewMonth += direction;

  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear += 1;
  } else if (viewMonth < 0) {
    viewMonth = 11;
    viewYear -= 1;
  }

  renderMonthGrid();
}

async function renderMonthGrid() {
  // To be implemented next
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const time = `${hours}:${minutes}:${seconds}` ;
  document.getElementById("clock").innerHTML = time;
  
  console.log("clock is running")

  return time;
}

function updateDate() {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    const today = new Date();
    const weekDayNum = today.getDay();
    const weekday = days[weekDayNum];
    const month = today.getMonth();
    const dayOfMonth = today.getDate();

    const dateToday = `${weekday}, ${months[month]} ${dayOfMonth}`;
    
    document.getElementById("date").innerHTML = dateToday;
    console.log(dateToday);
}

async function updateWeather() {
    const weatherApi = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Birmingham,UK&appid=93eab7c744e431f9d47792b7b9f09238&units=metric')
    const weatherData = await weatherApi.json()
    const temperature = weatherData.main.temp;
    const temperatureDisplay = `${Math.round(temperature, 2)}°C`

    const weatherDescription = weatherData.weather[0].description;    
    const humidity = weatherData.main.humidity;
    const humidityDisplay = `HUMIDITY: ${humidity}%`

    const windSpeed = weatherData.wind.speed;
    const windSpeedKmh = Math.round(windSpeed * 3.6);
    const windDisplay = `WIND: ${windSpeedKmh}KM/H`

    const cloudCover = weatherData.clouds.all;
    const cloudCoverDisplay = `Cloud Cover: ${cloudCover}%`

    const feelsLike = weatherData.main.feels_like;
    const feelsLikeDisplay = `Feels like: ${feelsLike}°C` 

    document.getElementById("temperature-detail").innerHTML = temperatureDisplay;
    document.getElementById("temperature-main").innerHTML= temperatureDisplay;
    document.getElementById("weather").innerHTML= weatherDescription;
    document.getElementById("humidity").innerHTML = humidityDisplay;
    document.getElementById("windSpeed").innerHTML = windDisplay;
    document.getElementById("cloud_cover").innerHTML = cloudCoverDisplay;
    document.getElementById("feels_like").innerHTML = feelsLikeDisplay;
}

let prayerData = null;

async function fetchPrayerTimes() {
    try {
        const prayerAPI = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Birmingham&country=UK&method=1');
        const json = await prayerAPI.json();
        const timings = json.data.timings;

        prayerData = [
            { name: "FAJR", time: timings.Fajr },
            { name: "DHUHR", time: timings.Dhuhr },
            { name: "ASR", time: timings.Asr },
            { name: "MAGHRIB", time: timings.Maghrib },
            { name: "ISHA", time: timings.Isha }
        ];

        updatePrayerDisplay();
    } catch (error) {
        console.error("Error fetching prayer times:", error);
    }
}

function updatePrayerDisplay() {
    if (!prayerData) return;

    const now = new Date();

    function getPrayerDate(timeStr, addDays = 0) {
        const [h, m] = timeStr.split(':').map(Number);
        const d = new Date(now);
        d.setDate(d.getDate() + addDays);
        d.setHours(h, m, 0, 0);
        return d;
    }

    let currentPrayer = "ISHA";
    let nextPrayerDate = getPrayerDate(prayerData[0].time, 1);

    for (let i = 0; i < prayerData.length; i++) {
        const prayerDate = getPrayerDate(prayerData[i].time);

        if (now >= prayerDate) {
            currentPrayer = prayerData[i].name;

            if (i < prayerData.length - 1) {
                nextPrayerDate = getPrayerDate(prayerData[i + 1].time);
            } else {
                nextPrayerDate = getPrayerDate(prayerData[0].time, 1);
            }
        } else if (i === 0) {
            nextPrayerDate = prayerDate;
        }
    }

    const diffMs = nextPrayerDate - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60)).toString().padStart(2, "0");
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");

    document.getElementById("current-prayer").innerHTML = currentPrayer;
    document.getElementById("next-prayer-countdown").innerHTML = `NEXT IN ${diffHours}H ${diffMinutes}M`;

    document.getElementById("fajr-detail").innerHTML = `FAJR: ${prayerData[0].time}`;
    document.getElementById("dhuhr-detail").innerHTML = `DHUHR: ${prayerData[1].time}`;
    document.getElementById("asr-detail").innerHTML = `ASR: ${prayerData[2].time}`;
    document.getElementById("maghrib-detail").innerHTML = `MAGHRIB: ${prayerData[3].time}`;
    document.getElementById("isha-detail").innerHTML = `ISHA: ${prayerData[4].time}`;
}

function formatEventTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

async function updateCalendar() {
  try {
    const response = await fetch("https://tablet-dashboard-backend.onrender.com/api/calendar");
    const events = await response.json();

    let html = "";
    for (const event of events) {
      const timeFormatted = formatEventTime(event.start);
      // Fallback display if start time is missing or invalid
      const timeDisplay = timeFormatted ? `<strong>${timeFormatted}</strong> - ` : "";
      
      html += `<li>${timeDisplay}${event.summary}</li>`;
    }

    if (events.length === 0) {
      html = "<li>No events scheduled</li>";
    }

    document.getElementById("calendar-events").innerHTML = html;
  } catch (error) {
    console.error("Error fetching calendar:", error);
    document.getElementById("calendar-events").innerHTML = "<li>Unable to load events</li>";
  }
}

// --- TASK FILTERING ADDITIONS ---
let allTasks = [];
let currentView = "today";

function categorizeTask(task) {
  if (task.completed) {
    return "completed";
  }

  if (!task.due) {
    return "today";
  }

  const dueDate = new Date(task.due);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate <= today) {
    return "today";
  }

  return "upcoming";
}

function renderTasks() {
  const filteredTasks = allTasks.filter((task) => categorizeTask(task) === currentView);

  let html = "";
  for (const task of filteredTasks) {
    const checkmark = task.completed ? "[X]" : "[ ]";
    html += `<li>${checkmark} ${task.title}</li>`;
  }

  if (filteredTasks.length === 0) {
    html = `<li>No ${currentView} tasks</li>`;
  }

  document.getElementById("task-list").innerHTML = html;

  const tabs = ["today", "upcoming", "completed"];
  tabs.forEach((tab) => {
    const btn = document.getElementById(`tab-${tab}`);
    if (btn) {
      if (tab === currentView) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
  });
}

function setTaskView(view) {
  currentView = view;
  renderTasks();
}

async function updateTasks() {
  try {
    const response = await fetch("https://tablet-dashboard-backend.onrender.com/api/tasks");
    allTasks = await response.json();
    renderTasks();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    document.getElementById("task-list").innerHTML = "<li>Unable to load tasks</li>";
  }
}

function getFirstWeekday(year, month) {
  // month is 0-indexed (8 = September)
  const firstDay = new Date(year, month, 1);
  return firstDay.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}

function getDaysInMonth(year, month) {
  // Day 0 of October (month + 1 = 9) resolves to last day of September
  const lastDay = new Date(year, month + 1, 0);
  return lastDay.getDate();
}

// Running for September 2026:
const year = 2026;
const monthJS = 8; // September in 0-indexed JS


function groupEventsByDay(events) {
  const eventsByDay = {};

  for (const event of events) {
    if (!event.start) continue;

    // Google Calendar events use start.dateTime for timed events or start.date for all-day events
    const startDateStr = typeof event.start === "object" 
      ? (event.start.dateTime || event.start.date) 
      : event.start;

    if (!startDateStr) continue;

    const eventDate = new Date(startDateStr);
    const dayNumber = eventDate.getDate();

    if (!eventsByDay[dayNumber]) {
      eventsByDay[dayNumber] = [];
    }

    // Check if it's a date-only string (all-day event like "2026-05-21")
    const isAllDay = !startDateStr.includes("T");
    const timeFormatted = isAllDay ? "" : formatEventTime(startDateStr);
    
    const displayTitle = timeFormatted ? `${timeFormatted} ${event.summary}` : event.summary;

    eventsByDay[dayNumber].push(displayTitle);
  }

  return eventsByDay;
}

async function renderMonthGrid() {
  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  // 1. Update month-title text (e.g. "SEPTEMBER 2026")
  document.getElementById("month-title").innerText = `${months[viewMonth]} ${viewYear}`;

  const monthGridEl = document.getElementById("month-grid");
  monthGridEl.innerHTML = "<div class='day-cell'>Loading...</div>";

  try {
    // 2. Fetch events for the selected month (+1 conversion for 1-indexed API query)
    const response = await fetch(
      `https://tablet-dashboard-backend.onrender.com/api/calendar/month?year=${viewYear}&month=${viewMonth + 1}`
    );
    const data = await response.json();
    
    // Extract array safely from the wrapper object { status: "success", ..., events: [...] }
    const events = data.events || [];

    // 3. Group events by day number (1-31)
    const eventsByDay = groupEventsByDay(events);

    // 4. Calculate grid layout parameters
    const firstWeekday = getFirstWeekday(viewYear, viewMonth);
    const totalDays = getDaysInMonth(viewYear, viewMonth);

    let html = "";

    // 5. Render blank leading padding cells
    for (let i = 0; i < firstWeekday; i++) {
      html += `<div class="day-cell empty"></div>`;
    }

    // 6. Render standard day cells (1 to totalDays)
    for (let day = 1; day <= totalDays; day++) {
      const dayEvents = eventsByDay[day] || [];
      
      let eventsHtml = "";
      if (dayEvents.length > 0) {
        eventsHtml = dayEvents
          .map((title) => `<div class="event-title">${title}</div>`)
          .join("");
      }

      html += `
        <div class="day-cell">
          <div class="day-number">${day}</div>
          ${eventsHtml}
        </div>
      `;
    }

    monthGridEl.innerHTML = html;
  } catch (error) {
    console.error("Error fetching month grid events:", error);
    monthGridEl.innerHTML = "<div class='day-cell'>Unable to load month view</div>";
  }
}


console.log("First Weekday Index:", getFirstWeekday(year, monthJS));
console.log("Total Days in Month:", getDaysInMonth(year, monthJS));
setInterval(updatePrayerDisplay, 30000);
setInterval(updateClock, 1000);
setInterval(updateWeather, 120000);
updateClock();
fetchPrayerTimes();
updateWeather();
updateDate();
updateTasks();
updateCalendar();