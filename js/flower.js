function renderFlowerPlot() {
  const width = 500;
  const height = 500;
  const center = { x: width / 2, y: height / 2 };
  const radius = 120;

  const svg = d3.select("#flower-plot")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // 渐变和阴影
  const defs = svg.append("defs");

  Object.entries(categoryColor).forEach(([key, color]) => {
    const gradient = defs.append("radialGradient")
      .attr("id", `grad-${key}`)
      .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", d3.color(color).brighter(1));
    gradient.append("stop").attr("offset", "100%").attr("stop-color", color);
  });

  defs.append("filter")
    .attr("id", "drop-shadow")
    .html(`<feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#aaa" />`);

  // 中心圆和标题
  svg.append("circle")
    .attr("cx", center.x)
    .attr("cy", center.y)
    .attr("r", radius)
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "4 2");

  svg.append("text")
    .attr("x", center.x)
    .attr("y", center.y + 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "#666")
    .text("人物生平概览");

  const inside = events.filter(d => d.peak >= peakThreshold);
  const outside = events.filter(d => d.peak < peakThreshold);

  // 坐标计算
  inside.forEach((d, i) => {
    const angle = 2 * Math.PI * i / inside.length;
    d.x = center.x + radius * 0.6 * Math.cos(angle);
    d.y = center.y + radius * 0.6 * Math.sin(angle);
  });

  outside.forEach((d, i) => {
    const angle = 2 * Math.PI * i / outside.length;
    d.x = center.x + radius * 1.4 * Math.cos(angle);
    d.y = center.y + radius * 1.4 * Math.sin(angle);
  });

  const all = [...inside, ...outside];

  // 绽放动画
  svg.selectAll(".flower-node")
    .data(all)
    .enter()
    .append("circle")
    .attr("class", "flower-node")
    .attr("cx", center.x)
    .attr("cy", center.y)
    .attr("r", 0)
    .attr("fill", d => `url(#grad-${d.category})`)
    .attr("filter", "url(#drop-shadow)")
    .transition()
    .duration(1000)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => 6 + d.peak * 6) // 根据 peak 动态设置大小
    .on("end", function() {
      d3.select(this)
        .on("click", (e, d) => showEvent(d))
        .style("cursor", "pointer");
    });

  // 图例
  const legend = svg.append("g")
    .attr("transform", `translate(20, ${height - 100})`);

  Object.entries(categoryColor).forEach(([key, color], i) => {
    const g = legend.append("g")
      .attr("transform", `translate(0, ${i * 22})`);
    g.append("circle")
      .attr("r", 8)
      .attr("fill", `url(#grad-${key})`);
    g.append("text")
      .attr("x", 15)
      .attr("y", 5)
      .text(key)
      .attr("fill", "#333")
      .attr("font-size", "14px");
  });
}