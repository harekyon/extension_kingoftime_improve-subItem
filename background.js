
chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if (request === "getData") {
        //  fetch("https://api.kingtime.jp/v1.0/employees?date=2024-10-10", {
        // fetch("https://api.kingtime.jp/v1.0/monthly-workings/2025-06?division=1001", {
        // fetch("https://api.kingtime.jp/v1.0/daily-workings/2025-08-01", {
        // fetch("https://api.kingtime.jp/v1.0/monthly-workings/2025-08", {
        //     method: 'GET', // または 'POST', 'PUT', 'DELETE' など
        //     headers: {
        //         // 'Content-Type': 'application/json; charset=utf-8',
        //         // 'Content-Type': 'application/json;',
        //         'Authorization': 'Bearer 5a29df4935e641339f89cadf942f180e', // 必要に応じてトークンを追加
        //         // 他のヘッダーをここに追加
        //     }
        //     })
        //      .then(response => {
        //         console.log("response");
        //         console.log(response);
        //         return response.json();
        //     })
        //     .then(data => {
        //         const resData = data;
        //         console.log(resData);
        //         const sendData = resData
        //         sendResponse({ status:sendData });
        //     })
        //     .catch(error => {
        //         console.log(error.message);
        //         sendResponse({ status: error.message })
        //     });

        fetch("https://api.techtouch.jp/c/v2/p/info/orga-620458be-3899-d201-1631-3d11b80e5568", {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
                'Origin': 'https://s2.ta.kingoftime.jp',
                'Pragma': 'no-cache',
                'Referer': 'https://s2.ta.kingoftime.jp/',
                'Sec-Ch-Ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
                'X-Tt-Client-Type': 'snippet',
                'X-Tt-Release-Version': '4.1.0',
                'X-Tt-User-Type': 'enduser'
            }
        })
        .then(response => {
            console.log("response");
            console.log(response);
            return response.json();
        })
        .then(data => {
            const resData = data;
            console.log(resData);
            const sendData = resData;
            sendResponse({ status: sendData });
            
        })
        .catch(error => {
            console.log(error.message);
            sendResponse({ status: error.message });
        });
        return true;  // 非同期レスポンス
    }
});