// Declare constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50}

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right


// Frame1: scatter plot
const FRAME1 = d3.select("#vis1") 
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame"); 

function scattor_plot(){
	d3.csv("data/scatter-data.csv").then((data) => {

		// scale functions
		const X_SCALE = d3.scaleLinear()
							.domain([0, 10])
							.range([0, VIS_WIDTH]); 

		const Y_SCALE = d3.scaleLinear()
							.domain([0, 10])
							.range([VIS_WIDTH, 0]);

		// create data points
		FRAME1.selectAll("points")
				.data(data)
				.enter()
				.append("circle")
					.attr('cx', (d) => {
						return (X_SCALE(d.x) + MARGINS.left)
					})
					.attr("cy", (d) => {
						return (Y_SCALE(d.y) + MARGINS.top)
					})
					.attr("r", 8)
					.attr('class', 'point');

		// create x and y axes
		FRAME1.append("g")
				.attr('transform', 'translate(' + MARGINS.left + "," + 
					(VIS_HEIGHT + MARGINS.top) + ')')
				.call(d3.axisBottom(X_SCALE).ticks(10))
					.attr('font-size', "20px");

		FRAME1.append("g")
				.attr('transform', 'translate(' + MARGINS.top + "," + 
					  MARGINS.left + ')')
				.call(d3.axisLeft(Y_SCALE).ticks(10))
					.attr('font-size', "20px");

		// event functions
		// change the colors of points when hovering
		function handleMouseover() {
			d3.select(this).style("fill", 'lightsalmon');
		}
	
		function handleMouseleave() {
			d3.select(this).style('fill', 'lightseagreen');
		}

		// add border and show point coordinates when clicking the point
		function handleMouseclick(d) {
			// add border
			d3.select(this).classed("selected", 
									!d3.select(this).classed("selected"));
			
			// compute back and show the point coords
			let x = Math.round(X_SCALE.invert(this.getAttribute("cx") - MARGINS.left))
			let y = Math.round(Y_SCALE.invert(this.getAttribute("cy") - MARGINS.top))
			d3.select('#selected-point').text
					("Selected point: (" + x + "," + y + ")");
		}

		// add event listeners to the points
		FRAME1.selectAll('.point')
				.on('mouseover', handleMouseover)
				.on('mouseleave', handleMouseleave)
				.on('click', handleMouseclick)
		

	    // function to add point 
	    function addPoint() {

	        let new_x = d3.selectAll("#cx").property('value');
	        let new_y = d3.selectAll("#cy").property('value');

	        // create new point object
	        FRAME1.append("circle")
	                    .attr("cx", X_SCALE(parseInt(new_x)) + MARGINS.left)
	                    .attr("cy", MARGINS.top + (Y_SCALE(parseInt(new_y))))
	                    .attr("r", 8)
	                    .attr("class", "point")
	                    // add event listener to new point
						.on('mouseover', handleMouseover)
						.on('mouseleave', handleMouseleave)
						.on('click', handleMouseclick);
	    }
    	
    	// add event listener to button to add new points
	    const BUTTON = d3.selectAll("button").on("click", addPoint);
	})
}


// Frame2: bar plot
const FRAME2 = d3.select('#vis2')
		          		.append('svg')
		            		.attr('height', FRAME_HEIGHT)
		            		.attr('width', FRAME_WIDTH)
		            		.attr('class', 'bar-chart');

function bar_plot() {
	d3.csv('data/bar-data.csv').then((data) => {

		// scale functions
		const X_SCALE2 = d3.scaleBand()
							.domain(data.map((d) => {return d.category}))
		  					.range([0, VIS_WIDTH])
		  					.padding(0.2);

		const Y_SCALE2 = d3.scaleLinear()
		            		.domain([0, 100])
		            		.range([VIS_HEIGHT, 0]);

		// create bar rectangles
		FRAME2.selectAll('bars')
		      	.data(data)
			    .enter()
			    .append('rect')
			        .attr('x', (d) => {
			          return (X_SCALE2(d.category) + MARGINS.top)})
			        .attr('y', (d) => {
			          return (Y_SCALE2(d.amount) + MARGINS.left)})
			        .attr('width', X_SCALE2.bandwidth())
			        .attr('height', (d) => {
			          return (VIS_HEIGHT - Y_SCALE2(d.amount))})
			        .attr('class', 'bar');

		// create x and y axes
		FRAME2.append("g")
				.attr('transform', 'translate(' + MARGINS.left + "," + 
						(VIS_HEIGHT + MARGINS.top) + ')')
				.call(d3.axisBottom(X_SCALE2).ticks(10))
						.attr('font-size', "20px");

		FRAME2.append("g")
				.attr('transform', 'translate(' + MARGINS.top + "," + 
						MARGINS.left + ')')
				.call(d3.axisLeft(Y_SCALE2).ticks(10))
						.attr('font-size', "20px");

		// add tooltip object
		const TOOLTIP = d3.select('#vis2')
						.append('div')
							.attr('class', 'tooltip')
							.style('opacity', 0);

		// event functions
		// mouseover
		function handleMouseover() {
			d3.select(this).style("fill", 'lightsalmon');
			TOOLTIP.style('opacity', 1);
		}
		// mouseleave
		function handleMouseleave() {
			d3.select(this).style('fill', 'lightseagreen');
			TOOLTIP.style('opacity', 0);
		}
		// mousemove
		function handleMousemove(event, d) {
			TOOLTIP.html('Category: ' + d.category + '<br>Value: ' + d.amount)
					.style('left', (event.pageX + 10) + 'px')
					.style('top', (event.pageY - 50) + 'px');
		}

		// add event listeners to the points
		FRAME2.selectAll('.bar')
				.on('mouseover', handleMouseover)
				.on('mouseleave', handleMouseleave)
				.on('mousemove', handleMousemove)
	})
}

// call two functions
scattor_plot();
bar_plot();


