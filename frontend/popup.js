const pusher = new Pusher("28b3898fcdb6c881cf05", {
  cluster: "ap1",
  encrypted: true
});

document.getElementById("scores").addEventListener("click", () => {
  fetch("http://localhost:3000/start");
});

const channel = pusher.subscribe("realtime-updates");

channel.bind("scores", data => {
  const [teamOne, teamTwo] = data
  
  document.getElementById("results").innerHTML = `
    <span>${teamOne.name}</span> - ${teamOne.score}<br/>
    <span>${teamTwo.name}</span> - ${teamTwo.score}<br />
  `;
  
  // notify(teamOne, teamTwo);
});

const notify = (first_team, second_team) => {
   
  if (first_team.score !== 0 && second_team.score !== 0) {
    const notificationId = "notify"
  
    const options = {
      type:    'basic',
      iconUrl: './img/icon.png',
      title:   `${first_team.name} vs ${second_team.name}`,
      message: `There's been a score update on the game between ${first_team.name} and ${second_team.name}.`
    };
    
    chrome.notifications.create(notificationId, options);
    chrome.notifications.clear(notificationId);
  }
};