function Format() {
    this.jsjava_class = "jsjava.text.Format";
}
function NumberFormat() {
    this.jsjava_class = "jsjava.text.NumberFormat";
}
String.prototype.trim = function (char, type) {
  if (char) {
    if (type == 'left') {
      return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
    } else if (type == 'right') {
      return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
    }
    return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
  }
  return this.replace(/^\s+|\s+$/g, '');
};
NumberFormat.prototype = new Format();
NumberFormat.prototype.constructor = NumberFormat;
NumberFormat.prototype.format = function(number) {
    if (isNaN(number)) {
        throw new IllegalArgumentException(IllegalArgumentException.ERROR, "The argument must be a number");
    }
    var pattern = this.pattern;
    if (pattern == "") {
        return number;
    }
    var strNum = new String(number);
    var numNum = parseFloat(number);
    var isNegative = false;
    if (numNum < 0) {
        isNegative = true;
    }
    if (isNegative) {
        strNum = strNum.substring(1, strNum.length);
        numNum = -numNum;
    }
    var ePos = pattern.indexOf("E");
    var pPos = pattern.indexOf("%");
    if (ePos != -1 && pPos != -1) {
        throw new IllegalArgumentException(IllegalArgumentException.ERROR, "Malformed exponential pattern : E and % can not be existed at the same time");
    }
    if (ePos != -1) {
        if (ePos == pattern.length - 1) {
            throw new IllegalArgumentException(IllegalArgumentException.ERROR, "Malformed exponential pattern " + this.pattern);
        }
        beStr = pattern.substring(0, ePos);
        aeStr = pattern.substring(ePos + 1);
        var dPos = beStr.indexOf(".");
        var dPosOfNum = strNum.indexOf(".");
        if (dPos != -1) {
            if (dPosOfNum == -1) {
                dPosOfNum = strNum.length - 1;
            }
            var strNumBuffer = new StringBuffer(strNum);
            strNumBuffer.deleteCharAt(dPosOfNum);
            strNumBuffer.insert(dPos, ".");
            var snbStr = strNumBuffer.getValue();
            var adStrLength = beStr.length - dPos;
            var snbFixed = new Number(parseFloat(snbStr)).toFixed(adStrLength - 1);
            var aeLabel = dPosOfNum - dPos;
            if (isNegative) {
                return "-" + snbFixed + "e" + (aeLabel);
            } else {
                return snbFixed + "e" + (aeLabel);
            }
        } else {
            if (dPosOfNum == -1) {
                dPosOfNum = strNum.length - 1;
            }
            var strNumBuffer = new StringBuffer(strNum);
            strNumBuffer.deleteCharAt(dPosOfNum);
            strNumBuffer.insert(beStr.length, ".");
            var snbStr = strNumBuffer.getValue();
            var adStrLength = beStr.length - beStr.length;
            var snbFixed = -1;
            if (adStrLength == 0) {
                snbFixed = new Number(parseFloat(snbStr)).toFixed();
            } else {
                snbFixed = new Number(parseFloat(snbStr)).toFixed(adStrLength - 1);
            }
            var aeLabel = dPosOfNum - beStr.length;
            if (isNegative) {
                return "-" + snbFixed + "e" + (aeLabel);
            } else {
                return snbFixed + "e" + (aeLabel);
            }
        }
    }
    if (pPos != -1) {
        if (pPos != pattern.length - 1) {
            throw new IllegalArgumentException(IllegalArgumentException.ERROR, "Malformed exponential pattern " + this.pattern);
        }
        pattern = pattern.substring(0, pattern.length - 1);
        numNum = parseFloat(number) * 100;
        strNum = new String(numNum);
        if (isNegative) {
            strNum = strNum.substring(1, strNum.length);
            numNum = -numNum;
        }
    }
    var dPos = pattern.indexOf(".");
    var dPosOfNum = strNum.indexOf(".");
    var result = "";
    if (dPos != -1) {
        if (dPosOfNum == -1) {
            dPosOfNum = strNum.length - 1;
        }
        var adStrLength = pattern.length - dPos;
		var zeroLength = pattern.trim('#', 'right').length - dPos
		var optionalZeroLength = adStrLength - zeroLength
		
		var snbFixed = 0;
		if (optionalZeroLength > 0)
		{		
			snbFixed = new Number(parseFloat(strNum)).toFixed(adStrLength - 1);
			strNum = new String(snbFixed);		
						
			for (var i = 0; i < optionalZeroLength; i++) {
				console.log(strNum.lastIndexOf('0') != strNum.length - 1);
				if (strNum.lastIndexOf('0') === strNum.length - 1)
					strNum = strNum.substring(0, strNum.length - 1);
				else				
					break;
			}
			snbFixed = strNum;
		}
		else
		{
			snbFixed = new Number(parseFloat(strNum)).toFixed(adStrLength - 1);
		}
		
        if (isNegative) {
            result = "-" + snbFixed;
        } else {
            result = snbFixed;
        }
    } else {
        if (dPosOfNum == -1) {
            dPosOfNum = strNum.length - 1;
        }
        var snbFixed = new Number(parseFloat(strNum)).toFixed();
        if (isNegative) {
            result = "-" + snbFixed;
        } else {
            result = snbFixed;
        }
    }
    if (pPos != -1) {
        result += "%";
    }
    return result;
};
function DecimalFormat() {
    this.jsjava_class = "jsjava.text.DecimalFormat";
}
DecimalFormat.prototype = new NumberFormat();
DecimalFormat.prototype.constructor = DecimalFormat;
DecimalFormat.SPECIAL_CHARS = ["0", ".", "-", ",", "E", "%", "\u00A4", "\u2030", "#"];
DecimalFormat.prototype.applyPattern = function(pattern) {
    if (pattern == undefined) {
        pattern = "";
    }
    function contains(arr, char) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == char) {
                return true;
            }
        }
        return false;
    }
    for (var i = 0; i < pattern.length; i++) {
        if (!contains(DecimalFormat.SPECIAL_CHARS, pattern.charAt(i))) {
            throw new IllegalArgumentException(IllegalArgumentException.ERROR, "Malformed pattern " + pattern);
        }
    }
    this.pattern = pattern;
};