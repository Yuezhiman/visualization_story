function renderTimeline() {
  const timelineDiv = document.getElementById("timeline");
  timelineDiv.innerHTML = ""; // 先清空旧图
  timelineDiv.style.overflowX = "auto";

  const timeline = d3.select(timelineDiv).append("svg")
    .attr("width", 2000)
    .attr("height", 200);

  const x = d3.scaleTime()
    .domain(d3.extent(events, d => d.time))
    .range([60, 1940]);

  const area = d3.area()
    .x(d => x(d.time))
    .y0(200)
    .y1(d => 200 - (d.peak || 0) * 100);

  // 定义渐变色，注意用 timeline 变量
  const defs = timeline.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "mountain-gradient")
    .attr("x1", "0%").attr("x2", "0%")
    .attr("y1", "0%").attr("y2", "100%");

  gradient.selectAll("stop")
    .data([
      { offset: "0%", color: "#80c1ff" },
      { offset: "100%", color: "#ffffff" }
    ])
    .enter()
    .append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

  // 山峰区域，设置渐变填充
  timeline.append("path")
    .datum(events)
    .attr("class", "mountain")
    .attr("d", area)
    .attr("fill", "url(#mountain-gradient)");

  // 时间轴
  timeline.append("g")
    .attr("transform", "translate(0,180)")
    .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat("%Y")));

  // 事件标记
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
    .attr("text-anchor", "middle")
    .attr("font-size", "11px")
    .attr("fill", "#fff")
    .text(d => d.title.length > 5 ? d.title.slice(0, 5) + "…" : d.title);

  markers.append("title")
    .text(d => `${d.title}：${d3.timeFormat("%Y-%m-%d")(d.time)}`);

  // 拖拽滚动逻辑
  let isDragging = false, startX = 0, scrollLeft = 0;

  timelineDiv.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.pageX - timelineDiv.offsetLeft;
    scrollLeft = timelineDiv.scrollLeft;
  });

  timelineDiv.addEventListener("mouseleave", () => isDragging = false);
  timelineDiv.addEventListener("mouseup", () => isDragging = false);
  timelineDiv.addEventListener("mousemove", e => {
    if (!isDragging) return;
    const xPos = e.pageX - timelineDiv.offsetLeft;
    const walk = (xPos - startX) * 1.5;
    timelineDiv.scrollLeft = scrollLeft - walk;
  });
}
