define(function(require){
    'use strict';

    var d3 = require('d3');

    /**
     * @typdef D3Selection
     * @type Array[]
     */

    /**
     * @fileOverview Bar Chart reusable API class that renders a
     * simple and configurable bar chart.
     *
     * @exports chart/bar
     * @requires d3
     */
    return function module(){

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            gap = 2,
            data,
            chartWidth, chartHeight,
            xScale, yScale,
            xAxis, yAxis,
            svg,
            // extractors
            getLetter = function(d) { return d.letter; },
            getFrequency = function(d) { return d.frequency; };

        var publicAttributes = {
            width: 960,
            height: 500
        };

        /**
         * This function creates the graph using the selection as container
         * @param  {D3Selection} _selection A d3 selection that represents
         * the container(s) where the chart(s) will be rendered
         */
        function chart(_selection){
            /* @param {object} _data The data to attach and generate the chart */
            _selection.each(function(_data){
                chartWidth = chart.width() - margin.left - margin.right;
                chartHeight = chart.height() - margin.top - margin.bottom;
                data = _data;

                buildScales();
                buildAxis();
                buildSVG(this);
                drawBars();
                drawAxis();
            });
        }

        /**
         * Creates the d3 x and y axis, setting orientations
         * @private
         */
        function buildAxis(){
            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .ticks(10, '%');
        }

        /**
         * Builds containers for the chart, the axis and a wrapper for all of them
         * Also applies the Margin convention
         * @private
         */
        function buildContainerGroups(){
            var container = svg.append('g')
                .classed('container-group', true)
                .attr({
                    transform: 'translate(' + margin.left + ',' + margin.top + ')'
                });

            container.append('g').classed('chart-group', true);
            container.append('g').classed('x-axis-group axis', true);
            container.append('g').classed('y-axis-group axis', true);
        }

        /**
         * Creates the x and y scales of the graph
         * @private
         */
        function buildScales(){
            xScale = d3.scale.ordinal()
                .domain(data.map(getLetter))
                .rangeRoundBands([0, chartWidth], 0.1);

            yScale = d3.scale.linear()
                .domain([0, d3.max(data, getFrequency)])
                .range([chartHeight, 0]);
      }

        /**
         * @param  {HTMLElement} container DOM element that will work as the container of the graph
         * @private
         */
        function buildSVG(container){
            if (!svg) {
                svg = d3.select(container)
                    .append('svg')
                    .classed('bar-chart', true);

                buildContainerGroups();
            }
            svg.transition().attr({
                width: chart.width() + margin.left + margin.right,
                height: chart.height() + margin.top + margin.bottom
            });
        }

        /**
         * @description
         * Draws the x and y axis on the svg object within their
         * respective groups
         * @private
         */
        function drawAxis(){
            svg.select('.x-axis-group.axis')
                .attr('transform', 'translate(0,' + chartHeight + ')')
                .call(xAxis);

            svg.select('.y-axis-group.axis')
                .call(yAxis);
        }

        /**
         * Draws the bar elements within the chart group
         * @private
         */
        function drawBars(){
            var gapSize = xScale.rangeBand() / 100 * gap,
                barW = xScale.rangeBand() - gapSize,
                bars = svg.select('.chart-group').selectAll('.bar').data(data);

            // Enter
            bars.enter()
                .append('rect')
                .classed('bar', true)
                .attr({
                    width: barW,
                    x: chartWidth, // Initially drawing the bars at the end of Y axis
                    y: function(d) { return yScale(d.frequency); },
                    height: function(d) { return chartHeight - yScale(d.frequency); }
                });

            // Update
            bars
                .attr({
                    width: barW,
                    x: function(d) { return xScale(d.letter) + gapSize/2; },
                    y: function(d) { return yScale(d.frequency); },
                    height: function(d) { return chartHeight - yScale(d.frequency); }
                });

            // Exit
            bars.exit()
                .style({ opacity: 0 }).remove();
        }

        /**
         * Gets or Sets the margin of the chart
         * @param  {object} _x Margin object to get/set
         * @return { margin | module} Current margin or Bar Chart module to chain calls
         * @public
         */
        chart.margin = function(_x) {
            if (!arguments.length) return margin;
            margin = _x;
            return this;
        };

        function generateAttrAccessor(attr) {
            return function(_x) {
                if (!arguments.length) return publicAttributes[attr];
                publicAttributes[attr] = _x;
                return this;
            };
        }

        for (var attr in publicAttributes) {
            if( publicAttributes.hasOwnProperty(attr) && !chart[attr]) {
                chart[attr] = generateAttrAccessor(attr);
            }
        }

        return chart;
    };

});
