Ti.include('activity.js')
Ti.include('complaint.js')
Ti.include('status.js')
Ti.include('mycomplaints.js')
Ti.include('geolocation.js')

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
Ti.Geolocation.purpose = 'To Report Water Problems'
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
var MACHINE_ADDRESS = '172.16.1.44:3000';
var userName = '';
var mobileNumber = '';
var location = '';

if (Titanium.Platform.name != 'android')
{
    userName = Titanium.App.Properties.getString('name_preference');
    mobileNumber = Titanium.App.Properties.getString('mobile_preference');
    Ti.API.debug('UN' + userName + ' ' + mobileNumber);
}

getLocation();
var tabGroup = Titanium.UI.createTabGroup();

tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Complaint',
    window:win1
});

var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Track',
    window:win2
});

var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'My Complaints',
    window:win3
});

tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(tab3)

// open tab group
tabGroup.open();
