const {ipcRenderer} = require('electron');
const path = require('path');
const url = require('url');
//[[timei,mode,fromTimestamp,toTimestamp,title,display]]
//mode: 0停止 1正计时 2正计时暂停 3倒计时 4倒计时暂停 5计时结束 6倒计时结束
var timerdata = new Array();
var maintimer = self.setInterval("maintimerfunc()",500);
const timerbox = $("#timerbox");
const nonum = ["00","00","00"];
var celltemplate = timerbox.html();
var editingitem = -1;
var selectedcell = -1;
var showalert = true;
timerbox.empty();

function createWindowEdit() {
    $("#nouse").css("display","block");
    ipcRenderer.send('openWinEdit');
}
ipcRenderer.on('msgWinEdit', (event, arg) => {
    $("#nouse").css("display","none");
    if (arg[0] == 1) {
        taskAdd(arg[1],arg[2],arg[3],arg[4],arg[5],arg[6]);
    }
})
ipcRenderer.on('indexmenu', (event, arg) => {
    switch (arg) {
        case 0:
            if (selectedcell >= 0) cbtnShow(selectedcell);
            break;
        case 1:
            if (selectedcell >= 0) cbtnEdit(selectedcell);
            break;
        case 2:
            if (selectedcell >= 0) cbtnReset(selectedcell);
            break;
        case 3:
            if (selectedcell >= 0) cbtnDelete(selectedcell);
            break;
        case 4:
            createWindowEdit();
            break;
        case 5:
            cbtnDeleteAll();
            break;
        default:
            break;
    }
})
ipcRenderer.on('informationDialogSelection', (event, arg) => {
    if (arg[0] == 1 && arg[1] == 1) {
        cbtnDelete(arg[2]);
    }
})
function taskAdd(day,hours,minutes,seconds,title,mode) {
    let milliseconds = time2seconds(day,hours,minutes,seconds) * 1000;
    let fromTimestamp = new Date().getTime();
    let toTimestamp = fromTimestamp + milliseconds;
    var starttimei = 0;
    if (mode == 3 || mode == 4) starttimei = 1000;
    let newdata = [starttimei,mode,fromTimestamp,toTimestamp,title,nonum,[day,hours,minutes,seconds]];
    if (editingitem >= 0) {
        timerdata[editingitem] = newdata;
        editingitem = -1;
    } else {
        timerdata.push(newdata);
    }
    createallcell();
}
function taskDel(dataindex) {
    let delobj = timerdata.splice(dataindex,1);
}
function maintimerfunc() {
    var timernum = 0;
    for (let taski = 0; taski < timerdata.length; taski++) {
        let nowtask = timerdata[taski];
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
            timernum++;
        }
        if (nowmode == 3) {
            var nowtime = toTimestamp - fromTimestamp - timei;
            if (nowtime <= 0) {
                nowtime = 0;
                if (nowmode != 6) {
                    nowmode = 6;
                    $("#timerinfob_"+taski).text("倒计时结束"+nowTimestamp);
                    overalert(taski,"倒计时结束提醒",title+" 倒计时完毕！");
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
                    $("#timerinfob_"+taski).text("计时结束"+nowTimestamp);
                    overalert(taski,"计时结束提醒",title+" 达到预定时间！");
                }
            }
            display = seconds2time2display(timei / 1000);
        }
        let newtimerdataitem = [timei,nowmode,fromTimestamp,toTimestamp,title,display,timeoption];
        timerdata[taski] = newtimerdataitem;
        $("#timertimeh_"+taski).text(display[0]);
        $("#timertimem_"+taski).text(display[1]);
        $("#timertimes_"+taski).text(display[2]);
    }
    document.title = "计时器 (运行中: " + timernum + " , 总计: " + timerdata.length + " )";
}
function overalert(taski,title,message) {
    if (showalert) {
        const options = {
            type: "warning",
            title: title,
            buttons: ['返回','删除此计时器'],
            message: message
        }
        ipcRenderer.send('msgboxWin',[options,taski]);
    }
}
function overalertsys(title,message) {
    const notification = {
        title: title,
        body: message
    }
    // icon: "../static/hhw.ico",
    // href: '.html'
    const sysNotification = new window.Notification(notification.title, notification);
    sysNotification.onclick = () => {
        console.log('Notification clicked');
    }
}
function createallcell() {
    selectedcell = -1;
    timerbox.empty();
    let newhtml = "";
    for (let taski = 0; taski < timerdata.length; taski++) {
        let nowtask = timerdata[taski];
        let starttime = timestamp2date2display(nowtask[2]);
        let endtime = timestamp2date2display(nowtask[3]);
        var nowmode = nowtask[1];
        var nowmodestr = "";
        let pausestr = (nowmode == 1 || nowmode == 3) ? "暂停" : "继续";
        let isstartbtn = (nowmode == 1 || nowmode == 3) ? "false" : "true";
        switch (nowmode) {
            case 1:
                nowmodestr = "计时进行中";
                break;
            case 2:
                nowmodestr = "计时暂停";
                break;
            case 3:
                nowmodestr = "倒计时进行中";
                break;
            case 4:
                nowmodestr = "倒计时暂停";
                break;
            case 5:
                nowmodestr = "计时结束";
                break;
            case 6:
                nowmodestr = "倒计时结束";
                break;
            default:
                nowmodestr = "程序中止";
                break;
        }
        let nowdisplay = nowtask[5];
        var cellhtml = celltemplate.replace(/StimeridS/g, taski);
        cellhtml = cellhtml.replace(/StitleS/g, nowtask[4]);
        cellhtml = cellhtml.replace(/StimehS/g, nowdisplay[0]);
        cellhtml = cellhtml.replace(/StimemS/g, nowdisplay[1]);
        cellhtml = cellhtml.replace(/StimesS/g, nowdisplay[2]);
        cellhtml = cellhtml.replace(/SmodeS/g, nowmodestr);
        cellhtml = cellhtml.replace(/SstarttimeS/g, starttime);
        cellhtml = cellhtml.replace(/SendtimeS/g, endtime);
        cellhtml = cellhtml.replace(/SplaybtnstrS/g, pausestr);
        cellhtml = cellhtml.replace(/SisstartbtnS/g, isstartbtn);
        newhtml += cellhtml;
    }
    timerbox.html(newhtml);
    maintimerfunc();
}
function selectcell(timerid) {
    $(".timer").attr("class","timer");
    $("#timer_"+timerid).attr("class","timer timerselected");
    selectedcell = timerid;
}
function cbtnPause(timerid) {

}
function cbtnShow(timerid) {

}
function editresetbtndata(timerid) {
    let nowdata = timerdata[timerid];
    var timeoption = nowdata[6];
    timeoption.push(nowdata[4]);
    var nowmode = nowdata[1];
    if (nowmode == 1 || nowmode == 2) {
        nowmode = 1;
    } else {
        nowmode = 3;
    }
    timeoption.push(nowmode);
    editingitem = timerid;
    return timeoption;
}
function cbtnEdit(timerid) {
    $("#nouse").css("display","block");
    ipcRenderer.send('openWinEdit',editresetbtndata(timerid));
}
function cbtnReset(timerid) {
    let edarr = editresetbtndata(timerid);
    taskAdd(edarr[0],edarr[1],edarr[2],edarr[3],edarr[4],edarr[5]);
    maintimerfunc();
}
function cbtnDelete(timerid) {
    timerdata.splice(timerid, 1);
    createallcell();
}
function cbtnDeleteAll() {
    let timerdatalength = timerdata.length;
    if (timerdatalength > 0) {
        timerdata.splice(0,timerdata.length);
        createallcell();
    }
}