ajaxQueue
=========

基于jquery的Ajax请求队列


因为要写个HTML5手机页面而诞生的Ajax队列

han.ajax( url [, settings ] )

## 用法




	var handler = AjaxQueue.setup(),
		priority = 0; // 优先级为0是普通请求，1为高级请求。 高级请求会优先发送

	handler.pushRequest({
		url: "" ,    // 发送的地址
		type : "",  // 提交类型
		complete : function(data){} //请求成功之后的回调函数 
	}, priority);


