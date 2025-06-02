function renderFlowerPlot() {
  const width = 500;
  const height = 500;
  const center = { x: width / 2, y: height / 2 };
  const radius = 120;
  const peakThreshold = 0.6;
  const categoryColor = {
    "职业": "#4CAF50",
    "家庭": "#2196F3",
    "社会责任": "#FFC107",
    "其他": "#9E9E9E"
  };
  const svg = d3.select("#flower-plot")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // 渐变和阴影
  const defs = svg.append("defs");
  Object.entries(categoryColor).forEach(([category, color]) => {
    const gradient = defs.append("radialGradient")
      .attr("id", `grad-${category}`)
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
  // 添加连接线
  // svg.selectAll(".flower-node")
  // .data(all)
  // .enter()
  // .append("circle")
  // .attr("class", "flower-node")
  // .attr("cx", center.x)
  // .attr("cy", center.y)
  // .attr("r", 0)
  // // 使用正确的渐变ID格式替换下面这行
  // .attr("fill", d => `url(#grad-${encodeURIComponent(d.category)})`) // 确保这里的ID与<defs>中的渐变ID相匹配
  // .attr("filter", "url(#drop-shadow)")
  // .transition()
  // .duration(1000)
  // .ease(d3.easeBackOut)
  // // 使用 d3.easeBackOut 使动画更自然
  // .attr("cx", d => d.x)
  // .attr("cy", d => d.y)
  // .attr("r", d => 6 + d.peak * 6) // 根据 peak 动态设置大小
  // .on("end", function() {
  //   d3.select(this)
  //     .on("click", (e, d) => showEvent(d))
  //     .style("cursor", "pointer");
  // });
  svg.selectAll(".flower-node")
    .data(all)
    .enter()
    .append("circle")
    .attr("class", "flower-node")
    .attr("cx", center.x)
    .attr("cy", center.y)
    .attr("r", 0)
    // .attr("fill", d => `url(#gradient-${d.category})`)
    .style("fill", d => categoryColor[d.category] || "#9E9E9E")
    .attr("filter", "url(#drop-shadow)")
    .transition()
    .duration(1000)
    .ease(d3.easeBackOut)
    // 使用 d3.easeBackOut 使动画更自然
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

  Object.entries(categoryColor).forEach(([category, color], i) => {
    const g = legend.append("g")
      .attr("transform", `translate(0, ${i * 22})`);
    g.append("circle")
      .attr("r", 8)
      .attr("fill", `url(#grad-${category})`);
    g.append("text")
      .attr("x", 15)
      .attr("y", 5)
      .text(category)
      .attr("fill", "#333")
      .attr("font-size", "14px");
  });
}