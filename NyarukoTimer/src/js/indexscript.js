const {ipcRenderer} = require('electron');
const path = require('path');
const url = require('url');
var timerdata = new Array();

function createWindowEdit() {
    $("#nouse").css("display","block");
    ipcRenderer.send('openWinEdit');
}
ipcRenderer.on('msgWinEdit', (event, arg) => {
    $("#nouse").css("display","none");
    if (arg[0] == 1) {
        let seconds = time2seconds(arg[1],arg[2],arg[3],arg[4]);
        console.log("seconds",seconds);
        let time = seconds2time(seconds);
        console.log("time",time);
    }
})
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