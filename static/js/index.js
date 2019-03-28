var btn_Add = document.getElementById("EventAdd");
var AddList = document.querySelector(".EventList ol");
var CurrentDate = DateFormat((date = new Date())); //Get Today date
btn_Add.addEventListener("click", AddEvent);
var priority = document.querySelector("#Event_priority");
priority.addEventListener("click", selectPriotity);
AddList.addEventListener("click", EventUpdate);
//EventColor
var EventColor = {
  "simple": "primary",
  "medium": "warning",
  "important": "danger"
};
//
var keyItem="";
var index="";
//initialtion
updateList();

AddList.addEventListener("click", EventDelete);
function AddEvent() {
  let EventContent = document.getElementById("EventContent");
  let EventList = [];
    //Get event priority
  let priority = getSelectButton();
  if(priority==undefined){return}
  EventList.push({
    event: EventContent.value,
    priority: priority,
    finished: false
  });

  //Add data
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
//Show update Windows
function EventUpdate(e) {
  keyItem = e.target.parentNode.parentNode.querySelector("span").textContent;
  index = e.target.parentNode.dataset.index;
  document.getElementById("UpdateContent").value = e.target.parentNode.parentNode.querySelector("p").textContent;
}
document.querySelector("#ContentUpdate").onclick = function (){
 let content = document.getElementById("UpdateContent").value;
 let EventList=JSON.parse(localStorage.getItem(keyItem));
 EventList[index]["event"] = content;
 localStorage.setItem(keyItem,JSON.stringify(EventList));
 updateList();
}

//Update state of event
function updateList() {
  let todayEventList = JSON.parse(localStorage.getItem(CurrentDate));
  let listFrame = "";
  for (let i = 0; i < todayEventList.length; i++) {
    if (todayEventList[i]["finished"]) {
      listFrame += `<li><div data-index=${i} style="cursor: pointer;
        "class=" eventComplete alert alert-primary" role="alert">
        <a class="EventUpdate"data-index=${i} data-toggle="modal" data-target="#exampleModal" style='font-size:24px'><i class='fas fa-edit'></i></a>

        <span>${CurrentDate}</span>:<p> ${todayEventList[i]["event"]}</p>
        <a title="刪除" class="EventDelete close"style="float:right"data-index=${i} href="#">×</a></div></li>`;
    } else {
      listFrame += `<li><div data-index=${i} style="cursor: pointer;
        "class=" alert alert-${EventColor[todayEventList[i]["priority"]]}" role="alert">
        <a class="EventUpdate"data-index=${i} data-toggle="modal" data-target="#exampleModal"style='font-size:24px'> <i class='fas fa-edit'></i></a>

        <span>${CurrentDate}</span>:<p> ${todayEventList[i]["event"]}</p>
        <a title="刪除"class="EventDelete close"style="float:right"data-index=${i} href="#">×</a></div></li>`;
    }
  }
  AddList.innerHTML = listFrame;
  var TodayItem = document.querySelectorAll(".TodayItem");
  for (let i = 0; i < TodayItem.length; i++) {
    TodayItem[i].innerHTML = todayEventList.length;
  }
  let CompleteLen = document.getElementsByClassName('EventComplete').length;
    document.getElementById("ItemComplete").innerHTML=CompleteLen ;
}
//Change event color state in class
AddList.addEventListener("click", eventComplete,false);
function eventComplete(e) {
  if (e.target.nodeName !== "DIV") {
    return;
  }
  e.target.classList.toggle("eventComplete");
  //Handle event complete
  let data = JSON.parse(localStorage.getItem(CurrentDate));
  if(data[e.target.dataset.index]["finished"]){
    data[e.target.dataset.index]["finished"] = false;
  }
  else{
    data[e.target.dataset.index]["finished"] = true;
  }
  localStorage.setItem(CurrentDate, JSON.stringify(data));
  updateList();
  if(document.getElementsByClassName('eventComplete').length === data.length){
    Swal.fire({
      position: 'center',
      type: 'success',
      title: '恭喜！',
      html:
      "<b>你今天的工作已經完成了</b>, ",
      showConfirmButton: false,
      timer: 1000
    })
  }
}
//Date string process
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
//Adjust that  minute plus string 0
function minuteAdjust(minute) {
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return minute;
}
//Event Delete
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
//When choice priority
function selectPriotity(e) {
  if (e.target.tagName !== "BUTTON") {
    return;
  }
  e.target.classList.toggle("click_btn");
  let btn_value = e.target.value; //所選按鈕
  checkSelectButton(btn_value);
}
//Delete class of priority when you choice other priority
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
//Get the priority
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
    Swal.fire({
      title: "請選擇事件的優先權",
      type: "warning",
      confirmButtonText: '瞭解',

    });
    return ;
  }
}
