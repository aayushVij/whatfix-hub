nw.Window.get().on("new-win-policy", function (frame, url, policy) {
  // do not open the window
  policy.ignore();
  // and open it in external browser
  nw.Shell.openExternal(url);
});
var win = nw.Window.get();

var wa = nw.Screen.screens[0].work_area;
win.moveTo(wa.x, wa.y);
win.resizeTo(wa.width, wa.height);
win.setShadow(false);

function checkTimestamp() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    "https://cdn.quickolabs.com/prod/d1b2235b-3a65-4b15-99b9-2bd394bd53ed/configuration.json",
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.production.timestamp);
      const timestamp = data.production.timestamp;
      const storedTimestamp = localStorage.getItem("timestamp");
      console.log(storedTimestamp);
      if (storedTimestamp) {
        if (timestamp !== storedTimestamp) {
          win.reloadIgnoringCache();
          localStorage.setItem("timestamp", timestamp);
          console.log("The timestamps do not match.");
        } else {
          console.log("The timestamps match. So Do nothing");
        }
      } else {
        localStorage.setItem("timestamp", timestamp);
        console.log("The timestamp has been added to local storage.");
      }
    })
    .catch((error) => console.log("error", error));
}

function reloadApp() {
  win.reload();
}

setInterval(checkTimestamp, 10000);
