/**
 * 勤務時間を取得
 */


function countElementsByClass(className) {
    return document.querySelectorAll(`.${className}`).length;
}

function getDaysInMonth() {
    return countElementsByClass('htBlock-scrollTable_day');
}

function getWeekendTableCount() {
    const saturdayCount = countElementsByClass('htBlock-scrollTable_saturday');
    const sundayCount = countElementsByClass('htBlock-scrollTable_sunday');
    return saturdayCount + sundayCount;
}

function getWorkDaysInMonth() {
    return getDaysInMonth() - getWeekendTableCount();
}

// 所定時間（分）を当月の稼働日数で割った値（分）を返す
function getRequiredWorkTimePerWorkdayMinutes() {
    const workDays = getWorkDaysInMonth();
    if (!workDays) return 0;
    const requiredMinutes = getRequiredWorkTimeMinits();
    return Math.round(requiredMinutes / workDays);
}

// 所定を満たすために、1日あたり必要な時間（分）を返す
function getNeededWorkMinutesPerDayToMeetRequired() {
    const requiredMinutes = getRequiredWorkTimeMinits();
    const actualMinutes = getActualWorkTimeMinits();
    const workDays = getWorkDaysInMonth();
    const remainingMinutes = Math.max(0, requiredMinutes - actualMinutes);
    if (remainingMinutes === 0) return 0;
    if (!workDays) return 0;
    return Math.ceil(remainingMinutes / workDays);
}


function countHtBlockScrollTableDay() {
    return countElementsByClass('htBlock-scrollTable_day');
}

// function getRequierdWorkTime() {
//     return (countHtBlockScrollTableDay() - getWeekendTableCount()) * 8;
// }

function parseHoursMinutesTextToMinutes(timeText) {
    const trimmed = String(timeText || "").trim();
    const match = trimmed.match(/^(\d+)(?:[\.:](\d{1,2}))?$/);
    if (!match) return 0;
    const hours = parseInt(match[1], 10);
    const minutes = match[2] !== undefined ? parseInt(match[2], 10) : 0;
    return hours * 60 + minutes;
}





// 所定労働時間を分で取得
function getRequiredWorkTimeMinits() { 
    const requiredWorkTimeDom = document.querySelectorAll('.specific-table_800 td');
    console.log(requiredWorkTimeDom[0].innerText);
    return parseHoursMinutesTextToMinutes(requiredWorkTimeDom[0].innerText);
}

// 実際に働いた時間を分で取得
function getActualWorkTimeMinits() {
    const actualWorkTimeDom = document.querySelectorAll('.specific-table_800 tbody .custom1');
    const actualWorkTime = actualWorkTimeDom[0].innerText;
    console.log(actualWorkTime);
    console.log(parseHoursMinutesTextToMinutes(actualWorkTime!==""?actualWorkTime:0))
    return parseHoursMinutesTextToMinutes(actualWorkTime!==""?actualWorkTime:0);
}

// 分を H:MM 形式へ
function formatMinutesToHm(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}`;
}

// 分を時間の整数値へ（小数点以下切り捨て）
function formatMinutesToHoursInteger(totalMinutes) {
    return Math.floor(totalMinutes / 60);
}

// 分を小数時間へ（h、少数2桁）
function formatMinutesToHoursDecimal(totalMinutes) {
    return (totalMinutes / 60).toFixed(2);
}

// 分を 時.分 形式へ（例: 17.14）
function formatMinutesToHoursMinutesDot(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}.${String(minutes).padStart(2, '0')}`;
}

function generateWorkTimePerDay() {
    // const insertTargetDom = document.querySelector('.specific-table_800 tbody .custom1');
    const neededWorkPerDayToMeetRequired = formatMinutesToHm(getNeededWorkMinutesPerDayToMeetRequired())
    // insertTargetDom.innerText += neededWorkPerDayToMeetRequired;
    return neededWorkPerDayToMeetRequired;
    
}

