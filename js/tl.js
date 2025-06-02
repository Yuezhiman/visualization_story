function renderTimeline() {
  const timelineDiv = document.getElementById("timeline");
  timelineDiv.innerHTML = ""; // 清空旧图
  timelineDiv.style.overflowX = "auto";

  const svgWidth = 2000;
  const svgHeight = 200;

  const timeline = d3.select(timelineDiv).append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  const x = d3.scaleTime()
    .domain([
      d3.min(events, d => d.start),
      d3.max(events, d => d.end)
    ])
    .range([60, svgWidth - 60]);

  const area = d3.area()
    .x(d => x(d.start))
    .y0(svgHeight)
    .y1(d => svgHeight - (d.peak || 0) * 100)
    .curve(d3.curveMonotoneX); // 使用平滑曲线
    // 使用曲线插值使山峰更平滑

  // 渐变色定义
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

  // 山峰区域图
  timeline.append("path")
    .datum(events)
    .attr("class", "mountain")
    .attr("d", area)
    .attr("fill", "url(#mountain-gradient)");

  // 时间轴
  timeline.append("g")
    .attr("transform", "translate(0,180)")
    .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat("%Y")));

  // 时间段横条
  timeline.selectAll(".duration-bar")
    .data(events)
    .enter()
    .append("rect")
    .attr("class", "duration-bar")
    .attr("x", d => x(d.start))
    .attr("y", 150)
    .attr("height", 4)
    .attr("width", d => Math.max(2, x(d.end) - x(d.start)))
    .attr("fill", "#aaa")
    .on("click", (e, d) => showEvent(d));
  // 🏀 事件图标及标签（用箭头指向）
  const markers = timeline.selectAll(".event-marker")
    .data(events)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x(d.start)}, 180)`)
    .on("click", (e, d) => showEvent(d));

  // 🏀 图标（篮球）
  markers.append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("y", 0)
    .text("🏀");



    // 在 timeline svg 内创建一个篮球图标（只一个）
  // ⬆️ 标签文字
  // 原来的 marker.append("text") 
  // 先创建空文本元素，不设置 text()
  const label = markers.append("text")
    .attr("y", (d, i) => i % 2 === 0 ? -45 : -70) // 上下交错
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-family", "sans-serif")
    .attr("fill", "#000");

  // 用 tspan 分行写完整文本
  label.each(function(d) {
    const textLines = d.title.split("："); // 分行
    textLines.forEach((line, i) => {
      d3.select(this).append("tspan")
        .attr("x", 0)
        .attr("dy", i === 0 ? 0 : "1.2em")
        .text(line);
    });
  });

  // const label =markers.append("text")
  //   .attr("y", (d, i) => i % 2 === 0 ? -45 : -70) // 上下交错
  //   .attr("text-anchor", "middle")
  //   .attr("font-size", "12px")
  //   .attr("font-family", "sans-serif")
  //   .attr("fill", "#000")
  //   .text(d => d.title.length > 6 ? d.title.slice(0, 6) + "…" : d.title);
  // markers.each(function(d) {
  //   const text = d.title.split("："); // 分成多行，如：["奥运危机", "形成影响"]
  //   text.forEach((line, i) => {
  //     d3.select(this).append("tspan")
  //       .attr("x", 0)
  //       .attr("dy", i === 0 ? 0 : "1.2em")
  //       .text(line);
  //   });
  // });
  // markers.append("text")
  //   .attr("class", "marker-label")
  //   .attr("text-anchor", "middle")
  //   .attr("font-size", "10px")
  //   .attr("fill", "#000")
  //   .attr("y", -35)
  //   .text(d => d.title.length > 6 ? d.title.slice(0, 6) + "…" : d.title);

  // ⬆️ 箭头线条
  markers.append("line")
    .attr("x1", 0).attr("y1", -28)
    .attr("x2", 0).attr("y2", -5)
    .attr("stroke", "#999")
    .attr("stroke-width", 1);

  // Tooltip 提示（悬停完整标题 + 时间）
  markers.append("title")
    .text(d => `${d.title}：${d3.timeFormat("%Y-%m-%d")(d.start)} - ${d3.timeFormat("%Y-%m-%d")(d.end)}`);

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
