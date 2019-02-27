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
    let dd = parseInt($("#seltimed").val());
    let hh = parseInt($("#seltimeh").val());
    let mm = parseInt($("#seltimem").val());
    let ss = parseInt($("#seltimes").val());
    let textnote = $("#textnote");
    let tt = textnote.val();
    let ctime = creCurDateTime();
    if (tt == "") {
        textnote.attr("value",ctime);
        tt = ctime;
    }
    if ((dd + hh + mm + ss) == 0) {
        const options = {
            type: 'error',
            title: '输入有误',
            buttons: ['知道了'],
            message: '请设置一个时间。'
        }
        ipcRenderer.send('msgboxWinEdit',options);
    } else {
        ipcRenderer.send('closeWinEdit',[1,dd,hh,mm,ss,tt]);
    }
}
function creCurDateTime() {
    return "未命名计时器 " + curDateTime();
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