function generateWorkDetails() {
    const container = document.getElementById('work-time-visualizer');
    if (!container) return;
    const headerEl = container.querySelector('.work-time-visualizer__header');
    if (!headerEl) return;

    const table = document.querySelector('.specific-table_800');
    if (!table) return;
    const ths = Array.from(table.querySelectorAll('thead th'));
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    if (!ths.length || !rows.length) return;
    const tds = Array.from(rows[rows.length - 1].querySelectorAll('td'));

    const items = [
        { label: '労働基準時間', cls: 'wtv-detail__item--base' },
        { label: '実行時間（月）', cls: 'wtv-detail__item--actual-month' },
        { label: '1日あたり', cls: 'wtv-detail__item--perday' },
        { label: '時間外（月）', cls: 'wtv-detail__item--overtime-month' },
        { label: '深夜（月）', cls: 'wtv-detail__item--night-month' },
        { label: '休憩', cls: 'wtv-detail__item--break' },
        { label: '不足時間', cls: 'wtv-detail__item--shortage' },
    ];

    function findIndexByHeaderText(text) {
        return ths.findIndex(th => (th.textContent || '').trim().includes(text));
    }

    const html = items.map(({ label, cls }) => {
        let value = '-';
        if (label === '1日あたり') {
            value = generateWorkTimePerDay();
        } else {
            const idx = findIndexByHeaderText(label);
            value = idx >= 0 && tds[idx] ? (tds[idx].textContent || '').trim() : '-';
        }
        return (
            '      <div class="wtv-detail__item ' + cls + '">' +
            '        <div class="wtv-detail__label">' + label + '</div>' +
            '        <div class="wtv-detail__value">' + value + '</div>' +
            '      </div>'
        );
    }).join('\n');

    let details = container.querySelector('.work-time-visualizer__details');
    if (!details) {
        details = document.createElement('div');
        details.className = 'work-time-visualizer__details';
        headerEl.insertAdjacentElement('afterend', details);
    }
    console.log(details);
    details.innerHTML = html;

    // 実行時間（月）の値 背景/文字色を実績ゾーンに応じて色分け
    try {
        const actualValueEl = details.querySelector('.wtv-detail__item--actual-month .wtv-detail__value');
        if (actualValueEl) {
            const actualMinutes = getActualWorkTimeMinits();
            const requiredMinutes = getRequiredWorkTimeMinits();
            const ot45 = 45 * 60;
            const ot35 = 35 * 60;

            let bg = 'rgb(227, 234, 223)'; // 緑エリア（所定未満）
            let fg = 'rgb(76, 175, 80)';
            if (actualMinutes > requiredMinutes && actualMinutes <= requiredMinutes + ot45) {
                bg = 'rgb(255, 241, 214)'; // オレンジエリア
                fg = 'rgb(255, 152, 0)';
            } else if (actualMinutes > requiredMinutes + ot45 && actualMinutes <= requiredMinutes + ot45 + ot35) {
                bg = 'rgb(251, 232, 232)'; // 赤エリア
                fg = 'rgb(244, 67, 54)';
            } else if (actualMinutes > requiredMinutes + ot45 + ot35) {
                bg = 'rgb(233, 229, 242)'; // 黒紫エリア
                fg = '#3f1d72';
            }
            actualValueEl.style.background = bg;
            actualValueEl.style.color = fg;
        }
    } catch (e) {
        // no-op
    }
}

/**
 * 勤務時間をグラフ化
 */
