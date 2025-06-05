function renderFlowerPlot() {
  const width = 500;
  const height = 500;
  const center = { x: width / 2, y: height / 2 };
  const radius = 120;
  const peakThreshold = 0.6;
  const categoryColor = {
    "职业": "#4CAF50",
    // "家庭": "#2196F3",
    "社会责任": "#FFC107",
    "其他": "#9E9E9E"
  };

  const svg = d3.select("#flower-plot")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // 添加背景圆形
  svg.append("circle")
    .attr("cx", center.x)
    .attr("cy", center.y)
    .attr("r", radius + 60)
    .attr("fill", "rgba(215, 58, 58, 0.03)")
    .attr("stroke", "rgba(142, 225, 41, 0.05)")
    .attr("stroke-width", 1);
    
  // 添加阴影滤镜
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
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%")
    .append("feDropShadow")
    .attr("dx", 0)
    .attr("dy", 2)
    .attr("stdDeviation", 3)
    .attr("flood-color", "rgba(240, 15, 15, 0.5)");
  
  // 添加装饰性圆圈
  for (let i = 0; i < 3; i++) {
    const r = radius + i * 20;
    svg.append("circle")
      .attr("cx", center.x)
      .attr("cy", center.y)
      .attr("r", r)
      .attr("fill", "none")
      .attr("stroke", `rgba(0, 0, 0, ${0.05 - i*0.01})`)
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", i === 0 ? "4 2" : "2 2");
  }
  
  // 中心标题
  svg.append("text")
    .attr("x", center.x)
    .attr("y", center.y - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("fill", "#2c3e50")
    .attr("font-weight", "bold")
    .text("人物生平概览");
    
  svg.append("text")
    .attr("x", center.x)
    .attr("y", center.y + 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("fill", "#rgba(22, 55, 60, 0.72)");
  // a0a0d0

  // 分离内部和外部事件
  const inside = events.filter(d => d.peak >= peakThreshold);
  const outside = events.filter(d => d.peak < peakThreshold);
  
  
  // 计算位置
  inside.forEach((d, i) => {
    const angle = (2 * Math.PI * i / inside.length) - Math.PI/2;
    d.x = center.x + radius * 0.6 * Math.cos(angle);
    d.y = center.y + radius * 0.6 * Math.sin(angle);
  });

  outside.forEach((d, i) => {
    const angle = (2 * Math.PI * i / outside.length) - Math.PI/2;
    d.x = center.x + radius * 1.4 * Math.cos(angle);
    d.y = center.y + radius * 1.4 * Math.sin(angle);
  });

  const all = [...inside, ...outside];

  // 添加连接线
  all.forEach(d => {
    svg.append("line")
      .attr("x1", center.x)
      .attr("y1", center.y)
      .attr("x2", center.x)
      .attr("y2", center.y)
      .attr("stroke", "rgba(0, 0, 0, 0.1)")
      .attr("stroke-width", 1)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("x2", d.x)
      .attr("y2", d.y);
  });

  // 添加事件点 - 使用纯色映射
  const nodes = svg.selectAll(".flower-node")
    .data(all)
    .enter()
    .append("circle")
    .attr("class", "flower-node")
    .attr("cx", center.x)
    .attr("cy", center.y)
    .attr("r", 0)
    // .style("fill", d => categoryColor[d.category] || "#9E9E9E")
    .style("fill", d => `url(#grad-${d.category})`)
    .attr("filter", "url(#drop-shadow)")
    .attr("stroke", "white")
    .attr("stroke-width", 0)
    .on("mouseover", function(event, d) {
      d3.select(this)
        .attr("stroke-width", 2)
        .attr("r", 8 + d.peak * 6);
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .attr("stroke-width", 0)
        .attr("r", 6 + d.peak * 6);
    })
    .on("click", function(event, d) {
      showEvent(d);
    });
  // 动画效果
  nodes.transition()
    .duration(1200)
    .ease(d3.easeElasticOut)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => 6 + d.peak * 6)
    .attr("opacity", 1);
    
svg.selectAll(".flower-label")
    .data(all)
    .enter()
    .append("text")
    .attr("class", "flower-label")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("text-anchor", d => {
      const angle = Math.atan2(d.y - center.y, d.x - center.x);
      return (angle > -Math.PI / 2 && angle < Math.PI / 2) ? "start" : "end";
    })
    .attr("dx", d => {
      const angle = Math.atan2(d.y - center.y, d.x - center.x);
      return (angle > -Math.PI / 2 && angle < Math.PI / 2) ? 12 : -12;
    })
    .attr("dy", "0.35em")
    .attr("font-size", "10px")
    .attr("fill", "rgba(23, 110, 250, 0.8)")
    .each(function(d) {
      const textLines = d.title.split("："); // 按冒号分段
    const self = d3.select(this); // 获取当前text元素
    const anchor = self.attr("text-anchor");
    const dx = parseFloat(self.attr("dx"));

    // 清除旧的 tspans
    self.selectAll("tspan").remove();

    textLines.forEach((line, i) => {
      self.append("tspan")
        .attr("x", () => {
          // 根据text-anchor和dx计算x坐标
          if (anchor === "start") {
            return d.x + dx;
          } else { // end
            return d.x - dx;
          }
        })
        .attr("dy", i === 0 ? "0em" : "1.2em") // 第一行不偏移，后续每行下移
        .text(line);
    });
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
      // .attr("fill","#rgba(227, 37, 138, 0.72)")
      .attr("font-size", "14px");
  });
}