const {ipcRenderer} = require('electron');
$(document).ready(function() {
    
});
ipcRenderer.on('wincolorinit', (event, arg) => {
    const colordiv = $('#colordiv');
    console.log("arg",arg);
    if (arg) {
        colordiv.html("");
        colordiv.jPicker(
        {
            window:{
                expandable: false
            },
            color:{
                alphaSupport: false,
                active: new $.jPicker.Color({ hex: arg })
            }
        },
        function(color, context)
        {
            let all = color.val('all');
            let hex = all && '#' + all.hex || '';
            let alpha = all && all.a + '%' || '';
            ipcRenderer.send('closeWinColor',[1,hex,alpha]);
        },
        function(color, context)
        {
            var hex = color.val('hex');
        },
        function(color, context)
        {
            ipcRenderer.send('closeWinColor',[0]);
        });
    } else {
        colordiv.html("参数错误");
    }
});