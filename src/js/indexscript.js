const {ipcRenderer,remote} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
//[[timei,mode,fromTimestamp,toTimestamp,title,display]]
//mode: 0停止 1正计时 2正计时暂停 3倒计时 4倒计时暂停 5计时结束 6倒计时结束 7显示时间
var timerdata = new Array();
var maintimer;
const timerbox = $("#timerbox");
const nonum = ["00","00","00"];
var showcolor = [0,"#000000","#EFEFF0","#FFFFFF"];
var celltemplate = timerbox.html();
var editingitem = -1;
var selectedcell = -1;
var showing = -1;
var showalert = true;
let configFile = remote.app.getPath('userData') + "/setting.json";
//C:\Users\yashi\AppData\Roaming\nyarukotimer\setting.json
timerbox.empty();
timerbox.text("正在加载...");
function settingLoad() {
    fs.readFile(configFile, 'utf8', function (err, filedata) {
        if (err) {
            if (err.code != "ENOENT") {
                const options = {
                    type: "error",
                    title: "读取应用程序设置没有成功",
                    message: err.message,
                    buttons: ['关闭']
                }
                console.log(err.code + "|" + err.message);
                ipcRenderer.send('openInfoMsgBox',options);
            }
        } else {
            let settingarr = JSON.parse(filedata);
            showcolor = settingarr[0];
            timerdata = settingarr[1];
            ipcRenderer.send('updateShowColor',showcolor);
            createallcell();
        }
    });
}
function settingSave() {
    let filedata = JSON.stringify([showcolor,timerdata]);
    fs.writeFile(configFile, filedata, function (err) {
        if (err) {
            const options = {
                type: "error",
                title: "写入应用程序设置没有成功",
                message: err.message,
                buttons: ['关闭']
            }
            console.log(err.code + "|" + err.message);
            ipcRenderer.send('openInfoMsgBox',options);
        }
    })
}
function createWindowEdit() {
    let maxtasknum = 1;
    if (timerdata.length >= 64) {
        const options = {
            type: "error",
            title: "创建的计时任务太多了",
            message: ("最多可以容纳 "+maxtasknum+" 个任务，请删除一些再添加。"),
            buttons: ['取消']
        }
        ipcRenderer.send('openInfoMsgBox',options);
    } else {
        $("#nouse").css("display","block");
        ipcRenderer.send('openWinEdit');
    }
}
ipcRenderer.on('didFinishLoad', (event, arg) => {
    settingLoad();
    maintimer = self.setInterval("maintimerfunc()",500);
});
ipcRenderer.on('msgWinEdit', (event, arg) => {
    $("#nouse").css("display","none");
    if (arg[0] == 1) {
        taskAdd(arg[1],arg[2],arg[3],arg[4],arg[5],arg[6]);
        settingSave();
    }
});
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
});
ipcRenderer.on('informationDialogSelection', (event, arg) => {
    if (arg[0] == 1 && arg[1] == 1) {
        cbtnDelete(arg[2]);
    }
});
ipcRenderer.on('changeShowColor', (event, arg) => {
    showcolor = arg;
});
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
    updateshow(timerdata.length-1);
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
        if (nowmode == 7) {
            display = nowtime2display();
        } else {
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
        }
        let newtimerdataitem = [timei,nowmode,fromTimestamp,toTimestamp,title,display,timeoption];
        timerdata[taski] = newtimerdataitem;
        $("#timertimeh_"+taski).html(timertimenumchar(display[0]));
        $("#timertimem_"+taski).html(timertimenumchar(display[1]));
        $("#timertimes_"+taski).html(timertimenumchar(display[2]));
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
        var nowmode = nowtask[1];
        let starttime = timestamp2date2display(nowtask[2]);
        let endtime = (nowmode == 7) ? "无" : timestamp2date2display(nowtask[3]);
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
            case 7:
                nowmodestr = "当前时间";
                break;
            default:
                nowmodestr = "程序中止";
                break;
        }
        let nowdisplay = nowtask[5];
        var cellhtml = celltemplate.replace(/VARtimeridVAR/g, taski);
        cellhtml = cellhtml.replace(/VARtitleVAR/g, nowtask[4]);
        cellhtml = cellhtml.replace(/VARtimehVAR/g, nowdisplay[0]);
        cellhtml = cellhtml.replace(/VARtimemVAR/g, nowdisplay[1]);
        cellhtml = cellhtml.replace(/VARtimesVAR/g, nowdisplay[2]);
        cellhtml = cellhtml.replace(/VARmodeVAR/g, nowmodestr);
        cellhtml = cellhtml.replace(/VARstarttimeVAR/g, starttime);
        cellhtml = cellhtml.replace(/VARendtimeVAR/g, endtime);
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
    showing = timerid;
    ipcRenderer.send('openWinShow',timerdata[timerid]);
}
function updateshow(timerid) {
    if (showing == timerid) {
        ipcRenderer.send('openWinShow',timerdata[timerid]);
    }
}
function editresetbtndata(timerid) {
    let nowdata = timerdata[timerid];
    var timeoption = nowdata[6];
    timeoption.push(nowdata[4]);
    var nowmode = nowdata[1];
    if (nowmode == 1 || nowmode == 2) {
        nowmode = 1;
    } else if (nowmode == 3 || nowmode == 4) {
        nowmode = 3;
    }
    timeoption.push(nowmode);
    editingitem = timerid;
    return timeoption;
}
function cbtnEdit(timerid) {
    $("#nouse").css("display","block");
    ipcRenderer.send('openWinEdit',editresetbtndata(timerid));
    settingSave();
}
function cbtnReset(timerid) {
    let edarr = editresetbtndata(timerid);
    taskAdd(edarr[0],edarr[1],edarr[2],edarr[3],edarr[4],edarr[5]);
    maintimerfunc();
    updateshow(timerid);
    settingSave();
}
function cbtnDelete(timerid) {
    timerdata.splice(timerid, 1);
    if (showing == timerid) {
        ipcRenderer.send('closeWinShow');
    }
    createallcell();
    settingSave();
}
function cbtnDeleteAll() {
    let timerdatalength = timerdata.length;
    if (timerdatalength > 0) {
        timerdata.splice(0,timerdata.length);
        ipcRenderer.send('closeWinShow');
        createallcell();
        settingSave();
    }
}