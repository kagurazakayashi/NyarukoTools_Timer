function addzero(num,max) {
    let nv = num;
    let numlength = max.toString().length;
    let nownumlength = num.toString().length;
    let clength = numlength - nownumlength;
    for (let j = 0; j < clength; j++) {
        nv = "0" + nv;
    }
    return nv;
}
function curDateTime(timestamp = -1) {
    var date = timestamp < 0 ? new Date() : timestamp;
    return [date.getFullYear(),date.getMonth(),date.getDay(),date.getHours(),date.getMinutes(),date.getSeconds()];
}
function curDateTimeString() {
    var curstr = curDateTime();
    return curstr[0].toString() + addzero(curstr[1],12).toString() + addzero(curstr[2],30).toString() + addzero(curstr[3],24).toString() + addzero(curstr[4],59).toString() + addzero(curstr[5],59).toString();
}
function dhms2hmsstr(day,hours,minutes,seconds) {
    let newhours = day * 24 + hours;
    return addzero(newhours,24).toString() + addzero(minutes,59).toString() + addzero(seconds,59).toString();
}
function seconds2time(totalseconds=0) {
    var timearr = new Array();
    if(totalseconds > -1){
        var days = Math.floor(totalseconds / 86400);
        var hours = Math.floor(totalseconds / 3600);
        var minutes = Math.floor(totalseconds / 60) % 60;
        var seconds = totalseconds % 60;
        var milliseconds = (seconds - parseInt(seconds)) * 1000;
        timearr = [days,hours,minutes,seconds,milliseconds];
    }
    return timearr;
}
function timestamp2date(timestamp) {
    var date = new Date(shijianchuo);
}
function time2seconds(days=0,hours=0,minutes=0,seconds=0) {
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}