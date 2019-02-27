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
function curDateTime() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDay();
    var hh = d.getHours();
    var mm = d.getMinutes();
    var ss = d.getSeconds();
    var curDateTime = year.toString();
    curDateTime += addzero(month,12).toString();
    curDateTime += addzero(day,30).toString();
    curDateTime += addzero(hh,24).toString();
    curDateTime += addzero(mm,59).toString();
    curDateTime += addzero(ss,59).toString();
    return curDateTime;
 }
function seconds2time(seconds=0) {
    var timearr = new Array();
    if(seconds > -1){
        var days = Math.floor(seconds/86400);
        var hours = Math.floor(seconds/3600);
        var minutes = Math.floor(seconds/60) % 60;
        var sec = seconds % 60;
        var secf = sec - parseInt(sec);
        timearr = [days,hours,minutes,sec,secf];
    }
    return timearr;
}
function time2seconds(days=0,hours=0,minutes=0,seconds=0) {
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}