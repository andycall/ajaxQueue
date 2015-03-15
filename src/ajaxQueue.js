

var ajaxQueue = (function($){
	var queue = [], // 一般请求队列
	    advancedQueue = [], // 高级请求队列
	    sendQueue = [], // 发送队列
	    sendDefault = {
	        url : "",
	        type : "POST",
	        data : "",
	        complete : function(){}
	    };

	function ajaxHandler(){
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
	ajaxHandler.prototype.pushRequest = function(sendObj, major){
	    var major = major || 0, // 默认为一般请求
	        self = this,
	        sendObj = extend(sendObj, sendDefault);
	            // debugger;
	    if(!major){
	        queue.push(sendObj);
	    }
	    else{
	        advancedQueue.push(sendObj);
	    }

	    self.init();
	};

	ajaxHandler.prototype.init = function(){
	    var self = this;

	    var checkImportant = advancedQueue.length,
	        checkQueue = queue.length,
	        checkSend = sendQueue.length,
	        sendObj = {};

	    if(checkImportant > 0){
	        // 发送特殊请求
	        sendObj = advancedQueue.shift();
	        sendQueue.unshift(sendObj);
	    }
	    else if(checkQueue > 0){
	        // 发送一般请求
	        sendObj = queue.shift();
	        sendQueue.push(sendObj);
	    }
	    else if(checkSend == 0){
	        // 没有请求, 服务待起
	        console.log("所有的请求都已成功发送");
	        return true;
	    }
	      // 检查是否正在发送
	    if(self.sendState) return;


	    self.sendQueue();
	};

	ajaxHandler.prototype.handleError = function(err){
	    var self = this;
	    console.log(err);

	    self.init();
	};

	ajaxHandler.prototype.sendQueue = function(){
	    var self = this,
	        sendObj,
	        request;

	    self.sendState = true;

	    sendObj = sendQueue.shift();

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

	ajaxHandler.setup = function(){
	    return new ajaxHandler();
	};

	return ajaxHandler;
})(jQuery);
