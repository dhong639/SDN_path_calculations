/*
*	addOption
*		input:
*			select_id	string	id of select element
*			list_value	list	list of strings, items stored in option
*			list_text	list	list of strings, items displayed by option
*		function:
*			for given input lists, fill out options in select elements
*/
function addOption(select_id, list_value, list_text) {
	var element = document.getElementById(select_id)
	for(var i = 0; i<list_value.length; i++) {
		var option = document.createElement('option')
		option.text = list_text[i]
		option.value = list_value[i]
		element.append(option)
	}
}
