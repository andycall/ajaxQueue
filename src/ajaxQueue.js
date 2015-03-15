var AjaxQueue = (function($){
	var queue = [], // 一般请求队列
	    advancedQueue = [], // 高级请求队列
	    sendQueue = [], // 发送队列
		errorQueue = [];


	function AjaxHandler(){
	    this.sendState = false;
	}

	AjaxHandler.prototype.pushRequest = function(major, settings){
		var priority = major || 0, // 默认为一般请求
			hasWhen = arguments.length > 2,
			self = this,
			param = $.extend({
				type : "POST",
				url : "",
				data : {},
				success : function(){},
				error : function(){},
				context : null
			}, settings);

	    if(!priority){
	        queue.push(param);
	    }
	    else{
	        advancedQueue.push(param);
	    }

	    self.init();
	};

	AjaxHandler.prototype.init = function(){
	    var self = this;

	    var checkPriority = advancedQueue.length,
	        checkQueue = queue.length,
	        checkSend = sendQueue.length,
	        param;

	    if(checkPriority > 0){
	        // 发送特殊请求
		    param = advancedQueue.shift();
	        sendQueue.unshift(param);
	    }
	    else if(checkQueue > 0){
	        // 发送一般请求
	        param = queue.shift();
	        sendQueue.push(param);
	    }
	    else if(checkSend === 0){
	        // 没有请求, 服务待起
	        return true;
	    }
	      // 检查是否正在发送
	    if(self.sendState) return;

	    self.sendQueue();
	};

	AjaxHandler.prototype.handleError = function(errorQueue){
	    var self = this;
	    console.log(errorQueue);
	};

	AjaxHandler.prototype.sendQueue = function(){
	    var self = this,
	        param,
	        request;

	    self.sendState = true;

		param = sendQueue.shift();


	    if(!param) {
		    self.when();
		    self.handleError.call(self, errorQueue);
		    return;
	    }

	    request = $.ajax(param);

	    request.done(function(data){
	        self.sendState = false;
	        self.init();
	    });

	    request.fail(function(error){
	        self.sendState = false;
			errorQueue.push(error);
	        self.init();
	    });
	};

	// TODO: When
	//AjaxHandler.prototype.when = function(callback){
	//	callback.call(this);
	//};

	return AjaxHandler;
})(jQuery);
