
/**
 * Engine
 */
(function(){
    var ThreadManager = function(){
        
        /**
         * Init
         **/
        var settings = {
            errors: {
                mainArgumentsPassed: "ThreadManager is not a function, use ThreadManager.create(func) instead.",
                internalMissingType: "Missing type: ",
                createThreadCreationFailed: "Thread creation failed.",
                stopThreadNotFound: "No thread with such id: "
            },
            infos: {
                createEmptyCreate: "Create function called with no arguments, nothing created.",
                typeNotImplemented: "Type not implemented: "
            }
        };
        
        if(arguments.length > 0){
            console.error(settings.errors.mainArgumentsPassed);
            return;
        }
        
        /**
         * Helpers
         **/
        var getName = function(n){
            for(var i in n){
                return i;
            }
        };
        var isNothing = function(obj){
            return  (obj === null) ||
                    (obj === undefined);
        };
        var type = function(obj){
            if(obj instanceof Function) return "function";
            if(obj instanceof Number) return "number";
            if(obj instanceof Boolean) return "boolean";
            if(obj instanceof String) return "string";
            if(obj instanceof Array) return "array";
            if(obj instanceof Date) return "date";
            if(obj.toString().indexOf("Object") != -1) return "object";
            console.info(settings.infos.typeNotImplemented + obj.toString());
            return obj.toString();
        };
        
        /**
         * Threads class
         **/
        var Threads = function(){
            var threads = {};
            this.push = function(obj){
                threads[obj.name] = obj;
                obj.start();
                return obj.name;
            };
            this.stop = function(str){
                var thread = threads[str];
                if(thread === undefined){
                    throw new Error("No such thread");
                }
                thread.stop();
            };
            this.stopAll = function(){
                for(var i in threads){
                    threads[i].stop();
                }
            };
        };
        var threads = new Threads();
        
        /**
         * Thread class
         **/
        var Thread = function(name, func, opt){
            var delay = 500;
            if(!isNothing(opt.delay)){
                delay = opt.delay;
            }
            var stopped = true,
                timer = null;
            var getDelay = function(){
                if(delay === "random"){
                    return Math.floor(Math.random() * 1000 + 1);
                }
                return delay;
            };
            var run = function(){
                if(!stopped){
                    if(!opt.single)
                        timer = setTimeout(arguments.callee, getDelay());
                    func.call();
                }
            };
            this.name = name;
            this.start = function(){
                stopped = false;
                timer = setTimeout(run, getDelay());
            };
            this.stop = function(){
                stopped = true;
                if(!isNothing(timer)){
                    clearTimeout(timer);
                }
            };
        };
        
        /**
         * Interface
         **/
        var anonThreads = 0;
        this.create = function(){
            var arg = arguments[0],
                objType = type(arg),
                threadID = null;    
            var opt = {};
            if(arguments.length < 1) {
                console.info(settings.infos.createEmptyCreate);
                return;
            }
            if(arguments.length > 1)
                if(!isNothing(arguments[1]) && type(arguments[1]) === "object"){
                    opt = arguments[1];
                }
            if(isNothing(opt.single)){
                opt.single = false;
            }
            if(objType === "function"){
                threadID = arg.name;
                if(threadID.length === 0){
                    threadID = "_thread" + (anonThreads++);
                }
                threadID = threads.push(new Thread(threadID, arg, opt));
            }
            if(threadID === null){
                console.error(settings.errors.createThreadCreationFailed);
            }
            return threadID;
        };
        this.stop = function(){
            var threadID = null;
            if(arguments.length > 0)
                threadID = arguments[0];
            if(threadID === null){
                threads.stopAll();
                return;
            }
            try {
                threads.stop(threadID);
            }
            catch(ex){
                console.error(settings.errors.stopThreadNotFound + threadID);
            }
        };
	};
    
    /**
     * Start init
     **/
    window.Overseer = new ThreadManager();
})();