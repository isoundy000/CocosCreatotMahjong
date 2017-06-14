var eventCenter = {}
eventCenter.events = {}

eventCenter.new = function (name, event, cb, isLog) {
    if (this.events[name]) {
        cc.log(name + "eventCenter", "eventCenter:new Error: eventCenteraddListener, listener already exists!")
        return
    }
    if (!isLog) {
        cc.log("eventCenter:new", name, event, cb)
    }
    this.events[name] = {event:event, cd:cd}
}

eventCenter.getNums = function (){
    return Object.keys(this.events).length;
} 

eventCenter.delete = function(name){
    delete this.events[name];
}

eventCenter.dispatch = function(event, data, isLog) {
    if(isLog){
        cc.log("eventCenter dispatch: ", event, data)
    }
    for(var k in this.events) {
        if(event === this.events[k].event) {
            if(isLog){
                cc.log("eventCenter dispatch next: ", event, data)
            }
            this.events[k].cb(event, data);
        }
    }
}

module.exports = eventCenter;