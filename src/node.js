networkMap.Node = new Class({
	Implements: [Options, Events],
	options:{
		graph: null,
		id: null,
		name: null,
		x: null,
		y: null,
		lat: null,
		lng: null,
		weight: null,
		information: {
		},
		data:{
		},
		label: {
			position: 'internal',
			visable: true
			//renderer: 
		},
		renderer: 'rect', //rect, circle, image(url), svg(ulr)
		padding: 10,
		href: null,
		style: null,
		debug: false,
		draggable: false
		//onMove
	},
	exportedOptions: [
		'id',
		'name',
		'x',
		'y',
		'lat',
		'lng',
		'weight',
		'renderer',
		'information',
		'label',
		'padding',
		'href',
		'style'
	],
	initialize: function(options){
		this.graph = options.graph;
		delete options.graph;

		this.setOptions(options);

		if (!this.options.id){
			throw "Node(create, no id given)";
		}
		
		this.options.x = parseFloat(this.options.x);
		this.options.y = parseFloat(this.options.y);
		this.options.padding = parseFloat(this.options.padding); 

		if (this.graph){
			this.draw();
		}

	},
	getConfiguration: function(){
		var configuration = {};

		this.exportedOptions.each(function(option){
			configuration[option] = this.options[option];
		}.bind(this));
		return configuration;
	},
	setGraph: function(graph){	
		// remove the object from the graph
		this.graph = null;
		this.draw();

		// if a graph is defined draw 
		if (graph){
			this.graph = graph;
			this.draw();
		}
	},
	
	x: function(){
		return this.svg.bbox().x;
	},
	
	y: function(){
		return this.svg.bbox().y;
	},
	draggable: function(){
		this.svg.draggable();
		this.svg.style('cursor', 'move');

	},	
	fixed: function(){
		this.svg.fixed();
		this.svg.style('cursor', 'default');
	},
	bbox: function(){
		return this.svg.bbox();
	},
	draw: function(){
		if (this.svg && !this.graph){
			this.svg.remove();
			return false;
		}

		if (!this.graph){
			return false;
		}

		if (this.debug){
			this.debug.remove();
		}
		if (this.options.debug){
			this.debug = this.graph.getSVG().group();
		}

		// create a group object 
		var svg = this.svg = this.graph.getSVG().group();

		// create the label first to get size
		var label = svg.text(this.options.name)
			.font({
				family:   'Helvetica',
				size:     16,
				anchor:   'start',
				leading:  1.2
			})
			.move(this.options.padding, this.options.padding);

		// create the rect
		var bboxLabel = label.bbox();
		var rect = svg.rect(1,1)
			.fill({ color: '#ddd'})
			.stroke({ color: '#000', width: 2 })
			.attr({ 
				rx: 4, 
				ry: 4
			})
			.size(
				bboxLabel.width + this.options.padding * 2, 
				bboxLabel.height + this.options.padding * 2
		);
		label.front();

		// this cover is here there to prevent user from selecting 
		// text in the label
		var cover = rect.clone().fill({opacity: 0}).front();

		// move it in place
		svg.move(this.options.x, this.options.y);
		
	
		
		if (this.options.draggable){
			this.draggable();
		}
		
		svg.dragmove = function(delta, event){
			this.fireEvent('drag', [delta, event]);
		}.bind(this);
		svg.dragstart = function(){
			this.fireEvent('dragstart');
		}.bind(this);
		svg.dragend = function(){
			this.options.x = this.x();
			this.options.y = this.y();
			this.fireEvent('dragend');
		}.bind(this);


		return true;
	}
});

networkMap.Node.renderer = networkMap.Node.renderer || {};

networkMap.registerNodeRenderer = function(name, renderer){
	networkMap.Node.renderer[name] = renderer;
};
networkMap.Node.renderer.rect = function(){};


networkMap.Node.label = networkMap.Node.label || {};
networkMap.Node.label.rederer = networkMap.Node.label.rederer || {};
networkMap.Node.label.rederer.normal = function(){};