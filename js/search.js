function getSearchString(codepoint) {
	var res = ctos([codepoint])
		+ '|U+' + itos(codepoint, 16, 4)
	    + '|cp:' + codepoint
	    + '|name:' + getName(codepoint, true)
	    + '|block:' + getBlockForCodepoint(codepoint).replace(/_/g, ' ')
	    + '|script:' + getScriptForCodepoint(codepoint).replace(/_/g, ' ')
	    + '|category:' + getCharacterCategoryName(codepoint);
	for (var i = 0; i < global_aliases.length; ++i) {
		if (global_aliases[i].codepoint == codepoint) {
			res += '|alias:' + global_aliases[i].alias;
		}
	}
	if (global_han_meanings[codepoint])
		res += '|meaning:' + global_han_meanings[codepoint];
	if (global_kun_readings[codepoint])
		res += '|kun:' + global_kun_readings[codepoint].split(', ').join('|kun:');
	if (global_on_readings[codepoint])
		res += '|on:' + global_on_readings[codepoint].split(', ').join('|on:');
	if (global_mandarin_readings[codepoint])
		res += '|mandarin:' + global_mandarin_readings[codepoint].split(', ').join('|mandarin:');
	return res.toUpperCase();
}

function initializeSearchStrings() {
	search_strings = [];

	for (var i = 0; i < global_all_assigned_ranges.length; ++i) {
		var range = global_all_assigned_ranges[i];
		var end = range.endCodepoint;
		for (var c = range.startCodepoint; c <= end; ++c) {
			var searchString = getSearchString(c);
			search_strings[c] = searchString;
		}
	}
}

function testSearch(searchString, words) {
	if (!searchString.includes(words[0]))
		return false;
	for (var i = 1; i < words.length; ++i) {
		if (!searchString.includes(words[i]))
			return false;
	}
	return true;
}

function searchCodepoints(str) {
	var results = [];

	var reachedMaxResults = function(results) {
		return results.length >= 256;
	}

	str = str.toUpperCase();
	var words = str.split(',');
	for (var i = 0; i < words.length; ++i)
		words[i] = words[i].trim();

	var results = [];
	for (var i = 0; i < global_all_assigned_ranges.length; ++i) {
		var range = global_all_assigned_ranges[i];
		var end = range.endCodepoint;
		for (var c = range.startCodepoint; c <= end; ++c) {
			var searchString = search_strings[c];
			if (!searchString)
				continue;
			if (testSearch(searchString, words)) {
				results.push(c);
				if (reachedMaxResults(results))
					return results;
			}
		}
	}

	return results;
}
