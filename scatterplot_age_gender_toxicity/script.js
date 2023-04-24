// Load the CSV file
d3.csv("pixstory_geo_input.csv").then(function(data) {

  // Define the chart dimensions
  var margin = { top: 20, right: 20, bottom: 70, left: 50 };
  var width = 800 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  // Create the SVG element
  var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define the scales
  var xScale = d3.scaleLinear()
    .domain([10, 90])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return parseFloat(d.toxicity); })])
    .range([height, 0]);

  var colorScale = d3.scaleOrdinal()
    .domain(["male", "female", "others"])
    .range(["blue", "pink", "green"]);

  // Define the axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Draw the x-axis and axis label
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 10)
    .text("Age");

  // Draw the y-axis and axis label
  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Toxicity");

  // Add dots
  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", function(d) { return xScale(parseFloat(d.Age)); })
    .attr("cy", function(d) { return yScale(parseFloat(d.toxicity)); })
    .attr("r", 5)
    .style("fill", function(d) { return colorScale(d.Gender.toLowerCase()); });


// Define the legend
var legend = svg.selectAll(".legend")
    .data(colorScale.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// Add colored squares to legend
legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);

// Add legend text
legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });



});
























// Load the GeoJSON file

/** 
d3.json("geodata.geojson").then(function(data) {
    // Define the chart dimensions
    var margin = { top: 20, right: 20, bottom: 50, left: 50 };
    var width = 800 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
  
    // Create the SVG element
    var svg = d3.select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  

    // Define the scales
    var xScale = d3.scaleLinear()
      .domain([0, d3.max(data.features, function(d) { return parseInt(d.properties.Age); })])
      .range([0, width]);
  
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.features, function(d) { return parseFloat(d.properties.toxicity); })])
      .range([height, 0]);
  
    // Define the axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
  
    // Draw the axes
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .attr("transform", "translate(0, 0)");
  
    // Draw the data points
    svg.selectAll(".data-point")
      .data(data.features)
      .enter().append("circle")
      .attr("class", "data-point")
      .attr("cx", function(d) { return xScale(parseInt(d.properties.Age)); })
      .attr("cy", function(d) { return yScale(parseFloat(d.properties.toxicity)); })
      .attr("r", 4)
      .style("fill", "steelblue");


  });
  
  */
  

  
  




/** 
// Load the GeoJSON file
d3.json("geodata.geojson").then(function(data) {
  
    // Set up the SVG element
    var svg = d3.select("#map"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    
    // Define the projection and path generator
    var projection = d3.geoMercator()
        .fitSize([width, height], data),
        path = d3.geoPath()
        .projection(projection);
    
    // Define the color scale
    var colorScale = d3.scaleQuantize()
        .domain([0, d3.max(data.features, function(d) { return d.properties.Toxicity; })])
        .range(d3.schemeBlues[9]);
    
    // Draw the map
    svg.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", function(d) { return colorScale(d.properties.Toxicity); });
  });
  




*/









/**
d3.json("geoData.geojson").then(function(data) {
    var features = data.features;
    var coordinatesToxicity = {};
  
    features.forEach(function(feature) {
      var coordinates = feature.geometry.coordinates;
      var toxicity = feature.properties.toxicity;
  
      if (toxicity) {
        if (coordinatesToxicity[coordinates]) {
          coordinatesToxicity[coordinates].push(toxicity);
        } else {
          coordinatesToxicity[coordinates] = [toxicity];
        }
      }
    });
  
    var avgToxicity = {};
  
    for (var coordinates in coordinatesToxicity) {
      var toxicityArray = coordinatesToxicity[coordinates];
      var sumToxicity = toxicityArray.reduce(function(acc, val) {
        return acc + parseFloat(val);
      }, 0);
      var avg = sumToxicity / toxicityArray.length;
      avgToxicity[coordinates] = avg;
    }
  
    console.log(avgToxicity);
  });
  
 */