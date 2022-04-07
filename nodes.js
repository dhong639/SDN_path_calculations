/*
*	each node contains a type, which is a list of 4 binary digits
*		if the digit is 1, then
*			index 0:	Server
*			index 1:	server-adjacent
*			index 2:	edge adjacent
*			index 3:	Edge
*		if the digits are all zero, the node is only an intermediate node
*		note that nodes can be of multiple types
*			if a node is an intermediary, it can only be an intermediary
*	the id is a name, which exists for identification only
*/
var nodes = {
	'S': {
		id: 'S',
		type: [1, 0, 0, 0]
	},
	's-1': {
		id: 's-1',
		type: [0, 1, 0, 0]
	},
	's-2': {
		id: 's-2',
		type: [0, 1, 0, 0]
	},
	'se-1': {
		id: 'se-1',
		type: [0, 1, 1, 0]
	},
	'n-1': {
		id: 'n-1',
		type: [0, 0, 0, 0]
	},
	'n-2': {
		id: 'n-2',
		type: [0, 0, 0, 0]
	},
	'n-3': {
		id: 'n-3',
		type: [0, 0, 0, 0]
	},
	'n-4': {
		id: 'n-4',
		type: [0, 0, 0, 0]
	},
	'n-5': {
		id: 'n-5',
		type: [0, 0, 0, 0]
	},
	'n-6': {
		id: 'n-6',
		type: [0, 0, 0, 0]
	},
	'e-1': {
		id: 'e-1',
		type: [0, 0, 1, 0]
	},
	'e-2': {
		id: 'e-2',
		type: [0, 0, 1, 0]
	},
	'e-3': {
		id: 'e-3',
		type: [0, 0, 1, 0]
	},
	'e-4': {
		id: 'e-4',
		type: [0, 0, 1, 0]
	},
	'e-5': {
		id: 'e-5',
		type: [0, 0, 1, 0]
	},
	'e-6': {
		id: 'e-6',
		type: [0, 0, 1, 0]
	},
	'E-1': {
		id: 'E-1',
		type: [0, 0, 0, 1]
	},
	'E-2': {
		id: 'E-2',
		type: [0, 0, 0, 1]
	},
	'E-3': {
		id: 'E-3',
		type: [0, 0, 0, 1]
	},
	'E-4': {
		id: 'E-4',
		type: [0, 0, 0, 1]
	},
}