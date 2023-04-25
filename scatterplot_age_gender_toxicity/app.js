/*
// Set up the map projection
const projection = d3.geoMercator()
  .center([0, 20])
  .scale(150)
  .rotate([-180,0]);

// Create an SVG element for the map
const svg = d3.select("body")
  .append("svg")
  .attr("width", 960)
  .attr("height", 600);

// Load the json data
d3.json("geodata.geojson", function(data) {
  // Create a color scale for the toxicity scores
  const colorScale = d3.scaleLinear()
    .domain([0, 0.001])
    .range(["white", "red"]);

  // Append a path element for each feature
  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath().projection(projection))
    .attr("fill", function(d) {
      // Get the average toxicity score for this feature
      const avgToxicity = +d.properties.toxicity;
      // Return the appropriate color based on the toxicity score
      return colorScale(avgToxicity);
    });

  // Add a legend to the map
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20, 20)");

  const legendScale = d3.scaleLinear()
    .domain([0, 0.001])
    .range([0, 200]);

  const legendAxis = d3.axisBottom(legendScale)
    .ticks(5);

  legend.append("g")
    .attr("class", "axis")
    .call(legendAxis);

  legend.append("rect")
    .attr("width", 200)
    .attr("height", 20)
    .style("fill", "url(#gradient)");

  const gradient = legend.append("defs")
    .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "white");

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "red");
});
*/