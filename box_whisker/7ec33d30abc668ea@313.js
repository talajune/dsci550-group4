import define1 from "./7a9e12f9fb3d8e06@498.js";

function _1(md){return(
md`# Box Plot of Male Identity Attack Scores, by Age

A box-and-whisker plot shows summary statistics of the score of identity attacks in the narrative and title of Pixstory posts for males, broken down by age.`
)}

function _chart(BoxPlot,score,width){return(
BoxPlot(score, {
  x: d => d.Age,
  y: d => d.identity_attack,
  xLabel: "Identity Attack Score →",
  yLabel: "↑ Age",
  width,
  height: 500
})
)}

function _score(FileAttachment){return(
FileAttachment("box.csv").csv({typed: true})
)}

function _BoxPlot(d3){return(
function BoxPlot(data, {
  x = ([x]) => x, // given d in data, returns the (quantitative) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  inset = 0.5, // left and right inset
  insetLeft = inset, // inset for left edge of box, in pixels
  insetRight = inset, // inset for right edge of box, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  thresholds = width / 40, // approximative number of thresholds
  stroke = "currentColor", // stroke color of whiskers, median, outliers
  fill = "#ddd", // fill color of boxes
  jitter = 4, // amount of random jitter for outlier dots, in pixels
  xFormat, // a format specifier string for the x-axis
  yFormat, // a format specifier string for the y-axis
  xLabel, // a label for the x-axis
  yLabel // a label for the y-axis
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);

  // Filter undefined values.
  const I = d3.range(X.length).filter(i => !isNaN(X[i]) && !isNaN(Y[i]));

  // Compute the bins.
  const B = d3.bin()
      .thresholds(thresholds)
      .value(i => X[i])
    (I)
    .map(bin => {
      const y = i => Y[i];
      const min = d3.min(bin, y);
      const max = d3.max(bin, y);
      const q1 = d3.quantile(bin, 0.25, y);
      const q2 = d3.quantile(bin, 0.50, y);
      const q3 = d3.quantile(bin, 0.75, y);
      const iqr = q3 - q1; // interquartile range
      const r0 = Math.max(min, q1 - iqr * 1.5);
      const r1 = Math.min(max, q3 + iqr * 1.5);
      bin.quartiles = [q1, q2, q3];
      bin.range = [r0, r1];
      bin.outliers = bin.filter(i => Y[i] < r0 || Y[i] > r1);
      return bin;
    });

  // Compute default domains.
  if (xDomain === undefined) xDomain = [d3.min(B, d => d.x0), d3.max(B, d => d.x1)];
  if (yDomain === undefined) yDomain = [d3.min(B, d => d.range[0]), d3.max(B, d => d.range[1])];

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange).interpolate(d3.interpolateRound);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(thresholds, xFormat).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  const g = svg.append("g")
    .selectAll("g")
    .data(B)
    .join("g");

  g.append("path")
      .attr("stroke", stroke)
      .attr("d", d => `
        M${xScale((d.x0 + d.x1) / 2)},${yScale(d.range[1])}
        V${yScale(d.range[0])}
      `);

  g.append("path")
      .attr("fill", fill)
      .attr("d", d => `
        M${xScale(d.x0) + insetLeft},${yScale(d.quartiles[2])}
        H${xScale(d.x1) - insetRight}
        V${yScale(d.quartiles[0])}
        H${xScale(d.x0) + insetLeft}
        Z
      `);

  g.append("path")
      .attr("stroke", stroke)
      .attr("stroke-width", 2)
      .attr("d", d => `
        M${xScale(d.x0) + insetLeft},${yScale(d.quartiles[1])}
        H${xScale(d.x1) - insetRight}
      `);

  g.append("g")
      .attr("fill", stroke)
      .attr("fill-opacity", 0.2)
      .attr("stroke", "none")
      .attr("transform", d => `translate(${xScale((d.x0 + d.x1) / 2)},0)`)
    .selectAll("circle")
    .data(d => d.outliers)
    .join("circle")
      .attr("r", 2)
      .attr("cx", () => (Math.random() - 0.5) * jitter)
      .attr("cy", i => yScale(Y[i]));

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)
      .call(g => g.append("text")
          .attr("x", width)
          .attr("y", marginBottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(xLabel));

  return svg.node();
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["box.csv", {url: new URL("./files/d5dfc71c0610290c5f054a044bef61a77b46e4f5b0f232e7c483a5c7b493f374489fa59d88d114bc4d1bc842abb781c701436bb5379213a5e4b5918437354dc3.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["BoxPlot","score","width"], _chart);
  main.variable(observer("score")).define("score", ["FileAttachment"], _score);
  main.variable(observer("BoxPlot")).define("BoxPlot", ["d3"], _BoxPlot);
  const child1 = runtime.module(define1);
  main.import("howto", child1);
  main.import("linkplot", child1);
  return main;
}
