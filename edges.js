/*
*	naming convention
*		S = server
*		E = endpoint
*		s = server adjacent
*		e = endpoint adjacent
*		n = other
*	each edge is a list containing three elements:
*		index 0:	source node name
*		index 1:	targe tnode name
*		index 2:	weight
*/
var edges = [
	['S', 's-1', 9],
	['S', 's-2', 9],
	['S', 'se-1', 9],
	['s-1', 'n-2', 2],
	['s-1', 'n-3', 4],
	['s-1', 's-2', 8],
	['s-1', 'se-1', 1],
	['s-2', 'n-2', 8],
	['s-2', 'n-5', 4],	
	['se-1', 'n-3', 6],
	['se-1', 'E-3', 9],
	['n-1', 'n-4', 5],
	['n-1', 'n-5', 2],
	['n-1', 'e-4', 3],
	['n-1', 'e-5', 4],
	['n-2', 'n-5', 3],
	['n-2', 'n-6', 1],
	['n-3', 'e-3', 4],
	['n-4', 'e-1', 2],
	['n-4', 'e-6', 3],
	['n-5', 'e-4', 7],
	['n-6', 'e-1', 5],
	['n-6', 'e-3', 7],
	['e-1', 'e-2', 2],
	['e-1', 'E-4', 9],
	['e-2', 'E-4', 9],
	['e-3', 'E-4', 9],
	['e-4', 'e-5', 4],
	['e-4', 'E-1', 9],
	['e-5', 'e-6', 1],
	['e-5', 'E-1', 9],
	['e-5', 'E-2', 9],
	['e-6', 'E-2', 9]
]
/*
*	store all removed edges
*		edges actually still exist, they just won't be displayed
*		can be restored via options
*/
var removed_edges = new Set()