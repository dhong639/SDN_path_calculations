/*
*	store currently available nodes
*		done once upon load, then never again
*	contents used to fill out select elements
*		list_text is the visually displayed text
*		list_value is the actual path (not displayed)
*/
var dict_optionEdge = [
	{
		type: 'server',
		list_value: [],
		list_text: []
	},
	{
		type: 'serverAdj',
		list_value: [],
		list_text: []
	},
	{
		type: 'edgeAdj',
		list_value: [],
		list_text: []
	},
	{
		type: 'med',
		list_value: [],
		list_text: []
	}
]
/*
*	store currently available paths
*		paths are recalculated when topology changes
*	contents used to fill out select elements
*		list_text is the visually displayed text
*		list_value is the actual path (not displayed)
*/
var dict_optionPath = [
	{
		type: 'active',
		list_value: [],
		list_text: []
	},
	{
		type: 'standby',
		list_value: [],
		list_text: []
	}
]