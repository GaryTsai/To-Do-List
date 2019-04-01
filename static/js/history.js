var his_event = document.querySelector(".EventHistory ol");
var date = "";
var week = WeekFormat();
var HistoryEvent = "";
var EventColor = {
  simple: "primary",
  medium: "warning",
  important: "danger"
};
History();
function History() {
  for (let i = 0; i < week.length; i++) {
    if (localStorage.getItem(week[i])) {
      Header_Time = `<h1>${week[i]}</h1>`;
      Content_event = getHistoryEvent(week[i], Header_Time);

      his_event.innerHTML = `${Content_event}`;
    }
  }
  // console.log(his_event);
}
function getHistoryEvent(week, Header_Time) {
  let data = JSON.parse(localStorage.getItem(week));
  HistoryEvent += Header_Time;

  for (let i = 0; i < data.length; i++) {
    if (data[i]["finished"]) {
      HistoryEvent += `<li><div data-index=${i} style="cursor: pointer;
        "class=" eventComplete alert alert-${EventColor[data[i]["priority"]]}" role="alert">
        <span>${week}</span>:<p> ${data[i]["event"]}</p>
        <a title="刪除" class="EventDelete close"style="float:right"data-index=${i} href="#">×</a></div></li>`;
    } else {
      HistoryEvent += `<li><div data-index=${i} style="cursor: pointer;
        "class="  alert alert-${EventColor[data[i]["priority"]]}" role="alert">
        <span>${week}</span>:<p>${data[i]["event"]}</p>
        <a title="刪除" class="EventDelete close"style="float:right"data-index=${i} href="#">×</a></div></li>`;
    }
  }console.log(HistoryEvent);
  return HistoryEvent;
}
function WeekFormat() {
  var date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let week = 8;
  let weekDay = [];

  for (let i = 1; i < 8; i++) {
    if (day - i <= 0) {
      month-=1;
      date.setFullYear(year, month, 0);
      day = date.getDate()+1;
    }
    if (month === 0) {
      month = 12;
      year -= 1;
    }
    weekDay.push(`${year}-${month}-${day - i}`);
  }
        console.log(weekDay);
  return weekDay;
}
