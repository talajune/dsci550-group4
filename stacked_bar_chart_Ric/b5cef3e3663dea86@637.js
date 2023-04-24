import define1 from "./a33468b95d0b15b0@808.js";


function _1(md){return(
md`# Normalized Stacked Bar Chart

This chart shows proportional frequency by age for the TOP 15 Interests on Pixstory`
)}

function _key(Legend,chart){return(
Legend(chart.scales.color, {title: "Age (years)"})
)}

function _chart(StackedBarChart,intages,d3,ages,width){return(
StackedBarChart(intages, {
  x: d => d.frequency,
  y: d => d.interest,
  z: d => d.age,
  yDomain: d3.groupSort(
    intages,
    (D) => D[0].frequency / d3.sum(D, d => d.frequency), // proportion of first age group
    d => d.interest // sort y by x
  ),
  zDomain: ages,
  colors: d3.schemeSpectral[ages.length],
  width
})
)}

function _interests(FileAttachment){return(
FileAttachment("stacked_bar_chart.csv").csv({typed: true})
)}

function _ages(interests){return(
interests.columns.slice(2)
)}

function _intages(ages,interests){return(
ages.flatMap(age => interests.map(d => ({interest: d.Interest, age, frequency: d[age]})))
)}

function _7(howto){return(
howto("StackedBarChart")
)}

function _8(altplot){return(
altplot(`Plot.plot({
  width,
  x: {axis: "top", percent: true},
  color: {scheme: "spectral", domain: ages},
  marks: [
    Plot.barX(stateages, {
      y: "state",
      x: "population",
      fill: "age",
      offset: "expand",
      sort: {y: "x2", reduce: "first", reverse: true}
    }),
    Plot.ruleX([0, 1])
  ]
})`)
)}

function _StackedBarChart(d3){return(
function StackedBarChart(data, {
  x = d => d, // given d in data, returns the (quantitative) x-value
  y = (d, i) => i, // given d in data, returns the (ordinal) y-value
  z = () => true, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  marginTop = 30, // top margin, in pixels
  marginRight = 20, // right margin, in pixels
  marginBottom = 0, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height, // outer height, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yDomain, // array of y-values
  yRange, // [bottom, top]
  yPadding = 0.1, // amount of y-range to reserve to separate bars
  zDomain, // array of z-values
  offset = d3.stackOffsetExpand, // stack offset method
  order = d3.stackOrderNone, // stack order method
  xFormat = "%", // a format specifier string for the x-axis
  xLabel, // a label for the x-axis
  colors = d3.schemeTableau10, // array of colors
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);

  // Compute default y- and z-domains, and unique them.
  if (yDomain === undefined) yDomain = Y;
  if (zDomain === undefined) zDomain = Z;
  yDomain = new d3.InternSet(yDomain);
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the y- and z-domains.
  const I = d3.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));

  // If the height is not specified, derive it from the y-domain.
  if (height === undefined) height = yDomain.size * 25 + marginTop + marginBottom;
  if (yRange === undefined) yRange = [height - marginBottom, marginTop];

  // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
  // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
  // each tuple has an i (index) property so that we can refer back to the
  // original data point (data[i]). This code assumes that there is only one
  // data point for a given unique y- and z-value.
  const series = d3.stack()
      .keys(zDomain)
      .value(([, I], z) => X[I.get(z)])
      .order(order)
      .offset(offset)
    (d3.rollup(I, ([i]) => i, i => Y[i], i => Z[i]))
    .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));

  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (xDomain === undefined) xDomain = d3.extent(series.flat(2));

  // Construct scales, axes, and formats.
  const xScale = xType(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange).paddingInner(yPadding);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

  // Compute titles.
  if (title === undefined) {
    title = i => `${Y[i]}\n${Z[i]}\n${X[i].toLocaleString()}`;
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }
  
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const bar = svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
      .attr("fill", ([{i}]) => color(Z[i]))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
      .attr("x", ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
      .attr("y", ({i}) => yScale(Y[i]))
      .attr("width", ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
      .attr("height", yScale.bandwidth());

  if (title) bar.append("title")
      .text(({i}) => title(i));

  svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(xAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", width - marginRight)
          .attr("y", -22)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(xLabel));

  svg.append("g")
      .attr("transform", `translate(${xScale(0)},0)`)
      .call(yAxis);

  return Object.assign(svg.node(), {scales: {color}});
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["stacked_bar_chart.csv", {url: new URL("./files/c10cc705ead75335ec1934bbb01a1c55940c29710778ba170c37224735e22c2b41c7b65c3014bbd2340dc46f2722fdaf54846f60cadc8eb913225ac601aae294.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("key")).define("key", ["Legend","chart"], _key);
  main.variable(observer("chart")).define("chart", ["StackedBarChart","intages","d3","ages","width"], _chart);
  
  main.variable(observer("interests")).define("interests", ["FileAttachment"], _interests);
  main.variable(observer("ages")).define("ages", ["interests"], _ages);
  main.variable(observer("intages")).define("intages", ["ages","interests"], _intages);
  
  
  main.variable(observer("StackedBarChart")).define("StackedBarChart", ["d3"], _StackedBarChart);
  const child1 = runtime.module(define1);
  main.import("Legend", child1);
  main.import("Swatches", child1);

  return main;
}
