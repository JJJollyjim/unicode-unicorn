function initLanguageData(completion: () => void) {
	var parseLanguageData = function(lines: string[]) {
		var languageTags = [];
		var entries = lines.join('\n').split('\n%%\n');
		for (let i = 0; i < entries.length; ++i) {
			var fieldsStrings = entries[i].split('\n');
			var fields = {};
			for (var j = 0; j < fieldsStrings.length; ++j) {
				var kv = fieldsStrings[j].split(': ');
				if (!fields[kv[0]])
					fields[kv[0]] = kv[1];
				else
					fields[kv[0]] += ' / ' + kv[1];
			}

			if (!fields['Type']) continue;
			if (fields['Type'] == 'grandfathered') continue;
			if (fields['Type'] == 'redundant') continue;
			// there is a lang value for every valid lang+extlang combination
			if (fields['Type'] == 'extlang') continue;

			if (!fields['Subtag'] || !fields['Description'])
				throw 'Invalid Format';

			if (!$('#showRareLanguages')[0].hasAttribute('disabled') && fields['Type'] == 'language' && fields['Subtag'].length > 2)
				continue;

			languageTags.push({
				code: fields['Subtag'],
				name: fields['Description'],
				type: fields['Type']
			});
		}
		languageTags.sort(function(a, b) {
			return a.name > b.name ? 1 : a.name == b.name ? 0 : -1;
		});
		var htmls = {};
		for (let i = 0; i < languageTags.length; ++i) {
			if (!htmls[languageTags[i].type])
				htmls[languageTags[i].type] = '<option data-code="">None / Default</option>';
			htmls[languageTags[i].type] += '<option data-code="' + languageTags[i].code + '">' + languageTags[i].name + ' (' + languageTags[i].code + ')</option>';
		}
		$('#languageList').html(htmls['language']);
		$('#scriptList').html(htmls['script']);
		$('#regionList').html(htmls['region']);
		$('#variantList').html(htmls['variant']);
		$('#showRareLanguages').on('click', function() {
			$('#showRareLanguages').attr('disabled', 'disabled');
			parseLanguageData(global_languageData);
		});
		completion();
	};
	requestAsync('data/language-subtag-registry', function(lines) {
		global_languageData = lines;
		parseLanguageData(lines);
	});
}