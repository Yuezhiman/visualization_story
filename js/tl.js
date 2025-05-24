function renderTimeline() {
  const timeline = d3.select("#timeline").append("svg")
    .attr("width", 2000)
    .attr("height", 200);

  const x = d3.scaleTime()
    .domain(d3.extent(events, d => d.time))
    .range([60, 1940]);

  const area = d3.area()
    .x(d => x(d.time))
    .y0(200)
    .y1(d => 200 - (d.peak || 0) * 100);

  timeline.append("path")
    .datum(events)
    .attr("class", "mountain")
    .attr("d", area);

  timeline.append("g")
    .attr("transform", "translate(0,180)")
    .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat("%Y")));

  const markers = timeline.selectAll(".event-marker")
    .data(events)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x(d.time)},140)`)
    .on("click", (e, d) => showEvent(d));

  markers.append("rect")
    .attr("class", "event-marker")
    .attr("x", -25)
    .attr("y", -25)
    .attr("width", 50)
    .attr("height", 50)
    .attr("rx", 6)
    .attr("ry", 6);

  markers.append("text")
    .attr("class", "marker-label")
    .attr("y", 5)
    .text(d => d.title);

  const timelineDiv = document.getElementById("timeline");
  let isDragging = false, startX = 0, scrollLeft = 0;

  timelineDiv.style.overflowX = "auto";

  timelineDiv.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.pageX - timelineDiv.offsetLeft;
    scrollLeft = timelineDiv.scrollLeft;
  });

  timelineDiv.addEventListener("mouseleave", () => isDragging = false);
  timelineDiv.addEventListener("mouseup", () => isDragging = false);
  timelineDiv.addEventListener("mousemove", e => {
    if (!isDragging) return;
    const x = e.pageX - timelineDiv.offsetLeft;
    const walk = (x - startX) * 1.5;
    timelineDiv.scrollLeft = scrollLeft - walk;
  });
}