/**
 * Apple-Style Flip Counter
 * ------------------------
 *
 * Copyright (c) 2010 Chris Nanney
 * http://cnanney.com/journal/code/apple-style-counter-revisited/
 * http://cnanney.com/journal/code/apple-style-counter/
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 1.0
 * Released: November 15, 2010
 */

var flipCounter = function(d, options){

	// Default values
	var defaults = {
		value: 0,
		inc: 1,
		pace: 1000,
		auto: true
	};
	
	var o = options || {},
	div = d && d != '' ? "#" + d : "#counter";
	
	for (var opt in defaults) o[opt] = (opt in o) ? o[opt] : defaults[opt];

	var tFrameHeight = 39,
	bFrameHeight = 64,
	frameWidth = 53,
	digitsOld = [], digitsNew = [], subStart, subEnd, x, y, nextCount = null;
	
	/**
	 * Sets the value of the counter and animates the digits to new value.
	 * 
	 * Example: myCounter.setValue(500); would set the value of the counter to 500,
	 * no matter what value it was previously.
	 *
	 * @param {int} n
	 *   New counter value
	 */
	this.setValue = function(n){
		if (isNumber(n)){
			x = o.value.toString();
			y = n.toString();
			o.value = n;
			digitCheck(x,y);
		}
		return this;
	};
	
	/**
	 * Sets the increment for the counter. Does NOT animate digits.
	 */
	this.setIncrement = function(n){
		o.inc = isNumber(n) ? n : defaults.inc;
		return this;
	};
	
	/**
	 * Sets the pace of the counter. Only affects counter when auto == true.
	 *
	 * @param {int} n
	 *   New pace for counter in milliseconds
	 */
	this.setPace = function(n){
		o.pace = isNumber(n) ? n : defaults.pace;
		return this;
	};
	
	/**
	 * Sets counter to auto-incrememnt (true) or not (false).
	 *
	 * @param {bool} a
	 *   Should counter auto-increment, true or false
	 */
	this.setAuto = function(a){
		if (a && ! o.atuo){
			o.auto = true;
			doCount();
		}
		if (! a && o.auto){
			if (nextCount) clearTimeout(nextCount);
			o.auto = false;
		}
		return this;
	};
	
	/**
	 * Increments counter by one animation based on set 'inc' value.
	 */
	this.step = function(){
		if (! o.auto) doCount();
		return this;
	};
	
	/**
	 * Adds a number to the counter value, not affecting the 'inc' or 'pace' of the counter.
	 *
	 * @param {int} n
	 *   Number to add to counter value
	 */
	this.add = function(n){
		if (isNumber(n)){
			x = o.value.toString();
			o.value += n;
			y = o.value.toString();
			digitCheck(x,y);
		}
		return this;
	};
	
	/**
	 * Subtracts a number from the counter value, not affecting the 'inc' or 'pace' of the counter.
	 *
	 * @param {int} n
	 *   Number to subtract from counter value
	 */
	this.subtract = function(n){
		if (isNumber(n)){
			x = o.value.toString();
			o.value -= n;
			if (o.value >= 0){
				y = o.value.toString();
			}
			else{
				y = "0";
				o.value = 0;
			}
			digitCheck(x,y);
		}
		return this;
	};
	
	//---------------------------------------------------------------------------//
	
	function doCount(){
		x = o.value.toString();
		o.value += o.inc;
		y = o.value.toString();
		digitCheck(x,y);
		if (o.auto === true) nextCount = setTimeout(doCount, o.pace);
	}
	
	function digitCheck(x,y){
		digitsOld = splitToArray(x);
		digitsNew = splitToArray(y);
		if (y.length > x.length){
			var diff = y.length - x.length;
			while (diff > 0){
				var adder = 1;
				addDigit(y.length - diff + 1, digitsNew[y.length - diff]);
				adder++;
				diff--;
			}
		}
		if (y.length < x.length){
			var diff = x.length - y.length;
			while (diff > 0){
				var adder = 1;
				removeDigit(x.length - diff);
				diff--;
			}
		}
		for (var i = 0; i < digitsOld.length; i++){
			if (digitsNew[i] != digitsOld[i]){
				animateDigit(i, digitsOld[i], digitsNew[i]);
			}
		}
	}
	
	function animateDigit(n, oldDigit, newDigit){
		var speed;
		if (o.auto === true && o.pace <= 300){
			switch (n){
				case 0:
					speed = o.pace/6;
					break;
				case 1:
					speed = o.pace/5;
					break;
				case 2:
					speed = o.pace/4;
					break;
				case 3:
					speed = o.pace/3;
					break;
				default:
					speed = o.pace/2;
					break;
			}
		}
		else{
			speed = 80;
		}
		// Cap on slowest animation can go
		speed = (speed > 80) ? 80 : speed;
		
		// Do animation
		$(div + " #d" + n + " li.t")
		// Top old digit postion 2
		.delay(speed).animate({'background-position': '-' + frameWidth + 'px -' + (oldDigit * tFrameHeight) + 'px'}, 0)
			// Top old digit position 3
			.delay(speed).animate({'background-position': (frameWidth * -2) + 'px -' + (oldDigit * tFrameHeight) + 'px'}, 0)
			// Top new digit position 1
			.delay(speed).animate({'background-position': '0 -' + (newDigit * tFrameHeight) + 'px'}, 0, function(){
				$(div + " #d" + n + " li.b")
					// Bottom old digit position 2
					.animate({'background-position': '-' + frameWidth + 'px -' + (oldDigit * bFrameHeight) + 'px'}, 0)
					// Bottom old digit position 3
					.delay(speed).animate({'background-position': (frameWidth * -2) + 'px -' + (newDigit * bFrameHeight) + 'px'}, 0)
					// Bottom old digit position 4
					.delay(speed).animate({'background-position': (frameWidth * -3) + 'px -' + (newDigit * bFrameHeight) + 'px'}, 0)
					// Bottom new digit position 1
					.delay(speed).animate({'background-position': '0 -' + (newDigit * bFrameHeight) + 'px'}, 0);
			});
	}
	
	// Creates array of digits for easier manipulation
	function splitToArray(input){
		var digits = new Array();
		for (var i = 0; i < input.length; i++){
			subStart = input.length - (i + 1);
			subEnd = input.length - i;
			digits[i] = input.substring(subStart, subEnd);
		}
		return digits;
	}

	// Adds new digit
	function addDigit(len, digit){
		var li = Number(len) - 1;
		if (li % 3 == 0) $(div).prepend('<ul class="cd"><li class="s"></li></ul>');
		$(div).prepend('<ul class="cd" id="d' + li + '"><li class="t"></li><li class="b"></li></ul>');
		$(div + " #d" + li + " li.t").css({'background-position': '0 -' + (digit * tFrameHeight) + 'px'});
		$(div + " #d" + li + " li.b").css({'background-position': '0 -' + (digit * bFrameHeight) + 'px'});
	}
	
	// Removes digit
	function removeDigit(id){
		console.log('tried to remove digit: ' + id);
		$(div + " #d" + id).remove();
		// Check for leading comma
		var first = $(div + " li").first();
		
		if (first.hasClass("s")) first.parent("ul").remove();
	}

	// Sets the correct digits on load
	function initialDigitCheck(initial){
		// Creates the right number of digits
		var count = initial.toString().length;
		var bit = 1;
		for (var i = 0; i < count; i++){
			$(div).prepend('<ul class="cd" id="d' + i + '"><li class="t"></li><li class="b"></li></ul>');
			if (bit != (count) && bit % 3 == 0) $(div).prepend('<ul class="cd"><li class="s"></li></ul>');
			bit++;
		}
		// Sets them to the right number
		var digits = splitToArray(initial.toString());
		for (var i = 0; i < count; i++){
			$(div + " #d" + i + " li.t").css({'background-position': '0 -' + (digits[i] * tFrameHeight) + 'px'});
			$(div + " #d" + i + " li.b").css({'background-position': '0 -' + (digits[i] * bFrameHeight) + 'px'});
		}
		// Do first animation
		if (o.auto === true) doCount();
	}
	
	// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric/1830844
	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	// Start it up
	initialDigitCheck(o.value);
}