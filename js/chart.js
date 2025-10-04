// Sample data (replace with actual or load from file)
const unemployment = [
  {rate: 4.5}, {rate: 3.2}, {rate: 5.1}, {rate: 6.7}, {rate: 2.9},
  {rate: 4.9}, {rate: 3.3}, {rate: 5.4}, {rate: 6.1}, {rate: 3.8},
  {rate: 5.0}, {rate: 4.4}, {rate: 6.3}, {rate: 7.2}, {rate: 3.5}
];

function drawChart() {
  const width = 960;
  const height = 500;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  const bins = d3.bin()
      .thresholds(40)
      .value((d) => d.rate)(unemployment);

  const x = d3.scaleLinear()
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .range([height - marginBottom, marginTop]);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  svg.append("g")
      .attr("fill", "steelblue")
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", (d) => x(d.x0) + 1)
      .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => y(0) - y(d.length));

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
      .call((g) => g.append("text")
          .attr("x", width)
          .attr("y", marginBottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text("Unemployment rate (%) →"));

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Frequency (no. of counties)"));

  document.getElementById("chart-container").appendChild(svg.node());
}

drawChart();
