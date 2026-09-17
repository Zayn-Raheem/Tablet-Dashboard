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
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const months = ["January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ]
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const date = `${day} ${months[month]} ${year}`
    document.getElementById("date").innerHTML = date;
    console.log(date)

}

setInterval(updateClock, 1000);
updateClock();
updateDate();