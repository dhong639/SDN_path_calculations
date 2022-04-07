/*
*	invertColor
*		input:
*			hexTripletColor	string	hexadecimal value of color with the pound sign / octothorpe
*		output:
*			color			string	hexadecimal value of color with the pound sign / octothorpe
*		function:
*			convert color to inverse so selecting a node changes its color
*/
function invertColor(hexTripletColor) {
	var color = hexTripletColor;
	color = color.substring(1);				// remove #
	color = parseInt(color, 16);			// convert to integer
	color = 0xFFFFFF ^ color;				// invert three bytes
	color = color.toString(16);				// convert to hex
	color = ("000000" + color).slice(-6);	// pad with leading zeros
	color = "#" + color;					// prepend #
	return color;
}

/*
*	load_cy
*		input:
*			graph	Graph	nodes and edges with calculated shortest paths
*		function:
*			display graph based on available links and requested path
*/
function load_cy(graph) {
	// determine links on requested path
	var set_pathEdge = new Set()
	// nodes in active path
	var node_active = document.getElementById('show_active').value
	// nodes in standby path
	var node_standby = document.getElementById('show_standby').value
	/*
	*	if there is a valid request for an active path
	*		add the nodes to set_pathEdge
	*		print results to webpage
	*	can only display one path at a time
	*/
	if(node_active != '') {
		var list_path = graph.paths[node_active].active
		if(list_path != null) {
			for(var i = 0; i<list_path.length - 1; i++) {
				set_pathEdge.add(list_path[i] + ' ' + list_path[i+1])
				set_pathEdge.add(list_path[i+1] + ' ' + list_path[i])
			}
		}
		var weight = graph.get_pathWeight(graph.paths[node_active].active)
		var text = node_active + ' to ' + graph.server + '<br />active (weight ' + weight + ')'
		document.getElementById('display_pathText').innerHTML = text
		var value = list_path != null ? list_path.join('→') : 'no path found'
		document.getElementById('display_pathValue').innerHTML = value
	}
	/*
	*	if there is a valid request for a standby path
	*		add the nodes to set_pathEdge
	*		print results to webpage
	*	can only display one path at a time
	*/
	else if(node_standby != '') {
		var list_path = graph.paths[node_standby].standby
		if(list_path != null) {
			for(var i = 0; i<list_path.length - 1; i++) {
				set_pathEdge.add(list_path[i] + ' ' + list_path[i+1])
				set_pathEdge.add(list_path[i+1] + ' ' + list_path[i])
			}
		}
		var weight = graph.get_pathWeight(graph.paths[node_standby].standby)
		var text = node_standby + ' to ' + graph.server + '<br />standby (weight ' + weight + ')'
		var value = list_path != null ? list_path.join('→') : 'no path found'
		document.getElementById('display_pathText').innerHTML = text
		document.getElementById('display_pathValue').innerHTML = value
	}
	/*
	*	if there are no paths to display
	*		remove all printed results
	*/
	else if(node_active == '' && node_standby == '') {
		document.getElementById('display_pathText').innerHTML = ''
		document.getElementById('display_pathValue').innerHTML = ''
	}
	// reset select elements
	document.getElementById("show_standby").selectedIndex = "0";
	document.getElementById("show_active").selectedIndex = "0";

	// generate cytoscape object
	var cy = cytoscape({
		container: document.getElementById('cy'),
		wheelSensitivity: 0.1,
		elements: []
	})

	/*
	*	determine nodes to display
	*	colors dependent on node type
	*/
	var set_nodes = new Set()
	for(var node_id in nodes) {
		var color
		switch(nodes[node_id].type.join('')) {
			case '1000':
				//color = 'DarkRed'
				color = '#8B0000'
				break
			case '0100':
				//color = 'LightCoral'
				color = '#F08080'
				break
			case '0110':
				//color = 'Indigo'
				color = '#4B0082'
				break
			case '0010':
				//color = 'MediumSlateBlue'
				color = '#7B68EE'
				break
			case '0001':
				//color = 'Navy'
				color = '#000080'
				break
			case '0000':
				//color = 'GoldenRod'
				color = '#DAA520'
				break
			default:
				//color = 'Grey'
				color = '#808080'
		}
		// add nodes
		if(!set_nodes.has(node_id)) {
			cy.add({
				data: {
					id: node_id,
					color: color,
					invert_color: invertColor(color)
				}
			})
			set_nodes.add(node_id)
		}
	}

	/*
	*	determine edges to display
	*		based on given path
	*		based on removed links
	*/
	var set_edges = new Set()
	for(var i = 0; i<edges.length; i++) {
		var edge = edges[i]
		var edge_id = edge[0] + ' ' + edge[1]
		var weight = edge[2]
		/*
		*	edges not part of a path are dotted and transparent
		/	edges that are part of a path are solid
		*/
		var line_style = set_pathEdge.has(edge_id) ? 'solid' : 'dotted'
		var line_opacity = line_style == 'solid' ? 1 : 0.5
		/*
		*	assume that edges are only reported once
		*	do not add edges if they have been removed
		*/
		if(!((set_edges).has(edge_id)) && !removed_edges.has(edge_id)) {
			cy.add({
				data: {
					id: edge_id,
					source: edge[0],
					target: edge[1],
					weight: weight,
					line_style: line_style,
					line_opacity: line_opacity
				}
			})
			set_edges.add(edge_id)
		}
	}

	// display graph with css
	cy.style().selector("node").style("label", "data(id)");
	cy.style().selector("node").style("text-valign", "center");
	cy.style().selector("node").style("text-halign", "center");
	cy.style().selector("node").style("color", "white");
	cy.style().selector("node").style("background-color", "data(color)")
	cy.style().selector("edge").style("label", "data(weight)");
	cy.style().selector("edge").style("line-style", "data(line_style)")
	cy.style().selector("edge").style("line-opacity", "data(line_opacity)")
	cy.style().selector(":selected").style("background-color", "data(invert_color)")
	cy.style().selector(":selected").style("color", "black");
	cy.layout({
		name: 'fcose'
	}).run();
}
