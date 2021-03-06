import * as d3 from 'd3';

const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

// var baseColor = d3.scaleOrdinal(d3.schemeCategory20);
const baseColor = d3.scaleOrdinal(d3.schemeAccent);// TODO an

const simulation = d3.forceSimulation()
    .force(
        'link',
        d3.forceLink()
            .id((d) => {return d.id})
            .distance(({value}) => {return 200 / value})
            .strength(0.1)
    )
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

export default function process(graph, color = baseColor) {
    const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter().append('line')
        .attr('stroke-width', function (d) {
            return Math.sqrt(d.value);
        });

    const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(graph.nodes)
        .enter().append('g')

    const circles = node.append('circle')
        .attr('r', 5)
        .attr('fill', function (d) {
            return color(d.group);
        })
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    const lables = node.append('text')
        .text(function (d) {
            return d.id;
        })
        .attr('x', 6)
        .attr('y', 3);

    node.append('title')
        .text(function (d) {
            return d.id;
        });

    simulation
        .nodes(graph.nodes)
        .on('tick', ticked);

    simulation.force('link')
        .links(graph.links);

    function ticked() {
        link
            .attr('x1', function (d) {
                return d.source.x;
            })
            .attr('y1', function (d) {
                return d.source.y;
            })
            .attr('x2', function (d) {
                return d.target.x;
            })
            .attr('y2', function (d) {
                return d.target.y;
            });

        node
            .attr('transform', function (d) {
                return `translate(${d.x},${d.y})`;
            })
    }
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}