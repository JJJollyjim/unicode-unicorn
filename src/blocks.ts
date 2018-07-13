var global_blockRanges: { startCodepoint: number; endCodepoint: number; blockName: string; }[] = [];
var global_syllableRanges: { startCodepoint: number; endCodepoint: number; syllableType: string; }[] = [];
var global_shortJamoNames: { [codepoint: number]: string; } = [];
var global_scriptRanges: { startCodepoint: number; endCodepoint: number; scriptName: string; }[] = [];

function initBlockData(completion: () => void) {
	requestAsync('data/Unicode/UCD/Blocks.txt', undefined, function(line) {
		var splitLine = line.split(';');
		var startCodepoint = parseInt(splitLine[0].split('..')[0], 16);
		var endCodepoint = parseInt(splitLine[0].split('..')[1], 16);
		var blockName = splitLine[1].trim();
		global_blockRanges.push({startCodepoint: startCodepoint, endCodepoint: endCodepoint, blockName: blockName});
	}, function() {
        var html = '';
        for (var i = 0; i < global_blockRanges.length; ++i) {
            var b = global_blockRanges[i];
            html += ('<option data-block="' + b.blockName + '">' +
                b.blockName + ' (from U+' + itos(b.startCodepoint, 16, 4) + ' to U+' + itos(b.endCodepoint, 16, 4) + ')</option>');
        }
        updateSelectOptions('.all-blocks', html);
        completion();
    });
}

function getBlockForCodepoint(codepoint: number): string {
	for (var i = 0; i < global_blockRanges.length; ++i) {
		if (codepoint >= global_blockRanges[i].startCodepoint &&
			codepoint <= global_blockRanges[i].endCodepoint) {
			return global_blockRanges[i].blockName;
		}
	}
	return 'No_Block';
}

function initHangulSyllableTypes(completion: () => void) {
	requestAsync('data/Unicode/UCD/HangulSyllableType.txt', undefined, function(line) {
		var splitLine = line.split(';');
		var startCodepoint: number, endCodepoint: number;
		if (splitLine[0].trim().split('..').length == 2) {
			startCodepoint = parseInt(splitLine[0].trim().split('..')[0], 16);
			endCodepoint = parseInt(splitLine[0].trim().split('..')[1], 16);
		} else {
			startCodepoint = parseInt(splitLine[0].trim(), 16);
			endCodepoint = startCodepoint;
		}
		var syllableType = splitLine[1].trim();
		global_syllableRanges.push({
			startCodepoint: startCodepoint,
			endCodepoint: endCodepoint,
			syllableType: syllableType
		});
	}, completion);
}

function getSyllableTypeForCodepoint(codepoint: number): string {
	for (var i = 0; i < global_syllableRanges.length; ++i) {
		if (codepoint >= global_syllableRanges[i].startCodepoint &&
			codepoint <= global_syllableRanges[i].endCodepoint) {
			return global_syllableRanges[i].syllableType;
		}
	}
	return 'Not_Applicable';
}

function initShortJamoNames(completion: () => void) {
	requestAsync('data/Unicode/UCD/Jamo.txt', undefined, function(line) {
		var splitLine = line.split(';');
		var codepoint = parseInt(splitLine[0].trim(), 16);
		var shortJamoName = splitLine[1].trim();
		global_shortJamoNames[codepoint] = shortJamoName;
	}, completion);
}

function getShortJamoName(codepoint: number): string {
	return global_shortJamoNames[codepoint];
}

function initScriptData(completion: () => void) {
	requestAsync('data/Unicode/UCD/Scripts.txt', undefined, function(line) {
		var splitLine = line.split(';');
		var startCodepoint: number, endCodepoint: number;
		if (splitLine[0].trim().split('..').length == 2) {
			startCodepoint = parseInt(splitLine[0].trim().split('..')[0], 16);
			endCodepoint = parseInt(splitLine[0].trim().split('..')[1], 16);
		} else {
			startCodepoint = parseInt(splitLine[0].trim(), 16);
			endCodepoint = startCodepoint;
		}
		var scriptName = splitLine[1].trim();
		global_scriptRanges.push({startCodepoint: startCodepoint, endCodepoint: endCodepoint, scriptName: scriptName});
	}, completion);
}

function getScriptForCodepoint(codepoint: number): string {
	for (var i = 0; i < global_scriptRanges.length; ++i) {
		if (codepoint >= global_scriptRanges[i].startCodepoint &&
			codepoint <= global_scriptRanges[i].endCodepoint) {
			return global_scriptRanges[i].scriptName;
		}
	}
	return 'Unknown';
}
