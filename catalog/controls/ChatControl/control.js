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
        "classes": "pad5 mar2",
        content: [{
          ctl: 'div',
          name: 'toolbar',
          content: [{
            "ctl": "title",
            "size": "small",
            "color": "violet",
            "name": "title",
            "text": '<div pageaction="setYourName" class="ui label violet right pointing mar0">Display Name: </div> <span style="margin-left:10px;" pagespot="your-disp-name">(none)</span>'
          }]
        }]
      }],
      "south": [{
        ctl: 'segment',
        classes: 'mar2 pad5',
        content: [{
          "ctl": "control",
          "controlname": "SendBar",
          "catalog": "__app",
          "name": "sendbar"
        }, {
          ctl: 'div',
          classes: 'pad3'
        }, {
          "ctl": "fieldrow",
          "name": "ro1",
          items: [{
            "ctl": "checkboxlist",
            "list": "Private|private",
            "default": "public",
            "direction": "upward",
            "onChange": {
              "run": "refreshPeopleList"

            },
            "size": 5,
            "name": "selectvis"
          },
            {
              "ctl": "dropdown",
              "list": "everyone",
              "default": "everyone",
              "direction": "upward",
              "size": 13,
              "onChange": {
                "run": "onPersonSelect"
  
              },
              "name": "selectto"
            }]
        }]


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

  function setChatName(theName) {}
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



  ControlCode.onPersonSelect = function() {
    var tmpSelected = this.getFieldValue('selectto');
    
    if( (tmpSelected) ){
      this.lastPersonSelected = tmpSelected  
    }
    //console.log( 'onPersonSelect', this.lastPersonSelected);
    
  }
  
  ControlCode.refreshPeopleList = function() {
    //--- Refresh
    var tmpPeople = this.people;
    var tmpPrivate = this.getFieldValue('selectvis');

    var tmpList = '';
    if (tmpPrivate != 'private') {
      tmpList = this.everyoneOption;
    }

    if (!(ThisApp.stage && ThisApp.stage.userid)) {
      return;
    }
    var tmpUserID = ThisApp.stage.userid; //this.getParentPage().stage.userid;

    for (var aID in tmpPeople) {
      var tmpPerson = tmpPeople[aID];
      if (tmpUserID != aID) {
        if (tmpPerson && tmpPerson.name) {
          if (tmpList) {
            tmpList += ',';
          }
          tmpList += '@' + tmpPerson.name + "|" + aID;
        }
      }
    }
    this.setFieldList('selectto', tmpList)
    var tmpSel = this.lastPersonSelected;
    if (!tmpPrivate) {
      tmpSel = tmpSel || 'everyone';
    }
    this.setFieldValue('selectto',tmpSel)
  }
  ControlCode.refreshPeople = function(thePeople) {
    this.people = thePeople;
    this.refreshPeopleList();
  }

  ControlCode.gotChat = function(theChat) {
    var tmpMsg = theChat.message;
    var tmpText = tmpMsg.text;
    var tmpTo = tmpMsg.to;
    var tmpVis = tmpMsg.vis;
    var tmpToName = theChat.toname;
    var tmpColor = 'blue';
    var tmpNameColor = 'blue';
    if (tmpVis == 'private') {
      tmpColor = 'grey';
      tmpNameColor = 'black'
    }


    this.chatNumber = this.chatNumber || 0;
    this.chatNumber++;

    var tmpNewChat = `<div class="ui message `+ tmpColor +` mar0 pad3" chatcount="` + this.chatNumber + `">
    <div class="ui label right pointing ` + tmpNameColor + ` basic">` + theChat.fromname + `</div>`;

    if (tmpToName) {
      tmpNewChat += `<div class="ui label basic">@` + tmpToName + `</div> `
    }
    tmpNewChat += tmpText + `</div>`;

    this.addToSpot('chat-area', tmpNewChat)

    var tmpLastAdded = this.getByAttr$({
      'chatcount': ''+this.chatNumber
    });
    if (tmpLastAdded.length > 0) {
      var tmpPrevNum = this.chatNumber -1;
      if (tmpPrevNum) {
        var tmpPrevAdded = this.getByAttr$({
          'chatcount': ''+tmpPrevNum
        });
        if (tmpPrevAdded.length > 0) {
          if (isScrolledIntoView(tmpPrevAdded.get(0))) {
            tmpLastAdded.get(0).scrollIntoView()
          }
        }

      }
    }



  }

  ControlCode.clearChat = function() {
    this.loadSpot('chat-area', '')
  }


  ControlCode._onInit = _onInit;
  function _onInit() {
    var self = this;
    //this.page = this.getParentPage();
    //this.stage = this.page.stage;
    // this.userid = this.stage.userid;

    this.everyoneOption = "@ The Room|everyone";
    this.setFieldList('selectto', this.everyoneOption);

    this.parts.sendbar.subscribe('send', function(theEvent, theControl, theValue) {
      var tmpMsg = {
        vis: self.getFieldValue('selectvis'),
        to: self.getFieldValue('selectto'),
        text: theValue
      }
      self.publish('sendChat', [this, tmpMsg]);
    })
  }

  var ThisControl = {
    specs: ControlSpecs,
    options: {
      proto: ControlCode,
      parent: ThisApp
    }};
  return ThisControl;
})(ActionAppCore, $);