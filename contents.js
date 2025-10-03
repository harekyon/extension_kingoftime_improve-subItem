
   
// chrome.runtime.sendMessage(
//     { action: "getData", parameter: "some value" },  // 送信するメッセージ
//     function(response) {                             // 返信を受け取るコールバック
//         console.log("受信した返信:", response.status);
//     }
// );


   
chrome.runtime.sendMessage(
    "getData",
    (response)=> {
        console.log(response);
    }
);
  
(async () => {
  const response = await chrome.runtime.sendMessage("getData", (response) => {
    console.log(response);
  });
  console.log(response);
})();