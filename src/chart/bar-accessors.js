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
    return function module() {

        // Attributes that will be configurable from the outside
        var publicAttributes = {
            margin: {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            width: 960,
            height: 500,
            gap: 2
        };

        // Private variables that will be used when building the chart
        var data,
            chartWidth, chartHeight,
            xScale, yScale,
            xAxis, yAxis,
            svg,
            // extractors
            getLetter = function(d) { return d.letter; },
            getFrequency = function(d) { return d.frequency; };

        /**
         * This function creates the graph using the selection as container
         * @param  {D3Selection} _selection A d3 selection that represents
         * the container(s) where the chart(s) will be rendered
         */
        function chart(_selection){
            /* @param {object} _data The data to attach and generate the chart */
            _selection.each(function(_data){
                chartWidth = chart.width() - chart.margin().left - chart.margin().right;
                chartHeight = chart.height() - chart.margin().top - chart.margin().bottom;
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
                    transform: 'translate(' + chart.margin().left + ',' + chart.margin().top + ')'
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
                width: chart.width() + chart.margin().left + chart.margin().right,
                height: chart.height() + chart.margin().top + chart.margin().bottom
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
            var gapSize = xScale.rangeBand() / 100 * chart.gap(),
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
         * Create an accessor function for the given attribute
         * @param  {string} attr Public Attribute name
         * @return {func}      Accessor function
         */
        function generateAccessor(attr) {
            /**
             * Gets or Sets the public attribute of the chart
             * @param  {object} value Attribute object to get/set
             * @return { attr | chart} Current attribute value or Chart module to chain calls
             */
            function accessor(value) {
                if (!arguments.length) { return publicAttributes[attr]; }
                publicAttributes[attr] = value;
                return chart;
            }
            return accessor;
        }

        /**
         * Generate accessors for each element in attributes
         * We are going to check if it's an own property and if the accessor
         * wasn't already created
         */
        for (var attr in publicAttributes) {
            if ((!chart[attr]) && (publicAttributes.hasOwnProperty(attr))) {
                chart[attr] = generateAccessor(attr);
            }
        }

        return chart;
    };

});
