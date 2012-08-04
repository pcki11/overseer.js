overseer.js
===========

Abstraction above setTimeout javascript function.

**Usage:**  
*Create recurring task:*

    var task = Overseer.create(function(){
        // the function to execute
        console.log("tick");
    }, {
        delay:  1500,   // accepts number or "random" as value
        single: false,  // task is recurring
        start:  false   // do not start task just yet
    });

*Start task:*

    Overseer.start(task);

*Stop task:*

    Overseer.stop(task);

*Stop all tasks:*

    Overseer.stop();