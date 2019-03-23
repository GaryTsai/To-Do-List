// var Content = document.getElementById('EventContent');
var btn_Add = document.getElementById("EventAdd");
var AddList = document.querySelector(".EventList");
var CurrentDate = DateFormat((date = new Date())); //取得現在日期
btn_Add.addEventListener("click", AddEvent);
var priority = document.querySelector("#Event_priority");
priority.addEventListener("click", selectPriotity);
//EventColor
var EventColor = {
  "simple": "primary",
  "medium": "warning",
  "important": "danger"
};
//初始
updateList();

AddList.addEventListener("click", EventDelete);
function AddEvent() {
  let EventContent = document.getElementById("EventContent");
  let EventList = [];
    //抓取優先權
  let priority = getSelectButton();
  if(priority==undefined){return}
  EventList.push({
    event: EventContent.value,
    priority: priority,
    finished: false
  });

  //新增資料
  if (!localStorage.getItem(CurrentDate)) {
    localStorage.setItem(CurrentDate, JSON.stringify(EventList));
  } else {
    let getList = JSON.parse(localStorage.getItem(CurrentDate));
    getList.push({
      event: EventContent.value,
      priority: priority,
      finished: false
    });

    localStorage.setItem(CurrentDate, JSON.stringify(getList));
  }
  EventContent.value = "";
  updateList();
}
//更新事件條
function updateList() {
  let todayEventList = JSON.parse(localStorage.getItem(CurrentDate));
  let listFrame = "";
  for (let i = 0; i < todayEventList.length; i++) {
    if (todayEventList[i]["finished"]) {
      listFrame += `<div data-index=${i} style="cursor: pointer;
        "class=" eventComplete alert alert-primary" role="alert">
        ${CurrentDate}=== ${todayEventList[i]["event"]}
        <a title="刪除" class="EventDelete close"style="float:right"data-index=${i} href="#">×</a></div>`;
    } else {
      listFrame += `<div data-index=${i} style="cursor: pointer;
        "class=" alert alert-${EventColor[todayEventList[i]["priority"]]}" role="alert">
        ${CurrentDate}=== ${todayEventList[i]["event"]}
        <a title="刪除"class="EventDelete close"style="float:right"data-index=${i} href="#">×</a></div>`;
    }
  }
  AddList.innerHTML = listFrame;
}
//事件已完成
AddList.addEventListener("click", eventComplete);
function eventComplete(e) {
  if (e.target.nodeName !== "DIV") {
    return;
  }
  e.target.classList.toggle("eventComplete");
  let data = JSON.parse(localStorage.getItem(CurrentDate));
  data[e.target.dataset.index]["finished"] = true;
  localStorage.setItem(CurrentDate, JSON.stringify(data));
  updateList();
}
//時間字串處理
function DateFormat(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  //    let hour = date.getHours();
  //    let minute = date.getMinutes();
  //    minute = minuteAdjust(minute);
  //    let DateTime = `${year}-${month}-${day} ${hour}:${minute}`;
  let CurrentDate = `${year}-${month}-${day}`;

  return CurrentDate;
}
//分鐘補0
function minuteAdjust(minute) {
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return minute;
}
//事件刪除
function EventDelete(e) {
  e.preventDefault();
  if (e.target.nodeName !== "A") {
    return;
  }
  let indexOfDelete = e.target.dataset.index;
  let list = JSON.parse(localStorage.getItem(CurrentDate));
  list.splice(indexOfDelete, 1);
  localStorage.setItem(CurrentDate, JSON.stringify(list));
  updateList();
}
//選擇優先權
function selectPriotity(e) {
  if (e.target.tagName !== "BUTTON") {
    return;
  }
  e.target.classList.toggle("click_btn");
  let btn_value = e.target.value; //所選按鈕
  checkSelectButton(btn_value);
}
//刪除原本選的
function checkSelectButton(btn_value) {
  var selectbtn = document.querySelectorAll(".select_btn");
  for (let i = 0; i < selectbtn.length; i++) {
    if (selectbtn[i].value !== btn_value) {
      if (selectbtn[i].classList.contains("click_btn")) {
        selectbtn[i].classList.remove("click_btn");
      }
    }
  }
}
function getSelectButton() {
  let selectbtn = document.querySelectorAll(".select_btn");
  let checkpriority = false;
  for (let i = 0; i < selectbtn.length; i++) {
    if (selectbtn[i].classList.contains("click_btn") === true) {
      checkpriority = true;
      return selectbtn[i].value;
    }
  }
  if (checkpriority === false) {
    alert("請輸入事件優先權");
    return ;
  }
}
