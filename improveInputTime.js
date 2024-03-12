// const getTimeTable = document.getElementsByClassName("specific-table_600");
// const addSectionButton = document.getElementById("supplemental_working_record_add");
let getTimeTable = document.getElementsByTagName("td");
// console.log(getTimeTable);
const pattern = /^\d{4}年 \d{2}月 \d{2}日 \d{2}時 \d{2}分$/g;

let formatedTime = [];
Array.from(getTimeTable).map((t) => {
  // console.log(t.innerText);
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
let inputTimeElement = [];
function getInputElement() {
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
  // console.log(inputTimeElement);
}

function addButtonTimeElement() {
  inputTimeElement.map((i) => {
    i.insertAdjacentElement("afterend", createTimeButton());
  });
}
function createTimeButton() {
  const buttonTimeButtonWrapper = document.createElement("div");
  formatedTime.map((f) => {
    const buttonTime = document.createElement("button");
    buttonTime.innerText = f;
    buttonTime.style.fontSize = "10px";
    buttonTime.style.width = "auto";
    buttonTime.style.padding = "0 2px";
    buttonTimeButtonWrapper.appendChild(buttonTime);
  });
  buttonTimeButtonWrapper.style.display = "grid";
  buttonTimeButtonWrapper.style.gridTemplateColumns = "repeat(4, 37.2px)";
  buttonTimeButtonWrapper.style.marginLeft = "73px";
  return buttonTimeButtonWrapper;
}
getInputElement();
addButtonTimeElement();
