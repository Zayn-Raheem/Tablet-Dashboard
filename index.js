function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const time = `${hours}:${minutes}:${seconds}` ;
  document.getElementById("clock").innerHTML = time;
  console.log("clock is running")
}

function updateDate() {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ]
    const today = new Date();
    const weekDayNum = today.getDay();
    const weekday = days[weekDayNum];
    const month = today.getMonth();
    const dateToday = `${weekDayNum}, ${weekday} ${months[month]}`
    document.getElementById("date").innerHTML = dateToday;
    console.log(dateToday)

}

setInterval(updateClock, 1000);
updateClock();
updateDate();