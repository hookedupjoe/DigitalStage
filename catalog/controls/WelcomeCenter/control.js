(function (ActionAppCore, $) {

  var ControlSpecs = {
    options: {
      padding: false,
      required: {
            templates: {
              map:
              {
                "WelcomeHome": {
                  source: "__app", name: "WelcomeHome"
                }
              }
            }
          }
    },
    content: [{
      "ctl": "layout",
      "name": "lo",
      "north": [{
        ctl: "control",
        name: "header",
        catalog: "_designer",
        controlname: "MainHeader"
      }],
      "center": [{
        ctl: "control",
        name: "tabs",
        catalog: "_designer",
        controlname: "TabsContainer"
      }]

    }]
  }

  var ControlCode = {};

  ControlCode.setup = setup;
  function setup() {
    
  }
  ControlCode.onSendChat = onSendChat;
  function onSendChat(theEvent, theEl, theValue) {
    this.publish('sendChat', [this,theValue])
  }
  
    
  ControlCode.gotChat = function(theMsg){
    this.chatControl.gotChat(theMsg)
  }
  
  ControlCode.clearChat = function(){
    this.chatControl.clearChat();
  }

  ControlCode.refreshPeople = function(thePeople){
    var tmpHTML = [];
    var tmpActive = false;
    for (var aID in thePeople) {
      var tmpPerson = thePeople[aID];
      // if (aID == this.getPage().stage.userid) {
      //   tmpActive = true;
      //   tmpHTML.push('* ');
      // }
      tmpHTML.push(tmpPerson.name + '<hr />');
    }
    this.loadSpot('people-list', tmpHTML.join('\n'));
    
    this.chatControl.refreshPeople(thePeople);
  }


  ControlCode.openTabChat = function() {
    var tmpTabKey = 'tab-chat';
    var tmpTabTitle = 'Chat';
    var tmpIcon = 'user';
    var tmpParams = {};
    var self = this;
    //--- Open a new tab that contains a control
    //    Add a refrence to the control in a tab for easy access
    this.tabs.openTab({
      tabname: tmpTabKey,
      tabtitle: '<i class="icon ' + tmpIcon + ' blue"></i> ' + tmpTabTitle,
      controlname: 'ChatControl',
      catalog: '__app',
      closable: false,
      setup: tmpParams
    }).then(function(theControl){
      if( typeof(theControl) == 'object'){
         self.chatControl = theControl;
         //temp disable --> self.tabs.gotoTab('main');
         self.chatControl.subscribe('sendChat',onSendChat.bind(self))
      }
    });
  }



  ControlCode._onInit = _onInit;
  function _onInit() {
    this.parts.header.setHeader('Stage Entrance');

    this.tabs = this.parts.tabs;
    this.tabs.addTab({
      item: 'main',
      text: "Home",
      icon: 'home',
      content: '<div class="mar1 pad5" myspot="dashhome"></div>'
    });
    
    this.loadSpot('dashhome', {},  "WelcomeHome");
    this.openTabChat();
    
    

  }

  var ThisControl = {
    specs: ControlSpecs, options: {
      proto: ControlCode, parent: ThisApp
    }};
  return ThisControl;
})(ActionAppCore, $);