window.$ = function(selector){
    if(!selector)
        return null;
	var DOMobj = null;
	if(typeof selector === "string"){
        var elArray = selector.split(" ");
        for(var i in elArray){
            var item = elArray[i];
            switch(item[0]){
                case ".":
                    //TODO get elements by class
                    break;
                case "#":
                    DOMobj = document.getElementById(item.substring(1));
                    break;
                default:
                    
                    break;
            }
        }
	}
    else if(typeof selector === "object"){
        if(selector === document){
            console.dir(this);
            return;
        }
    }
    return DOMobj;
};
/**
 * Test
 */
Overseer.create(function(){
    var max = 0,
        start = 1,
        numArray = [],
        resEl = $("#res"),
        stopEl = $("#stop"),
        startEl = $("#start"),
        updateNumBar = function(number, val){
            var el = $("#num" + number);
            numArray[number] = val;
            if(numArray[number] > max){
                max = numArray[number];
                for(var i in numArray){
                    var elToUpdate = $("#num" + i);
                    elToUpdate.setAttribute("style","height:" + ((numArray[i] / max) * 100) + "px;");
                }
            }
            el.innerHTML = numArray[number];
            el.setAttribute("style","height:" + ((numArray[number] / max) * 100) + "px;");
        };
    var progress = function(diff){
        var c = 1, sign = 1;
        for(var i=start;i<start + 2*diff;i++){
            if(i > 0 && i < 201 && c > 0){
                updateNumBar(i, c % diff);
            }
            c += sign;
            if(c == diff){
                sign = -1;
                c--;
            }
        }
        if(start < 201){
            start++;
        }
        else
            start = -diff;
    }
    for(var j = 1; j < 201; j++){
        var nCont = document.createElement("div"),
            el = document.createElement("div");
        el.setAttribute("id", "num" + j);
        el.innerHTML = 0;
        el.setAttribute("style","height:100px;");
        nCont.innerHTML = j;
        nCont.appendChild(el);
        resEl.appendChild(nCont);
        numArray[j] = 0;
    }
    
    stopEl.addEventListener("click", function(){
        Overseer.stop();
    }, false);
    
    startEl.addEventListener("click", function(){
        Overseer.create(function(){
            progress(6);
        }, {delay: 40});
    }, false);
    
}, {delay: 1000, single: true});