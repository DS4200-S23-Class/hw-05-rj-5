// Declare constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50}


// With a scale function
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right

const FRAME1 = d3.select("#vis1") 
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame"); 

function build_plot(){
	d3.csv("data/scatter-data.csv").then((data) => {

		const X_SCALE = d3.scaleLinear()
							.domain([0, 10])
							.range([0, VIS_WIDTH]); 

		const Y_SCALE = d3.scaleLinear()
							.domain([0, 10])
							.range([VIS_WIDTH, 0]);

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

		function handleMouseover() {
			d3.select(this).style("fill", 'lightsalmon');
		}
	
		function handleMouseleave() {
			d3.select(this).style('fill', 'lightseagreen');
		}

		function handleMouseclick(d) {
			d3.select(this).classed("selected", 
									!d3.select(this).classed("selected"));
			
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

        FRAME1.append("circle")
                    .attr("cx", X_SCALE(parseInt(new_x)) + MARGINS.left)
                    .attr("cy", MARGINS.top + (Y_SCALE(parseInt(new_y))))
                    .attr("r", 8)
                    .attr("class", "point")
					.on('mouseover', handleMouseover)
					.on('mouseleave', handleMouseleave)
					.on('click', handleMouseclick);
    }
    
    const BUTTON = d3.selectAll("button").on("click", addPoint);
	})
}

build_plot();

const FRAME2 = d3.select('#vis2')
		          		.append('svg')
		            		.attr('height', FRAME_HEIGHT)
		            		.attr('width', FRAME_WIDTH)
		            		.attr('class', 'bar-chart');
function bar_plot() {

	d3.csv('data/bar-data.csv').then((data) => {

		const MAX_Y2 = d3.max(data, (d) => {
		    				return parseInt(d.amount)
		    				});

		const scaleX = d3.scaleBand()
							.domain(data.map((d) => {return d.category}))
		  					.range([0, VIS_WIDTH])
		  					.padding(0.2);

		const scaleY = d3.scaleLinear()
		            		.domain([0, MAX_Y2])
		            		.range([VIS_HEIGHT, 0]);

		FRAME2.selectAll('bars')
		      	.data(data)
			    .enter()
			    .append('rect')
			        .attr('x', (d) => {
			          return (scaleX(d.category) + MARGINS.top)})
			        .attr('y', (d) => {
			          return (scaleY(d.amount) + MARGINS.left)})
			        .attr('width', scaleX.bandwidth())
			        .attr('height', (d) => {
			          return (VIS_HEIGHT - scaleY(d.amount))})
			        .attr('class', 'bar');

		FRAME2.append("g")
				.attr('transform', 'translate(' + MARGINS.left + "," + 
						(VIS_HEIGHT + MARGINS.top) + ')')
				.call(d3.axisBottom(scaleX).ticks(10))
						.attr('font-size', "20px");

		FRAME2.append("g")
				.attr('transform', 'translate(' + MARGINS.top + "," + 
						MARGINS.left + ')')
				.call(d3.axisLeft(scaleY).ticks(6))
						.attr('font-size', "20px");

		const TOOLTIP = d3.select('#vis2')
						.append('div')
							.attr('class', 'tooltip')
							.style('opacity', 0);

		function handleMouseover() {
			d3.select(this).style("fill", 'lightsalmon');
			TOOLTIP.style('opacity', 1);

		}
	
		function handleMouseleave() {
			d3.select(this).style('fill', 'lightseagreen');
			TOOLTIP.style('opacity', 0);

		}

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

bar_plot();


