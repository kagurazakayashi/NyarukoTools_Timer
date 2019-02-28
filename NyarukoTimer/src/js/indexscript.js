const {ipcRenderer} = require('electron');
const path = require('path');
const url = require('url');
//[[mode,fromTimestamp,toTimestamp,title]]
//mode: 0停止 1正计时 2正计时暂停 3倒计时 4倒计时暂停 5计时结束
var timerdata = new Array();

function createWindowEdit() {
    $("#nouse").css("display","block");
    ipcRenderer.send('openWinEdit');
}
ipcRenderer.on('msgWinEdit', (event, arg) => {
    $("#nouse").css("display","none");
    if (arg[0] == 1) {
        taskAdd(arg[1],arg[2],arg[3],arg[4],arg[5]);
        // let seconds = time2seconds(arg[1],arg[2],arg[3],arg[4]);
        // let time = seconds2time(seconds);
    }
})
function taskAdd(day,hours,minutes,seconds,title) {
    let milliseconds = time2seconds(day,hours,minutes,seconds) * 1000;
    let fromTimestamp = new Date().getTime();
    let toTimestamp = fromTimestamp + milliseconds;
    let newdataindex = timerdata.push([fromTimestamp,toTimestamp,title]) - 1;
    console.log("newdataindex",newdataindex);
}
function taskDel(dataindex) {
    let delobj = timerdata.splice(dataindex,1);
    console.log("newdataindex",timerdata.length);
}
function btnTiming(timerid) {

}
function btnCountdown(timerid) {

}
function cbtnPause(timerid) {

}
function cbtnShow(timerid) {

}
function cbtnEdit(timerid) {

}
function cbtnReset(timerid) {

}
function cbtnDelete(timerid) {

}