function generateWorkTimeGraph() { 
    const targetElement = document.querySelector('.htBlock-normalTable .specific-table')
        || document.querySelector('.htBlock-normalTable')
        || document.body;

    const containerId = 'work-time-visualizer';
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        if (targetElement.append) {
            targetElement.append(container);
        } else {
            targetElement.appendChild(container);
        }
    }

    const requiredWorkTime = getRequiredWorkTimeMinits();
    const actualWorkTime = getActualWorkTimeMinits();
    const trackWidthPx = 300;
    const minutesPerPx = requiredWorkTime > 0 ? (requiredWorkTime / trackWidthPx) : 1; // 分/px
    const requiredWidthPx = trackWidthPx; // 所定は常に300px基準（背景）
    const actualWidthPx = Math.round(actualWorkTime / minutesPerPx); // 実績のpx（超過時は300px超）
    const actualBarWidthPx = Math.min(actualWidthPx, trackWidthPx); // 所定内の実績の長さ（緑）
    const overflowWidthPx = Math.max(0, actualWidthPx - trackWidthPx); // 超過分（オレンジ）
    const actualLabelLeftPx = (actualWidthPx > trackWidthPx ? actualWidthPx : actualBarWidthPx) + 8; // バー終端の右に配置
    const requiredValueLeftPx = Math.round(requiredWidthPx / 2); // 所定バー（ベース）の中央下

    // 背景帯（所定+45h まで薄いオレンジ、その先+35h まで薄い赤）
    const ot45Minutes = 45 * 60;
    const ot35Minutes = 35 * 60;
    const ot45WidthPx = Math.round(ot45Minutes / minutesPerPx);
    const ot35WidthPx = Math.round(ot35Minutes / minutesPerPx);
    const overflow45Px = Math.min(overflowWidthPx, ot45WidthPx);
    const overflow80Px = Math.max(0, overflowWidthPx - ot45WidthPx);

    // 区分線（縦線10px）: ベースのバー境界（required, ot45, ot80）を基準に配置
    const sepPositionsSet = new Set();
    // 所定（required）の start/end
    sepPositionsSet.add(0);
    sepPositionsSet.add(requiredWidthPx);
    // 45h帯（ot45）の start/end（幅がある場合）
    if (ot45WidthPx > 0) {
        sepPositionsSet.add(trackWidthPx);
        sepPositionsSet.add(trackWidthPx + ot45WidthPx);
    }
    // 80h帯（ot80）の start/end（幅がある場合）
    if (ot35WidthPx > 0) {
        sepPositionsSet.add(trackWidthPx + ot45WidthPx);
        sepPositionsSet.add(trackWidthPx + ot45WidthPx + ot35WidthPx);
    }
    const sepPositions = Array.from(sepPositionsSet).sort((a, b) => a - b);
    // 赤帯の右端の縦線は、実績が80h帯に到達したときのみ表示
    const sepHtml = sepPositions
        .filter(px => px <= trackWidthPx + ot45WidthPx || overflow80Px > 0)
        .map(px => '        <div class="wtv-sep" style="left:' + px + 'px"></div>')
        .join('\n');
    // 背景帯ラベル（中央下）
    const ot45CenterLeftPx = trackWidthPx + Math.round(ot45WidthPx / 2);
    const ot80CenterLeftPx = trackWidthPx + ot45WidthPx + Math.round(ot35WidthPx / 2);
    const ot45LabelHtml = ot45WidthPx > 0 ? '        <div class="wtv-value-label" style="left:' + ot45CenterLeftPx + 'px">45</div>' : '';
    const ot80LabelHtml = overflow80Px > 0 ? '        <div class="wtv-value-label" style="left:' + ot80CenterLeftPx + 'px">35</div>' : '';

    // 黒紫: 赤帯の右隣（所定+45h+35hの右側）。
    // ライン幅は「赤エリアを超えた実績分（分→px）」とする
    const bp20Minutes = 20 * 60; // 背景幅は20h据え置き
    const bp20WidthPx = Math.round(bp20Minutes / minutesPerPx);
    const bpBgLeft = trackWidthPx + ot45WidthPx + ot35WidthPx;
    const bpLineLeft = bpBgLeft; // ラインも背景帯と同じ開始位置
    const beyondRedPx = Math.max(0, actualWidthPx - bpBgLeft);
    const bpLineHtml = beyondRedPx > 0
        ? '        <div class="wtv-line wtv-line--overflow-20" style="left:' + bpLineLeft + 'px; width:' + beyondRedPx + 'px"></div>'
        : '';

    // 黒紫バーの右端の縦線と中央下の「20」ラベル
    const bpSepLeftPx = bpBgLeft + bp20WidthPx;
    const bpSepHtml = overflow80Px > 0 ? '        <div class="wtv-sep" style="left:' + bpSepLeftPx + 'px"></div>' : '';
    const bpCenterLeftPx = bpBgLeft + Math.round(bp20WidthPx / 2);
    const bp20LabelHtml = overflow80Px > 0 ? '        <div class="wtv-value-label" style="left:' + bpCenterLeftPx + 'px">20</div>' : '';

    // 縦線下の合計時間ラベル
    const requiredTotalLabel = '        <div class="wtv-sep-value" style="left:' + requiredWidthPx + 'px">' + formatMinutesToHoursInteger(requiredWorkTime) + '</div>';
    const ot45TotalMinutes = requiredWorkTime + ot45Minutes;
    const ot45SepLeftPx = trackWidthPx + ot45WidthPx;
    const ot45TotalLabel = '        <div class="wtv-sep-value" style="left:' + ot45SepLeftPx + 'px">' + formatMinutesToHoursInteger(ot45TotalMinutes) + '</div>';
    const ot80TotalMinutes = ot45TotalMinutes + ot35Minutes;
    const ot80SepLeftPx = trackWidthPx + ot45WidthPx + ot35WidthPx;
    const ot80TotalLabel = overflow80Px > 0 ? '        <div class="wtv-sep-value" style="left:' + ot80SepLeftPx + 'px">' + formatMinutesToHoursInteger(ot80TotalMinutes) + '</div>' : '';
    const bp20TotalMinutes = ot80TotalMinutes + bp20Minutes;
    const bp20TotalLabel = overflow80Px > 0 ? '        <div class="wtv-sep-value" style="left:' + bpSepLeftPx + 'px">' + formatMinutesToHoursInteger(bp20TotalMinutes) + '</div>' : '';

    // 原点(0)の合計時間ラベル
    const zeroTotalLabel = '        <div class="wtv-sep-value" style="left:0px">0</div>';

    // 実績終端（棒の一番右）の上部縦線とラベル
    const actualTipLeftPx = actualWidthPx;
    const actualTopSepHtml = '        <div class="wtv-sep-top" style="left:' + actualTipLeftPx + 'px"></div>';
    // 実績が属するエリアに応じて背景色を切り替え
    const actualZoneColor = (function(){
        if (actualWidthPx <= trackWidthPx) return 'rgb(76, 175, 80)';
        if (actualWidthPx <= trackWidthPx + ot45WidthPx) return 'rgb(255, 152, 0)';
        if (actualWidthPx <= trackWidthPx + ot45WidthPx + ot35WidthPx) return 'rgb(244, 67, 54)';
        return '#3f1d72'; // プロジェクトの黒紫
    })();
    const actualTopLabelHtml = '        <div class="wtv-top-label" style="left:' + actualTipLeftPx + 'px">'
        + '<span class="wtv-top-label__title">実行時間</span><br>'
        + '<span class="wtv-top-label__value" style="background:' + actualZoneColor + '"><span class="wtv-top-label__valueText" style="' + (actualWidthPx > (trackWidthPx + ot45WidthPx + ot35WidthPx) ? 'color:white;' : '') + '">' + formatMinutesToHoursMinutesDot(actualWorkTime) + 'h</span></span>'
        + '</div>';

	// 接続用の角丸調整
	const actualBorderRadius = overflowWidthPx > 0 ? '6px 0 0 6px' : '6px';
	const overflow45ExtraStyle = overflow80Px > 0 ? 'border-top-right-radius:0;border-bottom-right-radius:0;' : '';
	const isActualBeforeRequired = actualWidthPx < trackWidthPx;
	const requiredBgRadius = isActualBeforeRequired ? '6px 0 0 6px' : '6px';
	// 緑のみ or 緑+オレンジ（赤なし）の場合に ot45 背景の右端を丸める
	const ot45NeedsRightRadius = isActualBeforeRequired || (overflow45Px > 0 && overflow80Px === 0);
	const ot45BgRadiusStyle = ot45NeedsRightRadius ? 'border-radius:0 6px 6px 0;' : '';
	const bp20BgRadiusStyle = overflow80Px > 0 ? 'border-radius:0 6px 6px 0;' : '';

    container.innerHTML = ''
        + '<div class="work-time-visualizer-container">'
        + '  <div class="work-time-visualizer__header">勤務時間データ</div>'
        + '  <div class="wtv-bars">'
        + '    <div class="wtv-bar-row">'
        + '      <span class="wtv-bar-row__label">実行時間</span>'
        + '      <div class="wtv-bar-track">'
        + '        <div class="wtv-bar wtv-bar--required" style="width:' + requiredWidthPx + 'px; border-radius:' + requiredBgRadius + '"></div>'
        + '        <div class="wtv-bg wtv-bg--ot45" style="left:' + trackWidthPx + 'px; width:' + ot45WidthPx + 'px; ' + ot45BgRadiusStyle + '"></div>'
        + (overflow80Px > 0
            ? '        <div class="wtv-bg wtv-bg--ot80" style="left:' + (trackWidthPx + ot45WidthPx) + 'px; width:' + ot35WidthPx + 'px"></div>'
            : '')
        + '        <div class="wtv-bar wtv-bar--actual" style="width:' + actualBarWidthPx + 'px; border-radius:' + actualBorderRadius + '"></div>'
        + (overflow45Px > 0
            ? '        <div class="wtv-bar wtv-bar--overflow" style="width:' + overflow45Px + 'px; left:' + trackWidthPx + 'px; ' + overflow45ExtraStyle + '"></div>'
            : '')
        + (overflow80Px > 0
            ? '        <div class="wtv-bar wtv-bar--overflow-80" style="width:' + overflow80Px + 'px; left:' + (trackWidthPx + overflow45Px) + 'px"></div>'
            : '')
        + (overflow80Px > 0
            ? '        <div class="wtv-bg wtv-bg--bp20" style="left:' + bpBgLeft + 'px; width:' + bp20WidthPx + 'px; ' + bp20BgRadiusStyle + '"></div>'
            : '')
        + (sepHtml ? '\n' + sepHtml : '')
        + (ot45LabelHtml ? '\n' + ot45LabelHtml : '')
        + (ot80LabelHtml ? '\n' + ot80LabelHtml : '')
        + (bpLineHtml ? '\n' + bpLineHtml : '')
        + (bpSepHtml ? '\n' + bpSepHtml : '')
        + (bp20LabelHtml ? '\n' + bp20LabelHtml : '')
        + '\n' + zeroTotalLabel
        + '\n' + requiredTotalLabel
        + '\n' + ot45TotalLabel
        + (ot80TotalLabel ? '\n' + ot80TotalLabel : '')
        + (bp20TotalLabel ? '\n' + bp20TotalLabel : '')
        + '\n' + actualTopSepHtml
        + '\n' + actualTopLabelHtml
        + '        <div class="wtv-value-label" style="left:' + requiredValueLeftPx + 'px">' + formatMinutesToHoursInteger(requiredWorkTime) + '</div>'
        + '      </div>'
        + '    </div>'
        + '  </div>'
        + '</div>';
}

function visualizeWorkTime() {
    generateWorkTimeGraph();
}


function onLoad() {
    console.log("run!!!");
    
    console.log("run!!2222!");
    console.log('getRequiredWorkTimeMinits:', getRequiredWorkTimeMinits());
    console.log('getActualWorkTimeMinits:', getActualWorkTimeMinits());
    // getRequiredWorkTimeMinits();
    
    getRequiredWorkTimePerWorkdayMinutes();
    console.log('getNeededWorkMinutesPerDayToMeetRequired:',formatMinutesToHm(getNeededWorkMinutesPerDayToMeetRequired()));


    getDaysInMonth();
    // console.log('htBlock-scrollTable_weekend_total:', getWeekendTableCount());
    // console.log('htBlock-scrollTable_day_total:', countHtBlockScrollTableDay());
    // const requierdWorkTime = getRequierdWorkTime();
    // console.log('requierdWorkTime:', requierdWorkTime);
    generateWorkTimePerDay();
    generateWorkTimeGraph();
    generateWorkDetails();
}

window.addEventListener("load", onLoad);