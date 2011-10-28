Ti.include('complaintRow.js')
geoLocationResult = {};
var complaintNature = 0;
var win1 = Titanium.UI.createWindow({  
    title:'Report Problem',
    backgroundColor:'#fff'
});
var reviewWindow = null;

var data = [{title: 'No Water Supply'},
{title: 'Water Leakage',
	touchEnabled: true},
{title: 'Dumping Waste in Fresh Water',
	touchEnabled: true}];

var complaintTopics = Ti.UI.createTableView({
	data:data
});

var reportWaterSupply = function () {
	complaintNature = "WS";
 	Ti.API.debug('Water Supply');
};

var reportLeakage = function() {
	complaintNature = "WL";
	Ti.API.debug('Leakage');
};

var reportDumping = function() {
	complaintNature = "WD";
	Ti.API.debug('Dumping');
}

var raiseComplaint = function(e) {
	switch(e.index) {
		case 0:
			reportWaterSupply();
			break;
		case 1:
			reportLeakage();
			break;
		case 2:
			reportDumping();
			break;
	}

	Ti.API.debug("Res" + geoLocationResult.street + " " + geoLocationResult.status);
	reviewComplaintData();
};

complaintTopics.addEventListener('click', raiseComplaint);
var file = null;
win1.add(complaintTopics);
var sendPic = function(param) {
	Ti.API.debug('Inside SendPic');
	var data_to_send = { 
		
        "file": file.read(), 
        "name": param 
    };
    
    Ti.API.debug('data: ' + data_to_send);
    var xhr = Titanium.Network.createHTTPClient();
    xhr.setRequestHeader("enctype", "multipart/form-data");
    xhr.setRequestHeader("Content-Type", "image/png");
    xhr.open("POST",'http://' + MACHINE_ADDRESS + '/complaints/upload/'+param, false);
    xhr.send(data_to_send); 
    xhr.onload = function() {
        textfield.value = this.responseText;
        Ti.API.info(this.responseText); 
    };
};
var successCallback = function(e) {
	if(e.source.status == 200) {
		Titanium.API.debug('succ');
		Ti.API.debug(e.source.responseText);
	 	var result = eval('(' + e.source.responseText + ')');
	 	hideActivity({parent: reviewWindow});
	 	Ti.API.debug(result);
		if(result.response == 200) {
			alert('Complaint Submitted. Complaint ID is ' + result.reference_id);
			db.execute('INSERT INTO MyComplaints (REFERENCEID) VALUES(?)', result.reference_id);
			populateData();
			sendPic(result.reference_id);
			return;
		} 
	}
	alert('Request Failed. Retry');
	
};
var failCallback = function(e) {
  Titanium.API.debug('fail');
  alert('Request Timed Out...');
  hideActivity({parent: reviewWindow});
};


var submitReport = function(e) {
	Ti.API.debug('submitting');
	showActivity({parent: reviewWindow, message: 'Registering Complaint...'})
	var xhr = Ti.Network.createHTTPClient();
	var url = 'http://' + MACHINE_ADDRESS + '/complaints.json';
	var data = '{"complaint": {"mobile":"' + mobileNumber +'","location":"' + location +'","complaint_type":"' + complaintNature +'"}}';
	
	Ti.API.info('URL: ' + data);
	xhr.open("POST",url, false);
	xhr.setRequestHeader('Content-type','application/json');
	xhr.setRequestHeader('Accept','application/json');
	xhr.onload = function(e) {
		successCallback(e);
	};
	xhr.send(data);
};
var reviewDataTable;
var changePhotoRow = function(e, cam) {
	var labl1 = Titanium.UI.createLabel({
		text: 'Photo',
		textAlign: 'left',
		top: 0,
  		left:10,
		color:'#900'
	});
	var img1 = Titanium.UI.createImageView({
		top:0,
		right: 10,
		height: 55,
		width: 70,
		image: cam.media
	});
	e.source.add(labl1);
	e.source.add(img1);
	e.source.title = '';
	
	file = Titanium.Filesystem.createTempFile();
	file.write(cam.media);
	reviewDataTable.removeEventListener('click', takePhoto);
	reviewDataTable.touchEnable = false;
};
var takePhoto = function(e) {
	Ti.API.debug(e);
	if(e.index == 3 && e.source.title == 'Add Photo') {
		Ti.API.debug('showCamera');	
		Titanium.Media.showCamera({
			saveToPhotoGallery: false,
			allowEditing: false,
			autohide:true,
			success: function (evnt) {
				Ti.API.debug('succress');
				Ti.API.debug(evnt.media);
				Ti.API.debug(e);
				changePhotoRow(e, evnt);
			},
			error : function(err) {
				Ti.API.debug('fail');
				Ti.API.debug(err);
			}
			
		});
	}
};
var mobileChanged = function(e) {
	mobileNumber = e.source.value;
	Ti.API.info('m' + mobileNumber);
};
var nameChanged = function(e) {
	userName = e.source.value;
	Ti.API.info('n' + userName);
};
var locationChanged = function(e) {
	location = e.source.value;
	Ti.API.info(location + 'l');
};
var reviewComplaintData = function() {
	var sendReportButton = Titanium.UI.createButton({
    	title: 'Submit',
    	
	});
	sendReportButton.addEventListener('click', submitReport);
	reviewWindow = Titanium.UI.createWindow({  
	    title:'Review Complaint',
	    backgroundColor:'#fff',
	    rightNavButton: sendReportButton
	});
	tab1.open(reviewWindow)
	
	var data = [];
	data[0] = createComplaintRow({fieldName: "Mobile Number", fieldValue: mobileNumber, changeHandler: mobileChanged});
	data[1] = createComplaintRow({fieldName: "Name", fieldValue: userName, changeHandler: nameChanged});
	var address = geoLocationResult.street + ',' + geoLocationResult.city + ',' + geoLocationResult.country;
	location = address;
	data[2] = createComplaintRow({fieldName: "Location", fieldValue: address, changeHandler: locationChanged});
	reviewDataTable = Titanium.UI.createTableView({
		backgroundColor: 'white',
		touchEnabled: true
	});
	for (var i=0; i < data.length; i++) {
		Ti.API.debug('Appending');
		if(i == data.length-1) data[i].enabled = false;
	  reviewDataTable.appendRow(data[i]);
	  
	};
	
	var addPhotoRow = Ti.UI.createTableViewRow({
		title: 'Add Photo',
		touchEnabled: true,
		height: 55
	});

	reviewDataTable.addEventListener('click', takePhoto);
	reviewDataTable.appendRow(addPhotoRow);
	
	reviewWindow.add(reviewDataTable);
}