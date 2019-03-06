const {ipcRenderer} = require('electron');
var timerdata = new Array();
var maintimer = self.setInterval("maintimerfunc()",500);
function maintimerfunc() {
    if (timerdata.length < 7) return;
    let nowtask = timerdata;
    var timei = nowtask[0];
    var nowmode = nowtask[1];
    let nowTimestamp = new Date().getTime();
    let fromTimestamp = nowtask[2];
    let toTimestamp = nowtask[3];
    let title = nowtask[4];
    var display = nowtask[5];
    var timeoption = nowtask[6];
    if (nowmode == 1 || nowmode == 3) {
        timei = nowTimestamp - fromTimestamp;
    }
    if (nowmode == 3) {
        var nowtime = toTimestamp - fromTimestamp - timei;
        if (nowtime <= 0) {
            nowtime = 0;
            if (nowmode != 6) {
                nowmode = 6;
            }
        }
        display = seconds2time2display(nowtime / 1000);
    }
    if (nowmode == 1) {
        let nowTimestamp = fromTimestamp + timei;
        if (nowTimestamp >= toTimestamp) {
            timei = toTimestamp - fromTimestamp;
            if (nowmode != 5) {
                nowmode = 5;
            }
        }
        display = seconds2time2display(timei / 1000);
    }
    let newtimerdataitem = [timei,nowmode,fromTimestamp,toTimestamp,title,display,timeoption];
    timerdata = newtimerdataitem;
    $("#timertimeh_0").text(display[0]);
    $("#timertimem_0").text(display[1]);
    $("#timertimes_0").text(display[2]);
}
function taskAdd(dataarr) {
    timerdata = dataarr;
}