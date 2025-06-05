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
   console.log("Events with peak values:", events.map(e => ({title: e.title, peak: e.peak})));
  // 渐变色定义
  const defs = timeline.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "mountain-gradient-enhanced")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");

  gradient.append("stop").attr("offset", "0%").attr("stop-color", "#aeeaff");
  gradient.append("stop").attr("offset", "50%").attr("stop-color", "#89cfff");
  gradient.append("stop").attr("offset", "100%").attr("stop-color", "#ffffff");

  // 山峰路径增加 stroke 描边
  timeline.append("path")
    .datum(events)
    .attr("class", "mountain")
    .attr("d", area)
    .attr("fill", "url(#mountain-gradient-enhanced)")
    .attr("stroke", "#4aa6ff")
    .attr("stroke-width", 1);

  
    // 时间轴
const xAxis = d3.axisBottom(x)
  .ticks(d3.timeYear.every(1))
  .tickFormat(d3.timeFormat("%Y"));

timeline.append("g")
  .attr("transform", "translate(0,180)")
  .call(xAxis)
  .selectAll("text")
    .style("font-size", "12px")
    .style("fill", "#333")
    .style("font-family", "Arial");

// 刻度线加粗并设置颜色
timeline.selectAll(".tick line")
  .attr("stroke", "#ccc")
  .attr("stroke-width", 1);

// 可选：添加横纵网格线
timeline.selectAll(".tick")
  .append("line")
  .attr("x1", 0)
  .attr("y1", -svgHeight + 20)
  .attr("x2", 0)
  .attr("y2", 0)
  .attr("stroke", "#eee")
  .attr("stroke-width", 1);
  // // 时间轴

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

  const markers = timeline.selectAll(".event-marker")
    .data(events)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x(d.start)}, 180)`)
    .on("click", (e, d) => showEvent(d));

markers
  .on("mouseover", function(e, d) {
    d3.select(this).select("circle").attr("r", 15).attr("fill", "#e0f7ff");
    d3.select(this).select("text").attr("font-size", "20px");
  })
  .on("mouseout", function(e, d) {
    d3.select(this).select("circle").attr("r", 12).attr("fill", "#f9f9f9");
    d3.select(this).select("text").attr("font-size", "16px");
  });

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
  // 播放图标🏀，初始位置在第一个事件
const playhead = timeline.append("text")
  .attr("id", "playhead")
  .attr("text-anchor", "middle")
  .attr("font-size", "24px")
  .attr("x", x(events[0].start))
  .attr("y", 180)
  .text("🏀");

}
