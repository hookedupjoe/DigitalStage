(function (ActionAppCore, $) {

    var SiteMod = ActionAppCore.module("site");

    //~thisPageSpecs//~
var thisPageSpecs = {
        "pageName": "Home",
        "pageTitle": "Home",
        "navOptions": {
            "topLink": true,
            "sideLink": true
        }
    }
//~thisPageSpecs~//~

    var pageBaseURL = 'app/pages/' + thisPageSpecs.pageName + '/';

    //~layoutOptions//~
thisPageSpecs.layoutOptions = {
    baseURL: pageBaseURL,
    north: false,
    east: { name: "welcome", control: "WelcomeCenter", "source": "__app" },
    west: false,
    center: { html: "center" },
    south: false
}
//~layoutOptions~//~

    //~layoutConfig//~
thisPageSpecs.layoutConfig = {
        west__size: "500"
        , east__size: "450"
    }
//~layoutConfig~//~
    //~required//~
thisPageSpecs.required = {

    }
//~required~//~

    var ThisPage = new SiteMod.SitePage(thisPageSpecs);

    var actions = ThisPage.pageActions;

    ThisPage._onPreInit = function (theApp) {
        //~_onPreInit//~

//~_onPreInit~//~
    }

    ThisPage._onInit = function () {
        //~_onInit//~

//~_onInit~//~
    }


    ThisPage._onFirstActivate = function (theApp) {
        //~_onFirstActivate//~

//~_onFirstActivate~//~
        ThisPage.initOnFirstLoad().then(
            function () {
                //~_onFirstLoad//~
window.ThisPageNow = ThisPage;

ThisPage.parts.welcome.subscribe('sendChat', onSendChat)

ThisPage.chatInput = ThisPage.getByAttr$({pageuse:"chatinput"})

ThisPage.stage = {
  name: "The Fun Stage",
  userid: sessionStorage.getItem('userid') || '',
  profile: {
    name: sessionStorage.getItem('displayname') || ''
  }
}
ThisApp.stage = ThisPage.stage;

console.log('ThisPage.stage.userid',ThisPage.stage.userid);


var tmpURL = ActionAppCore.util.getWebsocketURL('actions', 'ws-stage');
ThisPage.wsclient = new WebSocket(tmpURL);
ThisPage.wsclient.onmessage = function (event) {
  var tmpData = '';
  if (typeof (event.data == 'string')) {
    tmpData = event.data.trim();
    if (tmpData.startsWith('{')) {
      tmpData = JSON.parse(tmpData);
      processMessage(tmpData);
    }
  }
  
}

refreshUI();
//~_onFirstLoad~//~
                ThisPage._onActivate();
            }
        );
    }


    ThisPage._onActivate = function () {
        //~_onActivate//~

//~_onActivate~//~
    }

    ThisPage._onResizeLayout = function (thePane, theElement, theState, theOptions, theName) {
        //~_onResizeLayout//~

//~_onResizeLayout~//~
    }

    //------- --------  --------  --------  --------  --------  --------  -------- 
    //~YourPageCode//~
function refreshUI() {
  ThisPage.loadSpot('your-disp-name', ThisPage.stage.profile.name);
  var tmpName = ThisPage.stage.profile.name;
  var tmpProfileStatus = 'new';
  if (tmpName) {
    tmpProfileStatus = 'outside';
  }
  if (ThisPage.stage.people && ThisPage.stage.people[ThisPage.stage.userid]) {
    tmpProfileStatus = 'backstage';
  }

  ThisPage.showSubPage({
    item: tmpProfileStatus, group: 'profilestatus'
  });

}

actions.sendProfile = sendProfile;
function sendProfile() {
  ThisPage.wsclient.send(JSON.stringify({
    action: 'profile', profile: ThisPage.stage.profile, userid: ThisPage.stage.userid, id: ThisPage.stage.stageid
  }))
}

actions.refreshPeople = refreshPeople;
function refreshPeople(thePeople) {

  ThisPage.stage.people = thePeople;
  //ThisPage.parts.welcome.refreshPeople(thePeople);
  ThisPage.parts.welcome.refreshPeople(thePeople);

  refreshUI();
}

function processMessage(theMsg) {
  if (typeof(theMsg) == 'string' && theMsg.startsWith('{')) {
    theMsg = JSON.parse(theMsg);
  }
  if (typeof(theMsg) != 'object') {
    return;
  }
  //console.log('got', theMsg);
  var tmpAction = theMsg.action || theMsg.people;
  if (!(tmpAction)) {
    console.log('no action to take', theMsg);
    return;
  }

  if (tmpAction == 'welcome' && theMsg.id) {
    ThisPage.stage.stageid = theMsg.id;
    if (!(ThisPage.stage.userid)) {
      ThisPage.stage.userid = theMsg.userid;
      sessionStorage.setItem('userid', ThisPage.stage.userid)
    } else {
      //--- We already have a profile, send userid we have
      if (ThisPage.stage.profile.name && ThisPage.stage.userid) {
        sendProfile();
      }
      //ThisPage.wsclient.send({action:'profile',})
    }
    console.log('ThisPage.stage.stageid', ThisPage.stage.stageid);

  } else if (tmpAction == 'chat') {

    ThisPage.parts.welcome.gotChat(theMsg);
    // console.log('chat', theMsg);
    // var tmpHTML = [];
    // tmpHTML.push('<div class="ui message">')
    // tmpHTML.push('<b>' + theMsg.fromname + '</b><br />')
    // tmpHTML.push('' + theMsg.chat.text)
    // tmpHTML.push('</div">')
    // ThisPage.addToSpot('chatoutput', tmpHTML.join('\n'))

  }
  if (theMsg.people) {
    console.log('theMsg.people', theMsg.people);

    refreshPeople(theMsg.people);
  }

}
function setProfileName(theName) {
  if (!(theName)) return;
  ThisPage.stage.profile = ThisPage.stage.profile || {};
  ThisPage.stage.profile.name = theName;
  sessionStorage.setItem('displayname', theName)
  sendProfile();
  refreshUI();
}

function onSendChat(theEvent, theEl, theMsg) {
  console.log("Page got chat", theMsg)
  if (!(theMsg && theMsg.text)) {
    alert('Nothing to send', "Enter some text", "e").then(function() {
      return;
    })
  }
  ThisPage.wsclient.send(JSON.stringify({
    action: 'chat', message: theMsg}))
}


// actions.sendChat = function() {
//     var tmpChat = ThisPage.chatInput.val();
//     if( !(tmpChat)){
//         alert('Nothing to send', "Enter some text", "e").then(function(){
//             ThisPage.chatInput.focus();
//             return;
//         })
//     }
//     ThisPage.wsclient.send(JSON.stringify({action:'chat', chat: {text:tmpChat}}))
// }


actions.clearChat = function() {
  ThisPage.loadSpot('chatoutput', '');
}

actions.setYourName = function() {
  ThisApp.input('Enter your name', 'Any Display Name', 'Save Display Name', ThisPage.stage.profile.name).then(setProfileName);
}
//~YourPageCode~//~

})(ActionAppCore, $);
