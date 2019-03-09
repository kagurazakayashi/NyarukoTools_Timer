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
    let modeselid = parseInt($("#modesel").val());
    var ctime;
    switch (modeselid) {
        case 3:
        case 4:
            ctime = creCurDateTime("倒计时");
            break;
        case 7:
            ctime = "系统时间";
            break;
        default:
            ctime = creCurDateTime();
            break;
    }
    if (title == "") {
        textnote.attr("value",ctime);
        title = ctime;
    }
    if (modeselid != 7 && (days + hours + minutes + seconds) == 0) {
        const options = {
            type: 'error',
            title: '输入有误',
            buttons: ['重新设定'],
            message: '请设置一个时间。'
        }
        ipcRenderer.send('msgboxWinEdit',options);
    } else {
        ipcRenderer.send('closeWinEdit',[1,days,hours,minutes,seconds,title,modeselid]);
    }
}
function creCurDateTime(modestr="计时器") {
    return "未命名" + modestr + curDateTimeString();
}
function settitle(ctime=null) {
    if (ctime == null) ctime = creCurDateTime();
    $("#textnote").attr("value",ctime);
    document.title = ctime;
}
// settitle();
addnumoption("seltimed",365);
addnumoption("seltimeh",23);
addnumoption("seltimem",59);
addnumoption("seltimes",59);
ipcRenderer.on('wineditinit', (event, arg) => {
    if (arg) {
        $("option").attr("selected",false);
        $("#seltimed #opt"+arg[0]).attr("selected",true);
        $("#seltimeh #opt"+arg[1]).attr("selected",true);
        $("#seltimem #opt"+arg[2]).attr("selected",true);
        $("#seltimes #opt"+arg[3]).attr("selected",true);
        settitle(arg[4]);
        $("#modesel #modesel"+arg[5]).attr("selected",true);
    }
})