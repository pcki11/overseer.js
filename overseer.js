
/**
 * Engine
 */
(function(){
    var ThreadManager = function(){
        /**
         * Init
         **/
        var settings = {
            defaults: {
                delay: 500,
                randomMax: 1000
            },
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
        
        /**
         * Helpers
         **/
        var type = function(obj){
            if(obj instanceof Function) return "function";
            if(obj instanceof Number || (typeof obj == "number" && !isNaN(obj))) return "number";
            if(obj instanceof Boolean || typeof obj == "boolean") return "boolean";
            if(obj instanceof String || typeof obj == "string") return "string";
            if(obj instanceof Array) return "array";
            if(obj instanceof Date) return "date";
            if(!obj) return "empty";
            if(obj.toString().indexOf("Object") != -1) return "object";
            console.info(settings.infos.typeNotImplemented + obj.toString());
            return obj.toString();
        };
        
        /**
         * Thread class
         **/
        var Thread = function(name, func, opt){
            var delay = opt.delay,
                stopped = true,
                timer = null;
            var getDelay = function(){
                if(delay === "random"){
                    return Math.floor(Math.random() * settings.defaults.randomMax + 1);
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
                return this.name;
            };
            this.stop = function(){
                stopped = true;
                if(timer){
                    clearTimeout(timer);
                }
                return this.name;
            };
        };
        
        /**
         * Threads class
         **/
        var Threads = function(){
            var threads = {};
            var getThread = function(threadID){
                var thread = threads[threadID];
                if(thread === undefined){
                    throw new Error("No such thread");
                }
                return thread;
            };
            this.push = function(obj){
                threads[obj.name] = obj;
                return obj.name;
            };
            this.start = function(threadID){
                return getThread(threadID).start();
            };
            this.stop = function(threadID){
                return getThread(threadID).stop();
            };
            this.stopAll = function(){
                for(var i in threads){
                    threads[i].stop();
                }
            };
        };
        
        /**
         * Interface
         **/
        var threads = new Threads();
        
        this.create = function(){
            if(arguments.length < 1) {
                console.info(settings.infos.createEmptyCreate);
                return;
            }
            var action = arguments[0],
                objType = type(action),
                threadID = null;    
            var opt = {};
            if(arguments.length > 1 && type(arguments[1]) === "object"){
                opt = arguments[1];
            }
            opt.delay = opt.delay || settings.defaults.delay;
            if(type(opt.single) !== "boolean") {
                opt.single = false;
            }
            if(type(opt.start) !== "boolean"){
                opt.start = true;
            }
            if(type(opt.delay) !== "number" && opt.delay !== "random") {
                opt.delay = settings.defaults.delay;
            }
            if(objType === "function") {
                threadID = action.name;
                if(threadID.length === 0){
                    threadID = "_thread_" + (new Date()).getTime();
                }
                threadID = threads.push(new Thread(threadID, action, opt));
                if(opt.start){
                    threads.start(threadID);
                }
            }
            if(threadID === null){
                console.error(settings.errors.createThreadCreationFailed);
            }
            return threadID;
        };
        this.start = function(){
            if(arguments.length > 0 && type(arguments[0]) === "string"){
                return threads.start(arguments[0]);
            }
            return null;    
        };
        this.stop = function(){
            var threadID = null;
            if(arguments.length > 0)
                threadID = arguments[0];
            if(threadID === null){
                threads.stopAll();
                return null;
            }
            try {
                return threads.stop(threadID);
            }
            catch(ex){
                console.error(settings.errors.stopThreadNotFound + threadID);
            }
            return null;
        };
	};
    /**
     * init
     **/
    window.Overseer = new ThreadManager();
})();