ajaxQueue
=========

基于jquery的Ajax请求队列
用于处理优先ajax与一般ajax请求

## 用法


	var handler = AjaxQueue.setup(), // 实例化队列对象
		priority = 0; // 优先级为0是普通请求，1为高级请求。 高级请求会优先发送
  
    // 向队列中添加请求对象即可发送请求
	handler.pushRequest({
		url: "" ,    // 发送的地址
		type : "",  // 提交类型
		complete : function(data){} //请求成功之后的回调函数 
	}, priority);


