(function (ActionAppCore, $) {

	var ControlSpecs = { 
		options: {
			padding: true
		},
		content: [
		{
			ctl: "spot",
			name: "body",
			text: "Use loadSpot to load me"
		}
		]
	}

	var ControlCode = {};

    ControlCode.setup = setup;
    function setup(){
        console.log("Ran setup")
    }

    ControlCode._onInit = _onInit;
    function _onInit(){
        //console.log("Ran _onInit")
    }

	var ThisControl = {specs: ControlSpecs, options: { proto: ControlCode, parent: ThisApp }};
	return ThisControl;
})(ActionAppCore, $);