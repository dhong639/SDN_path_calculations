function string_toColor(str) {
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	var colour = '#';
	for (var i = 0; i < 3; i++) {
		var value = (hash >> (i * 8)) & 0xFF;
		colour += ('00' + value.toString(16)).substr(-2);
	}
	return colour;
}

/*console.log(string_toColor('S'))
console.log(string_toColor('e-1'))
console.log(string_toColor('e-2'))
console.log(string_toColor('e-3'))
console.log(string_toColor('e-4'))*/