
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
            if(obj instanceof Number) return "number";
            if(obj instanceof Boolean || typeof obj == "boolean") return "boolean";
            if(obj instanceof String || typeof obj == "string") return "string";
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
        
        /**
         * Thread class
         **/
        var Thread = function(name, func, opt){
            var delay = settings.defaults.delay;
            if(opt && opt.delay){
                delay = opt.delay;
            }
            var stopped = true,
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
            };
            this.stop = function(){
                stopped = true;
                if(timer){
                    clearTimeout(timer);
                }
            };
        };
        
        /**
         * Interface
         **/
        var anonThreads = 0;
        var threads = new Threads();
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
                if(arguments[1] && type(arguments[1]) === "object"){
                    opt = arguments[1];
                }
            if(!opt.single){
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
     * init
     **/
    window.Overseer = new ThreadManager();
})();