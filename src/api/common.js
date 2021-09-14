let common={}
//拷贝
common.deepClone = function (origin, target, filter) {
  var toStr = Object.prototype.toString,
    arrStr = '[object Array]',
    target = target || (toStr.call(origin) === arrStr ? [] : {});
  for (let prop in origin) {
    if (filter) {
      if (prop === filter) {
        break;
      }
    }
    if (origin.hasOwnProperty(prop)) {
      if (origin[prop] !== null && typeof(origin[prop]) === 'object') {
        if (toStr.call(origin[prop]) === arrStr) {
          target[prop] = [];
        } else {
          target[prop] = {};
        }
        common.deepClone(origin[prop], target[prop], filter);
      } else {
        target[prop] = origin[prop];
      }
    }
  }
  return target;
};


// 防抖
common.debounce = (fn, wait, immediate=false) => {
	let timer, startTimeStamp=0;
	let context, args;
 
	let run = (timerInterval)=>{
		timer= setTimeout(()=>{
			let now = (new Date()).getTime();
			let interval=now-startTimeStamp
			if(interval<timerInterval){ // the timer start time has been reset，so the interval is less than timerInterval
				console.log('debounce reset',timerInterval-interval);
				startTimeStamp=now;
				run(wait-interval);  // reset timer for left time 
			}else{
				if(!immediate){
					fn.apply(context,args);
				}
				clearTimeout(timer);
				timer=null;
			}
			
		},timerInterval);
	}
 
	return function(){
		context=this;
		args=arguments;
		let now = (new Date()).getTime();
		startTimeStamp=now; // set timer start time
 
		if(!timer){
			console.log('debounce set',wait);
			if(immediate) {
				fn.apply(context,args);
			}
			run(wait);    // last timer alreay executed, set a new timer
		}
		
	}
}

/// 节流
common.throttling = (fn, wait, immediate) => {
	let timer, timeStamp=0;
	let context, args;
 
	let run = () => {
		timer=setTimeout(()=>{
			if(!immediate){
				fn.apply(context,args);
			}
			clearTimeout(timer);
			timer=null;
		},wait);
	}
 
	return function () {
		context=this;
		args=arguments;
		if(!timer){
			console.log("throttle, set");
			if(immediate){
				fn.apply(context,args);
			}
			run();
		}else{
			console.log("throttle, ignore");
		}
	}
}
export default common;