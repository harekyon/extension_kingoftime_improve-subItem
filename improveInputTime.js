let getTimeTable = document.getElementsByTagName("td");
const pattern = /^\d{4}年 \d{2}月 \d{2}日 \d{2}時 \d{2}分$/g;

let formatedTime = [];
Array.from(getTimeTable).map((t) => {
  if (t.innerText.match(pattern)) {
    const date = t.innerText;
    const hourArrayNum = date.indexOf("時");
    const minutesArrayNum = date.indexOf("分");
    const hourText = date.substring(hourArrayNum - 2, hourArrayNum);
    const minutesText = date.substring(minutesArrayNum - 2, minutesArrayNum);
    const timeResult = hourText + ":" + minutesText;
    formatedTime.push(timeResult);
  }
});
let inputTimeElement;
function getInputElement() {
  inputTimeElement = [];
  const inputElementArray = Array.from(document.getElementsByTagName("input"));
  inputElementArray.map((i) => {
    if (
      i.id.includes("start_time_90000") ||
      i.id.match(/^start_time_\d+$/) ||
      i.id.includes("end_time_90000") ||
      i.id.match(/^end_time_\d+$/)
    ) {
      inputTimeElement.push(i);
    }
  });
}

function addTimeButtonElement() {
  inputTimeElement.map((i, idx) => {
    i.insertAdjacentElement("afterend", createTimeButton(idx));
  });
}
function addTimeButtonEleWhenClicAddItem() {
  inputTimeElement.map((i, idx) => {
    //項目を追加した場合は、追加分だけボタンを増やしたいので、以下の条件式を追加
    if (inputTimeElement.length - 2 <= idx) {
      i.insertAdjacentElement("afterend", createTimeButton(idx));
    }
  });
}
function createTimeButton(num) {
  const buttonTimeButtonWrapper = document.createElement("div");
  formatedTime.map((f) => {
    const buttonTime = document.createElement("button");
    buttonTime.innerText = f;
    buttonTime.type = "button";
    buttonTime.style.fontSize = "10px";
    buttonTime.style.width = "auto";
    buttonTime.style.padding = "0 2px";
    buttonTime.tabIndex = "-1";
    buttonTimeButtonWrapper.appendChild(buttonTime);
    buttonTime.onclick = function () {
      inputTimeElement[num].value = f;
      const startTimeText = "start_time_";
      const endTimeText = "end_time_";

      if (inputTimeElement[num].id.includes(startTimeText)) {
        const eigenvalue = inputTimeElement[num].id.substring(startTimeText.length);
        let selectDayElement = document.getElementById(`start_time_day_${eigenvalue}`);
        judgeNextDay(selectDayElement, f);
        startTimeDetailsAutoInput(eigenvalue, f);
      }
      if (inputTimeElement[num].id.includes(endTimeText)) {
        const eigenvalue = inputTimeElement[num].id.substring(endTimeText.length);
        let selectDayElement = document.getElementById(`end_time_day_${eigenvalue}`);
        judgeNextDay(selectDayElement, f);
        endTimeDetailsAutoInput(eigenvalue, f);
      }
    };
  });
  buttonTimeButtonWrapper.style.display = "grid";
  buttonTimeButtonWrapper.style.gridTemplateColumns = "repeat(4, 37.2px)";
  buttonTimeButtonWrapper.style.marginLeft = "73px";
  return buttonTimeButtonWrapper;
}
function judgeNextDay(selectDayElement, f) {
  if (0 <= parseFloat(f) && parseFloat(f) < 5) {
    Array.from(selectDayElement.children).map((s) => {
      if (s.innerText === "翌日") {
        s.selected = true;
      }
    });
  } else if (5 <= parseFloat(f) && parseFloat(f) < 24) {
    Array.from(selectDayElement.children).map((s) => {
      if (s.innerText === "当日") {
        s.selected = true;
      }
    });
  }
}
function startTimeDetailsAutoInput(eigenvalue, time) {
  document.getElementById(
    `start_time_supplemental_working_record_hour_${eigenvalue}`
  ).value = time.substring(0, 2);
  document.getElementById(
    `start_time_supplemental_working_record_minute_${eigenvalue}`
  ).value = time.substring(time.indexOf(":") + 1, time.indexOf(":") + 3);
}
function endTimeDetailsAutoInput(eigenvalue, time) {
  document.getElementById(
    `end_time_supplemental_working_record_hour_${eigenvalue}`
  ).value = time.substring(0, 2);
  document.getElementById(
    `end_time_supplemental_working_record_minute_${eigenvalue}`
  ).value = time.substring(time.indexOf(":") + 1, time.indexOf(":") + 3);
}

getInputElement();
addTimeButtonElement();
