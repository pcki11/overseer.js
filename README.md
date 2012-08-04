overseer.js
===========

Abstraction above setTimeout javascript function.

Usage:
*Create recurring task:

    var task = Overseer.create(function(){
        // the function to execute
        console.log("tick");
    }, {
        delay:  1500, // 1.5 sec delay
        single: false // task is recurring
    });

*Stop task:

    Overseer.stop(task);