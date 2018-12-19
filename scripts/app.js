let scrollDown = document.querySelector(".scroll-text")
scrollDown.addEventListener("click", () =>
{
    window.window.scrollBy({ 
        top: 1000, 
        behavior: 'smooth' 
      })
})

/** 
 * Discover America
*/

function importData(id){
  d3.json("data/data.json").then(function(data)
  {
    //SVG
    var svg = d3.select("svg")
    var svgContainer = d3.select("#container")
    const margin = 80;
    const width = 430 - 2 * margin
    const height = 430 - 2 * margin

    const chart = svg.append('g')
                      .attr('transform', `translate(${margin}, ${margin})`);

  //création de l'axe x : de 0 à la taille définie avant + on récupère le nom voulu
  const xScale = d3.scaleBand()
    .range([0, width])
    .domain(data[id].map((s) => s.continent))
    .padding(0.6)
  //création de l'axe y : de la hauteur définie à 0 > domain = les valeurs qu'on affiche
  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 250]);

  //   grille verticale
  //   const makeXLines = () => d3.axisBottom()
  //     .scale(xScale)

  //création lignes Y
  const makeYLines = () => d3.axisLeft()
    .scale(yScale)

  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  chart.append('g')
    .call(d3.axisLeft(yScale));

  //   grille verticale
  //   chart.append('g')
  //     .attr('class', 'grid')
  //     .attr('transform', `translate(0, ${height})`)
  //     .call(makeXLines()
  //       .tickSize(-height, 0, 0)
  //       .tickFormat('')
  //     )

  chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
      .tickSize(-width, 0, 0)
      .tickFormat('')
    )

  const barGroups = chart.selectAll()
    .data(data[id])
    .enter()
    .append('g')

  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.continent))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function (actual, i) {
      d3.selectAll('.value')
        .attr('opacity', 0)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('x', (a) => xScale(a.continent) - 5)
        .attr('width', xScale.bandwidth() + 10)

      const y = yScale(actual.value)

      line = chart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', width)
        .attr('y2', y)

      barGroups.append('text')
        .attr('class', 'divergence')
        .attr('x', (a) => xScale(a.continent) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value) + 30)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text((a, idx) => {
          const divergence = (a.value - actual.value).toFixed(1)
          
          let text = ''
          if (divergence > 0) text += '+'
          text += `${divergence}%`

          return idx !== i ? text : '';
        })

    })
    .on('mouseleave', function () {
      d3.selectAll('.value')
        .attr('opacity', 1)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (a) => xScale(a.continent))
        .attr('width', xScale.bandwidth())

      chart.selectAll('#limit').remove()
      chart.selectAll('.divergence').remove()
    })

  barGroups 
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.continent) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value) + 30)
    .attr('text-anchor', 'middle')
    .text((a) => `${a.value}%`)

  svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Millions d\'habitants')

  svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Répartition avant la découverte de l\'Amérique')
  })
}

importData("id1")