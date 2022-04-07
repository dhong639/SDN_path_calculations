function remove_link() {
	dict_optionEdge.forEach(option => {
		var value = document.getElementById('rm_' + option.type).value
		var link = value.split(' ').slice(0, 2)
		var link_id = link.join(' ')
		if(link_id != '' && !removed_edges.has(link_id)) {
			removed_edges.add(link_id)
			graph.remove_edge(link[0], link[1])
		}
	})
	load_cy()
}

function insert_link() {
	dict_optionEdge.forEach(option => {
		var value = document.getElementById('ins_' + option.type).value
		var link = value.split(' ')
		var link_id = link.slice(0, 2).join(' ')
		//value = value.split(' ').slice(0, 2).join(' ')
		if(link_id != '' && removed_edges.has(link_id)) {
			removed_edges.delete(link_id)
			graph.add_edge(link[0], link[1], parseInt(link[2]))
		}
	})
	load_cy()
}

function reset_select(select_id) {
	dict_optionEdge.forEach(option => {
		var remove = 'rm_' + option.type
		if(remove != select_id) {
			document.getElementById(remove).selectedIndex = "0"
		}
		var insert = 'ins_' + option.type
		if(insert != select_id) {
			document.getElementById(insert).selectedIndex = "0"
		}
	})
}