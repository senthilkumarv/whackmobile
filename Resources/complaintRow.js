var createComplaintRow = function(data) {
	var fieldName = Ti.UI.createLabel({
		text: data.fieldName,
		textAlign: 'left',
		top: 0,
  		left:10,
		color:'#900'
	});
	var fieldValue = Ti.UI.createTextField({
		value: data.fieldValue,
		textAlign: 'right',
		top: 0,
  		right: 10,
  		enabled: false
	});
	var row = Ti.UI.createTableViewRow({
		
		height: 55
	});
	row.add(fieldName);
	row.add(fieldValue);
	return row;
};
