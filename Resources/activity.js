var activityIndicator = Titanium.UI.createActivityIndicator({
	height:50,
    width:10,
    style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
});

var activityView = Titanium.UI.createView({
	top: 0,
	bottom: 0,
	right: 0,
	left: 0,
	backgroundColor: '#000',
	opacity: 0.7
})

activityView.add(activityIndicator);
var showActivity = function(data) {
	activityIndicator.message = data.message;
	data.parent.add(activityView);
	activityView.show();
	activityIndicator.show();
};

var hideActivity = function(data) {
	data.parent.remove(activityView);
	activityView.hide();
	activityIndicator.hide();
};

