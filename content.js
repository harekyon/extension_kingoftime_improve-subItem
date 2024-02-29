//================================================
// 補助項目編集の仕様(拡張機能ではなく補助項目画面内の仕様)
// 1. 確定されてない補助項目には [supplemental_working_record_setting_] + [数字]でIDがつく
// 2. 補助項目が確定された後のIDは語尾に90000と乱数がつく
//================================================

// start Extension
console.log("poko extension !");

// DOM pool
const addButton = document.createElement("button");
const addSectionButton = document.getElementById("supplemental_working_record_add");
const selectInput1 = document.getElementById("supplemental_working_record_setting_1");
//プリセットのリスト
let dataPresetList = [];

// プリセット画面追加
const presetArea = document.createElement("div");
presetArea.id = "presetArea";
presetArea.classList.add("preset--wrap");
const presetAreaTitle = document.createElement("h3");
presetAreaTitle.id = "presetArea";
presetAreaTitle.innerText = "案件プリセット登録";
presetAreaTitle.classList.add("preset__areaTitle");
presetArea.appendChild(presetAreaTitle);
const presetEditButton = document.createElement("button");
presetEditButton.id = "presetEditButton";
presetEditButton.classList.add("preset-edit__button");
presetEditButton.innerText = "Edit Preset";
presetArea.appendChild(presetEditButton);

//getAvailablePullDownProject:有効なselectタグを格納する変数
let getAvailablePullDownProject = [];
//emptyNumber:項目追加した時に[内容]列が空白になるので、emptyNumberを使って空白の行数を特定する
let emptyNumber = 1;
//有効なselectタグを取得する関数
function checkProjectId() {
  //チェック時に前回のデータを削除
  Array.from(document.getElementsByTagName("select")).map((s) => {
    if (s.id.includes("supplemental_working_record_setting_900")) {
      getAvailablePullDownProject.push(s);
    }
  });
}
//ボタンDOMとスタイルを作る
function createPresetButton(num) {
  //有効なプロジェクトプルダウン
  let buttonWrap = document.createElement("div");
  dataPresetList.map((p) => {
    const buttonUnit = document.createElement("button");
    buttonUnit.innerText = p.anyname;
    buttonUnit.type = "button";
    buttonUnit.style.cssText = `
        font-size:10px;
      `;
    buttonUnit.onclick = function () {
      // console.log("run!");
      // console.log(p.value);
      // console.log(getAvailablePullDownProject[num].value);
      getAvailablePullDownProject[num].value = p.value;
    };
    buttonWrap.appendChild(buttonUnit);
  });
  return buttonWrap;
}
function checkEmptyProjectId() {
  Array.from(document.getElementsByTagName("select")).map((s) => {
    for (let n = 1; n <= emptyNumber + 1; n++) {
      if (
        s.id.match(new RegExp(`^supplemental_working_record_setting_${emptyNumber}$`))
      ) {
        // console.log(s.id);
        getAvailablePullDownProject.push(s);
        document.getElementById(`empty_element_${emptyNumber}`).style.display = "none";
        document.getElementById(`time_span_element_${emptyNumber}`).style.display =
          "table-cell";
        createPresetButton(getAvailablePullDownProject.length);
        ++emptyNumber;
      }
    }
  });
}

//init
for (let i = 1; i <= 5; i++) {
  const unit = document.getElementById(`preset${i}AnyName`);
}
let initManage = [0, 0, 0, 0, 0];

chrome.storage.sync.get(null, (data) => {
  // console.log(getAvailablePullDownProject[0]);
  // console.log(data);
  Object.keys(data).map((d, idx) => {
    // console.log(data[d][0].no);
    initManage[data[d][0].no - 1] = 1;
  });
  // console.log(initManage);
  initManage.map((i, idx) => {
    if (i === 0) {
      chrome.storage.sync.set({
        [`preset${idx + 1}`]: [
          {
            no: idx + 1,
            value: getAvailablePullDownProject[0].value,
            anyname: "null",
            jobName: "全体",
            color: "#ffffff",
          },
        ],
      });
    }
    if (i === 0) {
    }
  });
});

//ページ訪問時に有効なselectタグをチェックする関数を一度実行
checkProjectId();
checkEmptyProjectId();

addSectionButton.onclick = function () {
  checkEmptyProjectId();
  addPresetButton();
  // console.log("run!");
}; //補助項目追加ボタンを押した時に有効なselectタグをチェックする関数を実行
//================================================
//プリセットの設定
const presetDataList = [];
for (let i = 1; i <= 5; i++) {
  //
  presetDataList.push({
    presetSecTitle: { dom: document.createElement("h4"), text: `Preset${i}` },
    presetSecEleType: { dom: document.createElement("div") },
    presetUnitJob: {
      dom: getAvailablePullDownProject[0].cloneNode(true),
      id: `preset${i}Job`,
      name: `preset${i}Job`,
    },
    presetUnitAnyName: {
      dom: document.createElement("input"),
      placeholder: "任意のタイトルを設定",
    },
  });
}

