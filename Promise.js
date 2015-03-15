function Promise(){
	this._callbacks = [];
}


Promise.prototype.then = function(){

};

Promise.prototype.resolve = function(){

};


Promise.prototype.reject = function(){

};

Promise.prototype.when = function(){

};



function A(){
	var promise = new Promise();
	setTimeout(function(){
		console.log(1);
		promise.resolve();
	});

	return promise;
}



var promise1 = A();
var promise2 = A();




