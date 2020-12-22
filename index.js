import './main.scss';
import * as d3 from "d3";

const data = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const width = 800
const height = 400
const padding = 50

d3.json(data).then( ( data ) => {
  const yAxisScale = d3.scaleLinear().domain([ 0, 18064.7 ]).range([ height - padding, 0 ])  
  const xAxisScale = d3.scaleTime().domain([ 1947, 2016 ]).range([ 0, width - padding * 2 ])   

  const svgContainer = d3.select('#root').append('svg')
    .attr('width', width) 
    .attr('height', height)

    svgContainer.append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ',' + (padding / 2) + ')') 
      .call( d3.axisLeft( yAxisScale ))

    svgContainer.append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(' + padding + ',' + ( height - 25 ) +')')
      .call( d3.axisBottom( xAxisScale ).tickFormat( d3.format('d')) )

    svgContainer.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -200)
      .attr('y', 80)
      .text('Gross Domestic Product');
  
  const tooltip = d3.select('#graph').append('div').attr('id', 'tooltip')

  const chart = svgContainer.append('g')
    .attr('transform', 'translate(' + padding + ',' + ( padding / 2 ) + ')')
    .selectAll('rect')
    .data( data.data )
    .enter()
    .append('rect')
    .attr('data-date', d => d[0]) 
    .attr('data-gdp', d => d[1])
    .attr('class', 'bar')
    .attr('width', width / data.data.length)
    .attr('height', d => height - padding - yAxisScale(d[1]))
    .attr('fill', '#031926')
    .attr('y', d =>  yAxisScale( d[1] ))
    .attr('x', ( d, i ) => i * ( width - 100 ) / data.data.length)
    .on('mouseover', ( event, d ) => {
      tooltip
        .style('display', 'flex')
        .style('left', ( event.pageX + 50 ) + 'px')
        .style('top', ( event.pageY - 150 ) + 'px')
        .attr('data-date', d[0])
        .html(d[0] + '<br/>' + '$ ' + d[1] + ' Billions')
    })
    .on('mouseout', () => {
      tooltip.style('display', 'none')
    })
})