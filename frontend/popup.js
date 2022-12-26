Pusher.logToConsole = true;
const pusher = new Pusher("28b3898fcdb6c881cf05", {
  cluster: "ap1",
  forceTLS: true,
  channelAuthorization: {
    endpoint: "http://localhost:5000/pusher/auth"
  },
});

document.getElementById("scores").addEventListener("click", () => {
  fetch("http://localhost:5000/start");
});

const channel = pusher.subscribe("realtime-updates");

channel.bind("scores", (data) => {
  const [teamOne, teamTwo] = data;

  document.getElementById("results").innerHTML = `
    <span>${teamOne.name}</span> - ${teamOne.score}<br/>
    <span>${teamTwo.name}</span> - ${teamTwo.score}<br />
  `;

  // notify(teamOne, teamTwo);
});

const notify = (first_team, second_team) => {
  if (first_team.score !== 0 && second_team.score !== 0) {
    const notificationId = "notify";

    const options = {
      type: "basic",
      iconUrl: "./img/icon.png",
      title: `${first_team.name} vs ${second_team.name}`,
      message: `There's been a score update on the game between ${first_team.name} and ${second_team.name}.`,
    };

    chrome.notifications.create(notificationId, options);
    chrome.notifications.clear(notificationId);
  }
};

if (!document.cookie.match("(^|;) ?user_id=([^;]*)(;|$)")) {
  // Primitive authorization! This 'user_id' cookie is read by your authorization endpoint,
  // and used as the user_id in the subscription to the 'presence-quickstart'
  // channel. This is then displayed to all users in the user list.
  // In your production app, you should use a secure authorization system.
  document.cookie = "user_id=" + prompt("Your initials:");
}
const channelUser = pusher.subscribe("presence-quickstart");
const hashCode = (s) =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
function addMemberToUserList(memberId) {
  userEl = document.createElement("div");
  userEl.id = "user_" + memberId;
  userEl.innerText = memberId;
  userEl.style.backgroundColor =
    "hsl(" + (hashCode(memberId) % 360) + ",70%,60%)";
  document.getElementById("user_list").appendChild(userEl);
}
channelUser.bind("pusher:subscription_succeeded", () =>
  channelUser.members.each((member) => {
    console.log(22222222222, member);
    addMemberToUserList(member.id);
  })
);
channelUser.bind("pusher:member_added", (member) => {
  console.log(33333, member);
  addMemberToUserList(member.id);
});
channelUser.bind("pusher:member_removed", (member) => {
  const userEl = document.getElementById("user_" + member.id);
  userEl.parentNode.removeChild(userEl);
});
