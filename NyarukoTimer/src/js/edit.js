const {ipcRenderer} = require('electron');
function addnumoption(selectid,max=99,min=0) {
    if (!Number.isInteger(max) || !Number.isInteger(min)) return;
    let nhtm = "";
    for (let i = min; i <= max; i++) {
        let selected = "";
        nhtm += '<option id="opt'+i+'" value='+i+'>'+i+'</option>';
    }
    $("#"+selectid).append(nhtm);
}
function closewindow() {
    ipcRenderer.send('closeWinEdit',[0]);
}
function saveclosewindow() {
    let days = parseInt($("#seltimed").val());
    let hours = parseInt($("#seltimeh").val());
    let minutes = parseInt($("#seltimem").val());
    let seconds = parseInt($("#seltimes").val());
    let textnote = $("#textnote");
    let title = textnote.val();
    let ctime = creCurDateTime();
    if (title == "") {
        textnote.attr("value",ctime);
        title = ctime;
    }
    if ((days + hours + minutes + seconds) == 0) {
        const options = {
            type: 'error',
            title: '输入有误',
            buttons: ['知道了'],
            message: '请设置一个时间。'
        }
        ipcRenderer.send('msgboxWinEdit',options);
    } else {
        ipcRenderer.send('closeWinEdit',[1,days,hours,minutes,seconds,title]);
    }
}
function creCurDateTime() {
    return "未命名计时器 " + curDateTimeString();
}
function settitle(ctime=null) {
    if (ctime == null) ctime = creCurDateTime();
    $("#textnote").attr("value",ctime);
    document.title = ctime;
}
settitle();
addnumoption("seltimed",365);
addnumoption("seltimeh",23);
addnumoption("seltimem",59);
addnumoption("seltimes",59);
ipcRenderer.on('wineditinit', (event, arg) => {
    if (arg == null) return;
    $("#seltimed #opt"+arg[0]).attr("selected","selected");
    $("#seltimeh #opt"+arg[1]).attr("selected","selected");
    $("#seltimem #opt"+arg[2]).attr("selected","selected");
    $("#seltimes #opt"+arg[3]).attr("selected","selected");
    settitle(arg[4]);
})