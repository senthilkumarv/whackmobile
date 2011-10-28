var win3 = Titanium.UI.createWindow({  
    title:'My Complaints',
    backgroundColor:'#fff'
});

var mycomplaints = [];

var complaintList = Titanium.UI.createTableView({
	backgroundColor: 'white'
});

var showComplaintStatus = function(e) {
	referenceId = '';
	Titanium.API.info(e.source.title);
	trackRequestStatus({parentWindow: win3, referenceId: e.source.title});
}
complaintList.addEventListener('click', showComplaintStatus);
win3.add(complaintList);
var populateData = function(e) {
	Ti.API.debug('Populate');
	mycomplaints = [];
	var rows = db.execute('SELECT * FROM MyComplaints');
	i=0
	while(rows.isValidRow()){
		mycomplaints[i] = {title: rows.field(0).replace('.0', '')};
		rows.next();
		i++;
	}
	Ti.API.debug(mycomplaints);
	if(mycomplaints.length != 0)
		complaintList.setData(mycomplaints);
	
};


