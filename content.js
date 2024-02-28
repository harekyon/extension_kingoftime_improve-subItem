//================================================
// 補助項目編集の仕様(拡張機能ではなく補助項目画面内の仕様)
// 1. 確定されてない補助項目には「supplemental_working_record_setting_」+ 数字のようなIDがつく
// 2. 補助項目が確定された後のIDは語尾に90000と乱数がつく
//================================================

// start Extension
console.log("poko extension !");

// DOM pool
const addButton = document.createElement("button");
const addSectionButton = document.getElementById("supplemental_working_record_add");
const selectInput1 = document.getElementById("supplemental_working_record_setting_1");

// ボタンの設定
addButton.textContent = "ボタン";
addButton.style.position = "fixed";
addButton.style.bottom = "30px";
addButton.style.zIndex = "100";
addButton.onclick = function () {
  //   alert("クリックされたね！");
  console.log(document.getElementById("supplemental_working_record_setting_1"));
};
document.body.appendChild(addButton);

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

//getAvailableProject:有効なselectタグを格納する変数
let getAvailableProject = [];
//emptyNumber:項目追加した時に[内容]列が空白になるので、emptyNumberを使って空白の行数を特定する
let emptyNumber = 1;
//有効なselectタグを取得する関数
function checkProjectId() {
  //チェック時に前回のデータを削除
  Array.from(document.getElementsByTagName("select")).map((s) => {
    if (s.id.includes("supplemental_working_record_setting_900")) {
      getAvailableProject.push(s);
      console.log(s.id);
    }
  });
}
function checkEmptyProjectId() {
  Array.from(document.getElementsByTagName("select")).map((s) => {
    for (let n = 1; n <= emptyNumber + 1; n++) {
      if (
        s.id.match(new RegExp(`^supplemental_working_record_setting_${emptyNumber}$`))
      ) {
        console.log(s.id);
        getAvailableProject.push(s);
        document.getElementById(`empty_element_${emptyNumber}`).style.display = "none";
        document.getElementById(`time_span_element_${emptyNumber}`).style.display =
          "table-cell";
        ++emptyNumber;
      }
    }
  });
}
//ページ訪問時に有効なselectタグをチェックする関数を一度実行
checkProjectId();
checkEmptyProjectId();

document.getElementById("supplemental_working_record_add").onclick = function () {
  checkEmptyProjectId();
}; //補助項目追加ボタンを押した時に有効なselectタグをチェックする関数を実行

// console.log(getAvailableProject);
// console.log(document.getElementsByTagName("select"));
// let getProject = [];
// Array.from(document.getElementById("supplemental_working_record_setting_1").children).map(
//   (a, idx) => {
//     getProject.push(a.innerText);
//   }
// );

//================================================
//プリセットの設定
const presetDataList = [];
console.log(getAvailableProject);

for (let i = 1; i <= 5; i++) {
  //
  presetDataList.push({
    presetSecTitle: { dom: document.createElement("h4"), text: `Preset${i}` },
    presetSecEleType: { dom: document.createElement("div") },
    presetUnitJob: {
      dom: getAvailableProject[0].cloneNode(true),
      id: `preset${i}Job`,
      name: `preset${i}Job`,
    },
    presetUnitAnyName: {
      dom: document.createElement("input"),
      placeholder: "任意のタイトルを設定",
    },
  });
}
//プリセット設定完了後
document
  .getElementById("supplemental_working_record_setting_90000002918481")
  //================================================
  //プリセットを生成
  .presetDataList.map((u, idx) => {
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
chrome.storage.sync.get(null, (data) => {
  let dataPresetList = [];
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
  console.log(dataPresetList);

  // const presetListTitle = document.createElement("div");
});
//================================================
function reflashResultPresets(num) {}
function formatPreset(num) {
  const presetJob = document.getElementById(`preset${num}Job`);
  const presetAnyName = document.getElementById(`preset${num}AnyName`);
  // console.log(presetJob);
  let jobText;
  Array.from(presetJob.children).map((p) => {
    if (p.selected) {
      jobText = p.innerText;
    }
  });
  //========
  //以下は実際にジョブをApplyする処理
  // const presetApplyDom = document.getElementById(
  //   `supplemental_working_record_setting_${num}`
  // );
  // Array.from(presetApplyDom.children).map((searchValue) => {
  //   console.log();
  //   if (presetJob.value === searchValue.value) {
  //     console.log(searchValue);
  //     searchValue.selected = true;
  //   }
  // });
  //========
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
  console.log(`${num}がおされたよ！`);
  formatPreset(num);

  // let presetResult;
  // formatPreset(num);

  console.log(presetResult);
  chrome.storage.sync.set(presetResult);
  chrome.storage.sync.get(null, (data) => {
    console.log(data);
  });
  // chrome.storage.sync.set({
  //   preset2: [{ no: 1, name: jobZentai000.innerHTML, color: "#ffffff" }],
  // });
}

//================================================

document.body.appendChild(presetArea);

//================================================
//個別のプリセットを生成
// const preset1SectionTitle = [];
// // preset1SectionTitle.push(document.createElement("h4"));
// // preset1SectionTitle.innerText = "案件プリセット1";
// // preset1SectionTitle.style.marginBottom = "5px";
// presetArea.appendChild(preset1SectionTitle);
// //section1
// const preset1Section = document.createElement("div");
// //ジョブ選択1
// const preset1Job = document
//   .getElementById("supplemental_working_record_setting_1")
//   .cloneNode(true);
// preset1Job.id = "preset1Job";
// preset1Job.name = "preset1Job";
// const preset1Title = document.createElement("input");
// preset1Title.placeholder = "任意のタイトル";
// const preset1DecideButton = document.createElement("button");
// preset1DecideButton.innerHTML = "決定！";

// preset1Section.appendChild(preset1Job);
// preset1Section.appendChild(preset1Title);
// preset1Section.appendChild(preset1DecideButton);
// presetArea.appendChild(preset1Section);
//================================================

// 時間入力欄を表示するように
document.getElementById("time_span_element_1").style.display = "table-cell";

const jobZentai000 = document.getElementById("supplemental_working_record_setting_1")
  .children[1];
// chrome.storage.sync.set({
//   preset1: [{ no: 0, name: jobZentai000.innerHTML, color: "#ffffff" }],
// });
// chrome.storage.sync.set({
//   preset2: [{ no: 1, name: jobZentai000.innerHTML, color: "#ffffff" }],
// });
chrome.storage.sync.get(null, (data) => {
  console.log(data);
});

//test
// console.log(getProject);
document.getElementById("supplemental_working_record_setting_1").selectedIndex = 6;
// console.log();

function selectProject() {
  let selectProjectDom;
  getProject[0].selectedIndex = 7;
}
selectProject();

// console.log(Array.from(getProject).);
// console.log(document.getElementById("supplemental_working_record_setting_1").children);

//項目追加ボタンを押した時の挙動
addSectionButton.onclick = function () {
  console.log("addSectionButton");
};

// fetch("https://api.kingtime.jp/v1.0/tokens/XXXXXXXXXXXXXXXXXX");
