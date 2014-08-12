

var AjaxQueue = (function(){
        var queue = [], // 一般请求队列
            ImportQueue = [], // 高级请求队列
            Send = [], // 发送队列
            sendDefault = {
            	url : "",
                type : "POST",
                data : "",
                complete : function(){}
            };

        function AjaxHandle(){
            this.sendState = false;
        }

        function extend(obj, extension){
	        for(var key in extension){
	            if(extension.hasOwnProperty(key) && obj[key] == null){
	                obj[key] = extension[key];
	            }
	        }
	        return obj;
	    }
        AjaxHandle.prototype.pushRequest = function(sendObj, major){
            var major = major || 0, // 默认为一般请求
                self = this,
                sendObj = extend(sendObj, sendDefault);
                	// debugger;
            if(!major){
                queue.push(sendObj);
            }
            else{
                ImportQueue.push(sendObj);
            }

            self.init();
        }

        AjaxHandle.prototype.init = function(){
            var self = this;

            var checkImportant = ImportQueue.length,
                checkQueue = queue.length,
                checkSend = Send.length,
                sendObj = {};

            if(checkImportant > 0){
                // 发送特殊请求
                sendObj = ImportQueue.shift();
                Send.unshift(sendObj);
            }
            else if(checkQueue > 0){
                // 发送一般请求
                sendObj = queue.shift();
                Send.push(sendObj);
            }
            else if(checkSend == 0){
                // 没有请求, 服务待起
                console.log("所有的请求都已成功发送");
                return true;
            }
              // 检查是否正在发送
            if(self.sendState) return;


            self.send();
        }

        AjaxHandle.prototype.handleError = function(err){
            var self = this;
            console.log(err);

            self.init();
        }

        AjaxHandle.prototype.send = function(){
            var self = this,
                sendObj,
                request;

            self.sendState = true;

            sendObj = Send.shift();

            if(!sendObj) return;

            request = $.ajax({
                url : sendObj.url,
                type : sendObj.type,
                data : sendObj.data
            });

            request.done(function(data){
            	self.sendState = false;
                sendObj.complete.call(null, data)
                self.init();
            });

            request.fail(function(e, textStatus){
            	self.sendState = false;
                self.handleError(textStatus);
                self.init();
            });
        };

        AjaxHandle.setup = function(){
            return new AjaxHandle();
        }

        return AjaxHandle;
    })();	
