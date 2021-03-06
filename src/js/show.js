const {ipcRenderer} = require('electron');
var timerdata = new Array();
var maintimer;
var inittimer;
$(document).ready(function() {
    inittimer = self.setInterval("inittimerfunc()",1);
    // maintimer = self.setInterval("maintimerfunc()",100);
});
function inittimerfunc() {
    let milliseconds = new Date().getMilliseconds();
    if (milliseconds >= 0 && milliseconds < 100) {
        clearInterval(inittimer);
        inittimer = null;
        $("body").css("display","block");
        maintimer = self.setInterval("maintimerfunc()",100);
    }
}
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
    if (nowmode == 7) {
        display = nowtime2display();
    } else {
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
    }
    let newtimerdataitem = [timei,nowmode,fromTimestamp,toTimestamp,title,display,timeoption];
    timerdata = newtimerdataitem;
    sethtml($("#timertimeh_0"),timertimenumchar(display[0]));
    sethtml($("#timertimem_0"),timertimenumchar(display[1]));
    sethtml($("#timertimes_0"),timertimenumchar(display[2]));
}
ipcRenderer.on('winshowinit', (event, arg) => {
    timerdata = arg;
});
ipcRenderer.on('changeShowColor', (event, arg) => {
    let pagebody = $("body");
    pagebody.css("color",arg[1]);
    pagebody.css("background-color",arg[2]);
    pagebody.css("-webkit-text-stroke","1px "+arg[3]);
});