//================================================
//プリセット設定完了後
//================================================
//プリセットを生成
presetDataList.map((u, idx) => {
  let cachePreset = u.presetSecEleType.dom;
  cachePreset.classList.add("preset__unitWrap");
  //sectionTitle
  let cachePresetTitle = u.presetSecTitle.dom;
  cachePresetTitle.innerText = u.presetSecTitle.text;
  cachePresetTitle.classList.add("preset__unitTitle");
  cachePreset.appendChild(cachePresetTitle);

  let chachePresetJobList = u.presetUnitJob.dom;
  chachePresetJobList.id = u.presetUnitJob.id;
  chachePresetJobList.name = u.presetUnitJob.name;
  chachePresetJobList.classList.add("preset__unitJob");
  cachePreset.appendChild(chachePresetJobList);

  let chachePresetAnyName = u.presetUnitAnyName.dom;
  chachePresetAnyName.placeholder = `任意のタイトル${idx + 1}`;
  chachePresetAnyName.id = `preset${idx + 1}AnyName`;
  chachePresetAnyName.classList.add("preset__unitAnyname");
  cachePreset.appendChild(chachePresetAnyName);

  const cachePresetDecideBtn = document.createElement("button");
  cachePresetDecideBtn.innerHTML = "決定！";
  cachePresetDecideBtn.classList.add("preset__unitDecide");
  cachePresetDecideBtn.onclick = function () {
    decideFunction(idx + 1);
    console.log(document.getElementById(`preset${idx + 1}Job`));
    let resultJob = "";
    Array.from(document.getElementById(`preset${idx + 1}Job`).children).map((p) => {
      if (p.selected === true) {
        resultJob = p.innerText;
      }
    });
    let resultAnyName = document.getElementById(`preset${idx + 1}AnyName`).value;
    reWriteResultUnitTitle(idx + 1, resultJob, resultAnyName);
  };
  cachePreset.appendChild(cachePresetDecideBtn);
  presetArea.appendChild(cachePreset);
});
//================================================
//プリセット一覧を表示
const showPresetTitle = document.createElement("h3");
showPresetTitle.id = "showPresetTitle";
showPresetTitle.innerText = "登録済みの案件プリセット一覧";
showPresetTitle.classList.add("applied__areaTitle");
presetArea.appendChild(showPresetTitle);
//===========================
//プルダウンの下にボタンを配置
let availableButtonCounter = 0;
function addPresetButton() {
  getAvailablePullDownProject.map((g, idx) => {
    if (availableButtonCounter <= idx) {
      // console.log(availableButtonCounter);
      g.after(createPresetButton(availableButtonCounter));
      ++availableButtonCounter;
    }
  });
}
function reWriteResultUnitTitle(no, jobName, anyname) {
  // console.log("run!");
  const reWriteResult = document.getElementById(`presetResultUnitText${no}`);
  // console.log(jobName);
  let text = `Preset${String(no)}: 登録名: ${anyname}, 案件名: ${jobName}`;
  text = text.replace(/\n/g, "");
  // console.log(text);
  reWriteResult.innerText = text;
}

chrome.storage.sync.get(null, (data) => {
  dataPresetList.push(data?.preset1[0]);
  dataPresetList.push(data?.preset2[0]);
  dataPresetList.push(data?.preset3[0]);
  dataPresetList.push(data?.preset4[0]);
  dataPresetList.push(data?.preset5[0]);
  dataPresetList.map((d, idx) => {
    const presetResultUnitWrap = document.createElement("div");
    // presetResultUnitWrap.style.cssText = `
    //   display:flex;
    //   flex-direction:row;
    //   background:yellow;
    // `;
    presetResultUnitWrap;
    const presetResultUnitText = document.createElement("p");
    let cacheJobName = d.jobName;
    // console.log(d.no);
    // console.log(cacheJobName);
    presetResultUnitText.style.fontSize = "10px";
    // presetResultUnitText.innerText = `Preset${d.no}: ${cacheJobName}, 登録名:${d.anyname}`;
    // let text = `Preset${d.no}: ${cacheJobName}, 登録名:${d.anyname}`;
    let text = `Preset${String(d.no)}: 登録名: ${d.anyname}, 案件名: ${d.jobName}`;
    text = text.replace(/\n/g, "");
    // console.log(text);
    presetResultUnitText.innerText = text;
    presetResultUnitText.id = `presetResultUnitText${d.no}`;
    presetResultUnitText.classList.add("applied__presetWrap");
    presetResultUnitWrap.appendChild(presetResultUnitText);
    presetArea.appendChild(presetResultUnitWrap);
  });
  addPresetButton();
});
//================================================
// chrome.storage.sync.clear();

//================================================
function formatPreset(num) {
  const presetJob = document.getElementById(`preset${num}Job`);
  const presetAnyName = document.getElementById(`preset${num}AnyName`);
  let jobText;
  Array.from(presetJob.children).map((p) => {
    if (p.selected) {
      jobText = p.innerText;
    }
  });
  presetResult = {
    [`preset${num}`]: [
      {
        no: num,
        value: presetJob.value,
        anyname: presetAnyName.value,
        jobName: jobText,
        color: "#ffffff",
      },
    ],
  };
}
function decideFunction(num) {
  formatPreset(num);
  chrome.storage.sync.set(presetResult);
}
//================================================
//プリセット入力エリアに保存されているデータを表示
function applyPresetInputField() {
  // console.log(presetDataList);
  chrome.storage.sync.get(null, (data) => {
    // console.log(data);
    Object.keys(data).map((d, idx) => {
      // console.log(idx);
      // console.log(data[d][0]?.value);
      if (data[d][0]?.value !== undefined) {
        document.getElementById(`preset${data[d][0].no}Job`).value = data[d][0]?.value;
        document.getElementById(`preset${data[d][0].no}AnyName`).value =
          data[d][0]?.anyname;
      }

      // preset1AnyName;
      // const cachePresetElemet = document.getElementById(`preset${p[0].no}Job`);
      // cachePresetElemet.p
    });
  });
}
applyPresetInputField();

document.body.appendChild(presetArea);

//================================================

// fetch(
//   "https://api.kingtime.jp/v1.0/tokens/XXXXXXX/available"
// ).then((res) => {
//   console.log(res);
// });
