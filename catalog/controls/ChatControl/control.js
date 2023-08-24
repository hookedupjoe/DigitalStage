(function (ActionAppCore, $) {

  var ControlSpecs = {
    options: {
      padding: false
    },
    content: [{
      "ctl": "layout",
      "attr": {
        "rem-template": "none"
      },
      "name": "lo",
      "north": [{
        ctl: 'segment',
        content: [{
          ctl: 'div',
          name: 'toolbar',
          content: [{
            "ctl": "title",
            "size": "Large",
            "color": "blue",
            "name": "title",
            "text": "Chatting as: "
          }]
        }]
      }],
      "south": [{
        "ctl": "control",
        "controlname": "SendBar",
        "catalog": "__app",
        "name": "sendbar"
      }],
      "center": [{
        ctl: 'spot',
        name: 'chat-area'
      }]
    }]
  }

  var ControlCode = {};

  ControlCode.setup = setup;
  function setup() {
    //--- Placeholder
  }

function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}

ControlCode.gotChat = function(theMsg){
  this.chatNumber = this.chatNumber || 0;
  this.chatNumber++;
  
  var tmpHTML = [];
  tmpHTML.push('<div class="ui message" chatcount="' + this.chatNumber + '">')
  tmpHTML.push('<b>' + theMsg.fromname + '</b><br />')
  tmpHTML.push('' + theMsg.chat.text)
  tmpHTML.push('</div">')
  this.addToSpot('chat-area', tmpHTML.join('\n'))
  
  var tmpLastAdded = this.getByAttr$({'chatcount':''+this.chatNumber});
  //Todo: check if scrolled up manually and do not do this
  if( tmpLastAdded.length > 0){
    
    var tmpPrevNum = this.chatNumber -1;
    if( tmpPrevNum ){
      var tmpPrevAdded = this.getByAttr$({'chatcount':''+tmpPrevNum});    
      if( tmpPrevAdded.length > 0){
        if( isScrolledIntoView(tmpPrevAdded.get(0))){
            tmpLastAdded.get(0).scrollIntoView()        
        }
      }
      
    }
  

    
  }
  
  window.tmpLastAdded = tmpLastAdded;
  
  
}

ControlCode.clearChat = function(){
  this.loadSpot('chat-area', '')
}

  
  ControlCode._onInit = _onInit;
  function _onInit() {
    var self = this;
    this.parts.sendbar.subscribe('send', function(theEvent, theControl, theValue){
      self.publish('sendChat',[this, theValue]);
    })
  }

  var ThisControl = {
    specs: ControlSpecs, options: {
      proto: ControlCode, parent: ThisApp
    }};
  return ThisControl;
})(ActionAppCore, $);