var tableViewTrackRow = Titanium.UI.createTableViewRow({
	height:55
});
var tableViewTrackLabel = Titanium.UI.createLabel({
	text: ' ReferenceID',
	top:0,
	left: 10
});
var tableViewTrackValue = Titanium.UI.createTextField({
	top:0,
	hintText: 'Reference ID',
	right: 10,
	width: 190
});

var referenceId = '';

var updateStatusValues = function(e) {
	referenceId = e.source.value;
	Ti.API.debug('ref ' + referenceId);
};
tableViewTrackValue.addEventListener('change', updateStatusValues);

tableViewTrackRow.add(tableViewTrackLabel);
tableViewTrackRow.add(tableViewTrackValue);

var tableViewTrackData = [tableViewTrackRow];
var tableViewTrack = Titanium.UI.createTableView({
	data: tableViewTrackData
});

var trackRequestButton = Titanium.UI.createButton({
	title: 'Submit'
})

var statusSuccessCallback = function(e) {
	var response = eval('('+ e.source.responseText +')');
	Ti.API.info(e.source.responseText);
	hideActivity({parent: win2});
	if(response.response == 200) {
		alert('Your Complaint Status is ' + response.status);
		return;
	} 
	alert('Invalid Reference Number');
}
var trackRequestStatus = function(e) {
	var parentWindow = win2;
	if(e.parentWindow != undefined) {
		parentWindow = e.parentWindow;
		referenceId = e.referenceId;
	}
	if(referenceId == undefined || referenceId == '' || referenceId == null){
		alert('Enter a Valid Reference ID');
		return;
	}
	tableViewTrackValue.blur();
	showActivity({parent: parentWindow, message: 'Requesting Status...'});
	var url = 'http://' + MACHINE_ADDRESS + '/complaint/status.json?reference_id=' + referenceId;
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET",url, false);
	xhr.setRequestHeader('Content-type','application/json');
	xhr.setRequestHeader('Accept','application/json');
	var timeout = setInterval(function() {
		Ti.API.debug(xhr.readyState);
        if (xhr.readyState == 4) {
            clearInterval(timeout);
            return;
        }
        failCallback();
    }, 40000);
	xhr.onload = function(e) {
		statusSuccessCallback(e);
	};
	xhr.send({});
};

trackRequestButton.addEventListener('click', trackRequestStatus);

var win2 = Titanium.UI.createWindow({  
    title:'Track Status',
    backgroundColor:'#fff',
    rightNavButton: trackRequestButton
});

tableViewTrack.addEventListener('click', function(e){
	tableViewTrackValue.blur();
});
win2.add(tableViewTrack);