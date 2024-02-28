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
presetArea.style.cssText = `
    width:550px;
    height:70vh;
    position:fixed;
    z-index:10000;
    top:45px;
    right:0px;
    background:red;
    padding:20px 10px;
    transition:0.6s;
`;
const presetAreaTitle = document.createElement("h3");
presetAreaTitle.id = "presetArea";
presetAreaTitle.innerText = "案件プリセット登録";
presetAreaTitle.style.cssText = `
    font-size:20px;
    font-weight:700;
    margin-bottom:10px;
`;
presetArea.appendChild(presetAreaTitle);
const presetEditButton = document.createElement("button");
presetEditButton.id = "presetEditButton";
presetEditButton.innerText = "Edit Preset";
presetEditButton.style.cssText = `
    font-size:14px;
    font-weight:700;
    margin-bottom:10px;
    -ms-writing-mode: tb-rl;
  writing-mode: vertical-rl;
  position:absolute;
  left:-27px;
  top:0;
  background:blue;
`;
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
      console.log("run!");
      console.log(p.value);
      console.log(getAvailablePullDownProject[num].value);
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

//ページ訪問時に有効なselectタグをチェックする関数を一度実行
checkProjectId();
checkEmptyProjectId();

addSectionButton.onclick = function () {
  checkEmptyProjectId();
  addPresetButton();
  console.log("run!");
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
  cachePreset.style.marginBottom = "4px";
  cachePreset.style.display = "flex";
  cachePreset.style.justifyContent = "flex-start";
  cachePreset.style.alignItems = "center";
  cachePreset.style.flexDirection = "row";
  cachePreset.style.columnGap = "3px";
  //sectionTitle
  let cachePresetTitle = u.presetSecTitle.dom;
  cachePresetTitle.innerText = u.presetSecTitle.text;
  cachePresetTitle.style.display = "inline-block";
  cachePresetTitle.style.fontSize = "14px";
  cachePresetTitle.style.fontWeight = "700";
  cachePresetTitle.style.marginRight = "4px";
  cachePreset.appendChild(cachePresetTitle);

  let chachePresetJobList = u.presetUnitJob.dom;
  chachePresetJobList.id = u.presetUnitJob.id;
  chachePresetJobList.name = u.presetUnitJob.name;
  chachePresetJobList.style.height = "20px";
  chachePresetJobList.style.padding = "2px 32px 2px 5px";
  chachePresetJobList.style.fontSize = "10px";
  cachePreset.appendChild(chachePresetJobList);

  let chachePresetAnyName = u.presetUnitAnyName.dom;
  chachePresetAnyName.placeholder = `任意のタイトル${idx + 1}`;
  chachePresetAnyName.style.height = "18px";
  chachePresetAnyName.style.fontSize = "10px";
  chachePresetAnyName.id = `preset${idx + 1}AnyName`;
  cachePreset.appendChild(chachePresetAnyName);

  const cachePresetDecideBtn = document.createElement("button");
  cachePresetDecideBtn.innerHTML = "決定！";
  cachePresetDecideBtn.style.height = "22px";
  cachePresetDecideBtn.style.fontSize = "12px";
  cachePresetDecideBtn.onclick = function () {
    decideFunction(idx + 1);
  };
  cachePreset.appendChild(cachePresetDecideBtn);
  presetArea.appendChild(cachePreset);
});
//================================================
//プリセット一覧を表示
const showPresetTitle = document.createElement("h3");
showPresetTitle.id = "showPresetTitle";
showPresetTitle.innerText = "登録されている案件プリセット一覧";
showPresetTitle.style.cssText = `
    font-size:20px;
    font-weight:700;
    margin:20px 0;
`;
presetArea.appendChild(showPresetTitle);
//===========================
//プルダウンの下にボタンを配置
let availableButtonCounter = 0;
function addPresetButton() {
  getAvailablePullDownProject.map((g, idx) => {
    if (availableButtonCounter <= idx) {
      console.log(availableButtonCounter);
      g.after(createPresetButton(availableButtonCounter));
      ++availableButtonCounter;
    }
  });
}
chrome.storage.sync.get(null, (data) => {
  dataPresetList.push(data.preset1[0]);
  dataPresetList.push(data.preset2[0]);
  dataPresetList.push(data.preset3[0]);
  dataPresetList.push(data.preset4[0]);
  dataPresetList.push(data.preset5[0]);
  dataPresetList.map((d, idx) => {
    const presetResultUnitWrap = document.createElement("div");
    presetResultUnitWrap.style.cssText = `
      display:flex;
      flex-direction:row;
      background:yellow;
    `;
    const presetResultUnitTitle = document.createElement("p");
    presetResultUnitTitle.style.fontSize = "10px";
    presetResultUnitTitle.innerText = `Preset${d.no}: ${d.jobName}, 登録名${d.anyname}`;
    presetResultUnitWrap.appendChild(presetResultUnitTitle);
    presetArea.appendChild(presetResultUnitWrap);
  });
  addPresetButton();
});
//================================================

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

document.body.appendChild(presetArea);

//================================================

// fetch(
//   "https://api.kingtime.jp/v1.0/tokens/ef6640f0ba1f42e49964414c6d75be44/available"
// ).then((res) => {
//   console.log(res);
// });
