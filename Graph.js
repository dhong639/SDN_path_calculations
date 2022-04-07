class Graph {
	/*
	*	constructor
	*		input:
	*			nodes	dict	dictionary of nodes, keyed by id, contains name and type
	*			edges	list	list of edges, each edge is a source, target, and weight
	*/
	constructor(nodes, edges) {
		/*
		*	add edges to Graph
		*	assume edges are bidirectional
		*/
		this.edges = {}
		this.weights = {}
		edges.forEach(edge => {
			this.helper_add_edge(edge[0], edge[1], edge[2])
		})
		/*
		*	add nodes to Graph
		*	there is only ever one Server
		*/
		this.nodes = nodes
		this.server = null
		for(var node in this.nodes) {
			if(this.nodes[node].type[0] == 1) {
				this.server = node
				break
			}
		}
		/*
		*	calculate paths
		*	always store one active and standby path
		*	path is recalculated if links change
		*/
		this.paths = {}
		for(var node in this.nodes) {
			if(nodes[node].type[3] == 1 && !(node in this.paths)) {
				var path_active = this.get_pathActive(node)
				var set_lowPriority = new Set(path_active.slice(1, path_active.length - 1))
				var path_standby = this.get_pathStandby(node, set_lowPriority)
				this.paths[node] = {
					active: path_active,
					standby: path_standby
				}
			}
		}
	}

	/*
	*	get_totalWeight
	*		output:
	*			totalWeight	int	total weight of every edge in graph
	*		function:
	*			used to disincentivize certain nodes when calculating paths
	*/
	get_totalWeight() {
		var totalWeight = 0
		for(var key in this.weights) {
			totalWeight += this.weights[key]
		}
		return totalWeight
	}

	/*
	*	get_pathWeight
	*		input: 
	*			path	list	path from Edge to Source
	*		output:
	*			weight	int		total weight to traverse path
	*		function:
	*			display current weight of path (infinity if path is not possible)
	*/
	get_pathWeight(path) {
		if(path == null) {
			return Infinity
		}
		else {
			var weight = 0
			for(var i = 0; i<path.length-1; i++) {
				var link = path[i] + ' ' + path[i+1]
				weight += this.weights[link]
			}
			return weight
		}
	}

	/*
	*	remove_edge
	*		input:
	*			node_a	string	source node
	*			node_b	string	target node
	*		function:
	*			remove link from graph
	*			update active and standby paths
	*/
	remove_edge(node_a, node_b) {
		var index_a = this.edges[node_a].indexOf(node_b)
		this.edges[node_a].splice(index_a, 1)
		
		var index_b = this.edges[node_b].indexOf(node_a)
		this.edges[node_b].splice(index_b, 1)

		delete this.weights[node_a + ' ' + node_b]
		delete this.weights[node_b + ' ' + node_a]
		for(var node in this.paths) {
			/*
			*	determine if removing link would break active path
			*		check if link would be used in the active path
			*/
			var is_downActive = false
			var path_active = this.paths[node].active
			for(var i = 0; i<path_active.length-1; i++) {
				var link = path_active[i] + ' ' + path_active[i+1]
				if(node_a + ' ' + node_b == link || node_b + ' ' + node_a == link) {
					is_downActive = true
					break
				}
			}
			/*
			*	determine if removing link would break standby path
			*		check if link would be used in the standby path
			*/
			var is_downStandby = false
			var path_standby = this.paths[node].standby
			for(var i = 0; i<path_standby.length-1; i++) {
				var link = path_standby[i] + ' ' + path_standby[i+1]
				if(node_a + ' ' + node_b == link || node_b + ' ' + node_a == link) {
					is_downStandby = true
					break
				}
			}
			console.log('Affected ' + node + ': active ' + is_downActive + ', standby ' + is_downStandby)
			/*
			*	if removing link would affect active path but not standby path
			*		set standby path as new active path and remove current standby path
			*/
			if(is_downActive == true && is_downStandby == false) {
				this.paths[node].active = Array.from(this.paths[node].standby)
				this.paths[node].standby = null
			}
			/*
			*	if removing link would affect standby path but not active path
			*		remove standby path
			*/
			else if(is_downActive == false && is_downStandby == true) {
				this.paths[node].standby = null
			}
			/*
			*	if removing link would affect both active and standby path
			*		remove both paths
			*/
			else if(is_downActive == true && is_downStandby == true) {
				this.paths[node].active = null
				this.paths[node].standby = null
			}

			// determine if both paths are still available
			var has_active = this.paths[node].active != null
			var has_standby = this.paths[node].standby != null
			console.log('Removed ' + node + ': active ' + has_active + ', standby ' + has_standby)
			/*
			*	if active path is no longer available
			*		calculate new active path
			*	only happens if both paths are affected by link removal
			*/
			if(!has_active) {
				var path_active = this.get_pathActive(node)
				this.paths[node].active = path_active
			}
			/*
			*	if standby path is no longer available
			*		get list of links used on active path
			*		create new standby path that tries to not use those links
			*/
			if(!has_standby) {
				var path_active = this.paths[node].active
				var set_lowPriority = new Set()
				if(path_active != null) {
					set_lowPriority = new Set(path_active.slice(1, path_active.length - 1))
				}
				var path_standby = this.get_pathStandby(node, set_lowPriority)
				this.paths[node].standby = path_standby
			}
		}
	}

	/*
	*	add_edge
	*		input:
	*			from_node	string	starting point of edge
	*			to_node		string	ending point of edge
	*			weight		string	how long it takes to traverse link
	*		function:
	*			add edge to graph
	*			calculate new active path if applicable
	*/
	add_edge(from_node, to_node, weight) {
		this.helper_add_edge(from_node, to_node, weight)
		for(var node in this.paths) {
			var path_active = this.get_pathActive(node)
			/*
			*	if adding this edge creates a faster path than the current active path
			*	replace the current active path
			*/
			if(this.get_pathWeight(path_active) < this.get_pathWeight(this.paths[node].active)) {
				this.paths[node].active = path_active
			}
			/*
			*	if adding this edge creates a faster path than the current standby path
			*	replace the current standby path
			*	note that the standby path cannot use nodes on the active path
			*/
			var set_lowPriority = new Set(path_active.slice(1, path_active.length - 1))
			var path_standby = this.get_pathStandby(node, set_lowPriority)
			if(this.get_pathWeight(path_standby) < this.get_pathWeight(this.paths[node].standby)) {
				this.paths[node].standby = path_standby
			}
		}
	}

	/*
	*	helper_add_edge
	*		input:
	*			from_node	string	starting point of edge
	*			to_node		string	ending point of edge
	*			weight		string	how long it takes to traverse link
	*		function: 
	*			add new links to graph bidirectionally
	*/
	helper_add_edge(from_node, to_node, weight) {
		if(!(from_node in this.edges)) {
			this.edges[from_node] = []
		}
		this.edges[from_node].push(to_node)
		if(!(to_node in this.edges)) {
			this.edges[to_node] = []
		}
		this.edges[to_node].push(from_node)

		this.weights[from_node + ' ' + to_node] = weight
		this.weights[to_node + ' ' + from_node] = weight
	}

	/*
	*	get_pathActive
	*		input:
	*			endpoint	string	node that's not a Server
	*		output:
	*						list	path to server
	*		function
	*			get the fastest possible path from some node to the Server
	*/
	get_pathActive(endpoint) {
		return this.helper_dijkstra(endpoint, this.server)
	}

	/*
	*	get_pathStandby
	*		input:
	*			endpoint	string	node that's not a Server
	*		output:
	*						list	path to server
	*		function
	*			get the fastest possible path from some node to the Server
	*			using as few links from the active path as possible
	*/
	get_pathStandby(endpoint, pathActive) {
		return this.helper_dijkstra(endpoint, this.server, pathActive)
	}

	/*
	*	helper_dijkstra
	*		input:
	*			initial				string	starting node
	*			end					string	ending node
	*			set_lowPriority		set		nodes to avoid using
	*		output:
	*			path				list	nodes between start and end in order
	*		function: 
	*			standard shortest path algorithm with the following changes
	*				includes a third input named set_lowPriority
	*				when determining weights to the next node
	*					check if the next node is included in set_lowPriority
	*					if it is, increase the weight of that node by total weight of whole graph
	*					this heavily encourages function to not pick that node for the path
	*					if there's no choice, that node can still be picked
	*				allows for calculation of a standby path separate from active path
	*					standby path is path that can be used when active path goes down
	*/
	helper_dijkstra(initial, end, set_lowPriority = new Set()) {
		var shortest_paths = {}
		shortest_paths[initial] = [null, 0]
		var current_node = initial
		var visited = new Set()
		
		while(current_node != end) {
			visited.add(current_node)
			var destinations = this.edges[current_node]
			var weight_to_current_node = shortest_paths[current_node][1]
	
			destinations.forEach(next_node => {
				var weight = this.weights[current_node + ' ' + next_node] + weight_to_current_node
				if(set_lowPriority.has(next_node)) {
					weight += this.get_totalWeight()
					if(this.nodes[next_node].type[2] == 1) {
						weight *= 2
					}
				}
				if(!(next_node in shortest_paths)) {
					shortest_paths[next_node] = [current_node, weight]
				}
				else {
					var current_shortest_weight = shortest_paths[next_node][1]
					if(current_shortest_weight > weight) {
						shortest_paths[next_node] = [current_node, weight]
					} 
				}
			});
	
			var next_destinations = {}
			for(var node in shortest_paths) {
				if(!visited.has(node)) {
					next_destinations[node] = shortest_paths[node]
				}
			}
			if(Object.keys(next_destinations).length == 0) {
				return null
			}
			var lowest_weight = Number.MAX_SAFE_INTEGER
			for(var key in next_destinations) {
				var node = next_destinations[key]
				var weight = node[1]
				if(weight < lowest_weight) {
					lowest_weight = weight
					current_node = key
				}
			}
		}
		var path = []
		while(current_node != null) {
			var next_node = shortest_paths[current_node][0]
			path.push(current_node)
			current_node = next_node
		}
		path = path.reverse()
		return path
	}
}