/*
TextSendBar Control

Author: Joseph Francis
License: MIT
*/
(function (ActionAppCore, $) {

	var ControlSpecs = {
		"options": {
			"padding": false
		},
		"content": [
		{
						"ctl": "dropdown",
						"list": "@everyone in the room|everyone,@Bob,@Jane",
						"default":"everyone",
						"name": "sendtoselect"
					}
		]
	}

  var ControlCode = {
		runTextSend: runTextSend,
		clearTextSend: clearTextSend,
		showLoading: showLoading,
		clearLoading: clearLoading,
		_onInit: _onInit
	};

	
	function showLoading(theIsLoading) {
		var tmpSeg = this.getItem('container');
		if( !tmpSeg && tmpSeg.el){
			return;
		}
		if( theIsLoading !== false ){
			tmpSeg.el.addClass('loading');
		} else {
			tmpSeg.el.removeClass('loading');
		}
	}
	function clearLoading() {
		this.showLoading(false)
	}
	function runTextSend(theOnlyIfChangedFlag) {
		var tmpVal = this.getFieldValue('TextSend');
		this.lastVal = tmpVal;
		if( tmpVal == '' ){
			this.publish('clear',[this]);
			return;
		}
		this.publish('send',[this,tmpVal]);
		this.clearTextSend();
	}
	function clearTextSend() {
		this.setFieldValue('');
		this.publish('clear',[this]);
	}
	function _onInit() {
		//--- Only fire the process change event
		var processChange = ActionAppCore.debounce(function (theEvent) {			
			var tmpVal = this.getFieldValue('TextSend');
			var tmpIsDisabled = (this.getFieldValue('TextSend') == '')
			this.setItemDisabled('btn-send',tmpIsDisabled)
			this.setItemDisabled('btn-clear',tmpIsDisabled)
			if( ( theEvent && theEvent.keyCode  && theEvent.keyCode == 13) ){
				this.runTextSend(true);
			} else if( ( theEvent && theEvent.keyCode  && theEvent.keyCode == 27) ){
				this.clearTextSend()
			}
			
		}, 100).bind(this);
		
		this.elTextSend = this.getFieldEl('TextSend');
		this.elTextSend.on('change', processChange.bind(this));
		this.elTextSend.keyup(processChange.bind(this));
		this.setItemDisabled('btn-send',true)
		this.setItemDisabled('btn-clear',true)
		
	}
	
	

	//---- Return control
	var ThisControl = {specs: ControlSpecs, options: { proto: ControlCode, parent: ThisApp }};
	return ThisControl;

})(ActionAppCore, $);

