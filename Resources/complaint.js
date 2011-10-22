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
  var rc = eval('('+this.responseText+')');
		if (rc['status'] == 'success') {
			alert(rc);
		} else {
			alert('fail');
		}
};
var failCallback = function(e) {
  Titanium.API.debug('fail');
};


var submitReport = function(e) {
	Ti.API.debug('submitting');
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET","http://172.16.1.15:3000/complaint/create.json?mobile=32532432&location=sdfsdf&type=sfdsf");
	xhr.setRequestHeader('Content-type','application/json');
	xhr.setRequestHeader('Accept','application/json');
	var timeout = setInterval(function() {
        if (xhr.readyState == 4) {
            clearInterval(timeout);
            failCallback();
        }
    }, 20000);
	xhr.onload = function(e) {
		successCallback(e);
	};
	xhr.send({});
};
var takePhoto = function(e) {
	Ti.API.debug('showCamera');
	/*Titanium.Media.showCamera({
		success: function (e) {
			Ti.API.debug(e);
		},
		error : function() {
			Ti.API.debug(e);
		}
	});*/
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
	var reviewDataTable = Titanium.UI.createTableView({
		backgroundColor: 'white',
		touchEnabled: true
	});
	for (var i=0; i < data.length; i++) {
		Ti.API.debug('Appending');
	  reviewDataTable.appendRow(data[i]);
	};
	
	var addPhotoRow = Ti.UI.createTableViewRow({
		title: 'Add Photo',
		touchEnabled: true
	});

	addPhotoRow.addEventListener('click', takePhoto);
	reviewDataTable.appendRow(addPhotoRow);
	
	reviewWindow.add(reviewDataTable);
}