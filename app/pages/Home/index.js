(function (ActionAppCore, $) {

    var SiteMod = ActionAppCore.module("site");
    const { RTCPeerConnection, RTCSessionDescription } = window;

    
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
    west: { name: "welcome", control: "WelcomeCenter", "source": "__app" },
    east: false,
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


ThisPage.activePeer = new RTCPeerConnection();;



ThisPage.activePeer.ontrack = function({ streams: [stream] }) {
  console.log('ontrack')
  const remoteVideo = document.getElementById("remote-video");
  if (remoteVideo) {
    remoteVideo.srcObject = stream;
  }
};


navigator.getUserMedia(
  { video: true, audio: true },
  stream => {
    const localVideo = document.getElementById("local-video");
    if (localVideo) {
      localVideo.srcObject = stream;
    }
console.log('adding local tracks to peer');
    stream.getTracks().forEach(track => ThisPage.activePeer.addTrack(track, stream));
  },
  error => {
    console.warn(error.message);
  }
);

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


actions.requestMeeting = requestMeeting;
function requestMeeting(theParams, theTarget) {
  //ThisPage.isAlreadyCalling = true;
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['userid']);
  if(!(tmpParams.userid)){
    alert('No person selected', 'Select a person', 'e');
    return;
  }

  console.log('send requestMeeting',tmpParams.userid)

  //--- Quick test for one peer to peer
  var self = this;

  ThisPage.activePeer.createOffer().then(theOffer => {
    self.activeOffer = theOffer;
    ThisPage.activePeer.setLocalDescription(new RTCSessionDescription(self.activeOffer)).then();

    ThisPage.wsclient.send(JSON.stringify({
      offer: self.activeOffer,
      action: 'meeting', to: tmpParams.userid
    }))


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
function onMeetingRequst(theMsg){
  console.log('onMeetingRequst theMsg',theMsg);
  var tmpTitle = 'Meeting Request from ' + theMsg.fromname
  var tmpMsg = 'Do you want to join a meeting with ' + theMsg.fromname + '?'
  var self = this;

  var tmpConfirm = true;

  if( !ThisPage.inMeetingRequest ){
    ThisPage.inMeetingRequest = true;
    tmpConfirm = ThisApp.confirm(tmpMsg, tmpTitle);
  }
  $.when(tmpConfirm).then(theReply => {
    var tmpReplyMsg = {
      from: theMsg.fromid,
      reply: theReply
    }
    if( theReply ){
      ThisPage.activePeer.setRemoteDescription(new RTCSessionDescription(theMsg.offer)).then(
        function () {

          ThisPage.activePeer.createAnswer().then(theAnswer => {
            self.activeAnswer = theAnswer;

            ThisPage.activePeer.setLocalDescription(new RTCSessionDescription(theAnswer)).then(
              function (){
                ThisPage.wsclient.send(JSON.stringify({
                  action: 'meetingresponse', answer: self.activeAnswer, message: tmpReplyMsg
                }))
              }
            )

            

          });

        }
      );

      

    } else {
      ThisPage.wsclient.send(JSON.stringify({
        action: 'meetingresponse', message: tmpReplyMsg
      }))
    }
   
    
  })
  
}

function onMeetingResponse(theMsg){
  console.log('onMeetingResponse',theMsg);
  var self = this;
  
  //var theSocketID = 'todo';
  
  if( theMsg && theMsg.message && theMsg.message.reply === true){
  
    //alert('yes!');


    
    

    var tmpAnswer = theMsg.answer;
    ThisPage.activePeer.setRemoteDescription(
      new RTCSessionDescription(tmpAnswer)
    ).then(function(){
      //ToDo: Set this?
      
      if (!ThisPage.isAlreadyCalling) {
        //--- Socket ID?
        
        actions.requestMeeting({userid: theMsg.fromid})
        ThisPage.isAlreadyCalling = true;
        //self.callUser(theSocketID);
        
      } else {
        console.log('we have connection', typeof(ThisPage.activePeer));
        ThisPage.inMeetingRequest = false;

      }
    });
  
    

  } else {
    alert('' + theMsg.fromname + ' did not accept the requst', 'Request Not Accepted', 'e')
  }
  // var tmpTitle = 'Meeting Request from ' + theMsg.fromname
  // var tmpMsg = 'Do you want to join a meeting with ' + theMsg.fromname + '?'
  // ThisApp.confirm(tmpMsg, tmpTitle).then(theReply => {
  //   var tmpReplyMsg = {
  //     from: theMsg.fromid,
  //     reply: theReply
  //   }
  //   ThisPage.wsclient.send(JSON.stringify({
  //     action: 'meetingresponse', message: tmpReplyMsg
  //   }))
    
  // })
  
}

function processMessage(theMsg) {
  if (typeof(theMsg) == 'string' && theMsg.startsWith('{')) {
    theMsg = JSON.parse(theMsg);
  }
  if (typeof(theMsg) != 'object') {
    return;
  }

  var tmpAction = theMsg.action || theMsg.people;
  if (!(tmpAction)) {
    console.warn('no action to take', theMsg);
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

  } else if (tmpAction == 'chat') {
    ThisPage.parts.welcome.gotChat(theMsg);
  } else if (tmpAction == 'meetingrequest') {
    onMeetingRequst(theMsg);
  } else if (tmpAction == 'meetingresponse') {
    onMeetingResponse(theMsg);
  } else {
    console.log('unknown message', theMsg);
  }
  if (theMsg.people) {
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
    if (!(theMsg && theMsg.text)) {
      alert('Nothing to send', "Enter some text", "e").then(function () {
        return;
      })
    }
    ThisPage.wsclient.send(JSON.stringify({
      action: 'chat', message: theMsg
    }))
  }


actions.clearChat = function() {
  ThisPage.loadSpot('chatoutput', '');
}

actions.setYourName = function() {
  ThisApp.input('Enter your name', 'Any Display Name', 'Save Display Name', ThisPage.stage.profile.name).then(setProfileName);
}
//~YourPageCode~//~

})(ActionAppCore, $);
