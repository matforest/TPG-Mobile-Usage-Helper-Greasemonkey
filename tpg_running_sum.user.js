// ==UserScript==
// @name           TPG Running Sum
// @namespace      forest.id.au
// @grant          none
// @include        https://cyberstore.tpg.com.au/your_account/index.php?function=view_all_mobile*
// ==/UserScript==



var rows = $('table[rules="all"] tr');

var totalCharge = 0;
var totalData = 0;

// Track all the amounts
var amounts = new Array();

// Add the running sum columns
rows.each(function(i) {

	// Header
	if (i == 0) {
		$(this).append('<th>Total Data</th>');
		$(this).append('<th>Total Charge</th>');
		return;
	}
	
	// Adjusted row (probably)
	if (this.children.length < 6) {
		$(this).append('<td></td>');
		$(this).append('<td></td>');
		return;
	}

	var dataTD = $(this.children[2]).html();
	var matchData = dataTD.match(/([0-9.]+)MB.*/)
	if (matchData != null) {
		var data = matchData[1];
		totalData += new Number(data);
		$(this).append('<td> ' + totalData.toFixed(2) + 'MB</td>');
	} else {
		$(this).append('<td></td>');
	}

	var chargeTD = $(this.children[5]).html();
	var charge = chargeTD.match(/.([0-9.]+) */)[1];
	var amount = new Number(charge);
	if (amount > 0) {
		totalCharge += amount;
		$(this).append('<td> $' + totalCharge.toFixed(4) + '</td>');
	} else {
		$(this).append('<td> </td>');
	}

	amounts.push(amount);
});


// Highlight rows based on their cost


// Find the maximum charge
amounts.sort(function(a, b) {
   return parseFloat(a) - parseFloat(b);
});
var maxAmount = amounts[amounts.length - 1];

rows.each(function(i) {

	if (i == 0) {
		return;
	}

	var chargeTD = $(this.children[5]).html();
	var charge = chargeTD.match(/.([0-9.]+) */)[1];
	var amount = new Number(charge);

	var percentage = amount/maxAmount;

	$(this).css('background-color', createRed(percentage));
	// console.log(amount + ', ' + percentage  + ', ' + createRed(percentage));
});


function createRed(percentage) {

	var max = 255;
	var val = Math.floor((1 - percentage) * max);

	var string = 'rgb(255,'+val+','+val+')';
	return string;
}