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
    let date = timestamp < 0 ? new Date() : timestamp;
    return [date.getFullYear(),date.getMonth(),date.getDay(),date.getHours(),date.getMinutes(),date.getSeconds()];
}
function curDateTimeString() {
    let curstr = curDateTime();
    return curstr[0].toString() + addzero(curstr[1],12).toString() + addzero(curstr[2],30).toString() + addzero(curstr[3],24).toString() + addzero(curstr[4],59).toString() + addzero(curstr[5],59).toString();
}
function dhms2hmsstr(day,hours,minutes,seconds) {
    let newhours = day * 24 + hours;
    return addzero(newhours,24).toString() + addzero(minutes,59).toString() + addzero(seconds,59).toString();
}
function seconds2time(totalseconds=0) {
    let timearr = new Array();
    if(totalseconds > -1){
        let days = Math.floor(totalseconds / 86400);
        let hours = Math.floor(totalseconds / 3600);
        let minutes = Math.floor(totalseconds / 60) % 60;
        let seconds = totalseconds % 60;
        let milliseconds = (seconds - parseInt(seconds)) * 1000;
        timearr = [days,hours,minutes,seconds,milliseconds];
    }
    return timearr;
}
function seconds2time2display(totalseconds=0) {
    let nowtimert = seconds2time(totalseconds);
    var hours = nowtimert[0] * 24 + nowtimert[1];
    if (hours < 10) hours = "0" + hours;
    let minutes = nowtimert[2] < 10 ? "0" + nowtimert[2] : nowtimert[2];
    let seconds = nowtimert[3] < 10 ? "0" + nowtimert[3] : nowtimert[3];
    return [hours,minutes,seconds];
}
function timestamp2date(timestamp) {
    let date = new Date(timestamp);
    return [date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()];
}
function timestamp2date2display(timestamp) {
    let datearr = timestamp2date(timestamp);
    return datearr[0] + "-" + datearr[1] + "-" + datearr[2] + "&nbsp;" + datearr[3] + ":" + datearr[4] + ":" + datearr[5];
}
function time2seconds(days=0,hours=0,minutes=0,seconds=0) {
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}