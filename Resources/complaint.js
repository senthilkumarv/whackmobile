Ti.include('complaintRow.js')
geoLocationResult = {};
var complaintNature = 0;
var win1 = Titanium.UI.createWindow({  
    title:'Report Problem',
    backgroundColor:'#fff'
});


var data = [{title: 'Water Supply'},
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
	while(geoLocationResult.status == undefined || geoLocationResult.status == null);
	while(geoLocationResult.astatus == undefined || geoLocationResult.astatus == null);
	Ti.API.debug("Res" + geoLocationResult.street + " " + geoLocationResult.status);
	reviewComplaintData();
};

complaintTopics.addEventListener('click', raiseComplaint);

win1.add(complaintTopics);
var successCallback = function(e) {
	Titanium.API.debug('succ');
	Ti.API.debug(e.source.responseText);
 	var result = eval('(' + e.source.responseText + ')');
 	Ti.API.debug(result);
	if(result.response == 201) {
		alert('Complaint Submitted. Complaint ID is ' + result.reference_id);
		return;
	} 
	alert('Request Failed. Retry');
	
};
var failCallback = function(e) {
  Titanium.API.debug('fail');
};


var submitReport = function(e) {
	Ti.API.debug('submitting');
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET","http://192.168.124.16:3000/complaint/create.json?mobile=32532432&location=sdfsdf&type=sfdsf");
	xhr.setRequestHeader('Content-type','application/json');
	xhr.setRequestHeader('Accept','application/json');
	var timeout = setInterval(function() {
		Ti.API.debug(xhr.readyState);
        if (xhr.readyState == 4) {
            clearInterval(timeout);
            return;
        }
        failCallback();
    }, 20000);
	xhr.onload = function(e) {
		successCallback(e);
	};
	xhr.send({});
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
	var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'camera_photo.png');
	f.write(cam.media);
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
var reviewComplaintData = function() {
	var sendReportButton = Titanium.UI.createButton({
    	title: 'Submit',
    	
	});
	sendReportButton.addEventListener('click', submitReport);
	var reviewWindow = Titanium.UI.createWindow({  
	    title:'Review Complaint',
	    backgroundColor:'#fff',
	    rightNavButton: sendReportButton
	});
	tab1.open(reviewWindow)
	
	var data = [];
	data[0] = createComplaintRow({fieldName: "Mobile Number", fieldValue: "+919663368421"});
	data[1] = createComplaintRow({fieldName: "Name", fieldValue: "Senthil"});
	var address = geoLocationResult.street + ',' + geoLocationResult.city + ',' + geoLocationResult.country;
	data[2] = createComplaintRow({fieldName: "Location", fieldValue: address});
	reviewDataTable = Titanium.UI.createTableView({
		backgroundColor: 'white',
		touchEnabled: true
	});
	for (var i=0; i < data.length; i++) {
		Ti.API.debug('Appending');
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