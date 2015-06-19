(function (angular, d3) {
    'use strict';

    angular
        .module('pvtlD3Treemap', [])
        .directive('pvtlD3Treemap', function ($compile) {
            return {
                restrict: 'E',
                scope: {
                    data: '='
                },
                link: function (scope, jqElement, attrs) {
                    var element = jqElement[0];
                    if (element.children.length !== 1) {
                        throw new Error('You must specify a node template as a single child of the directive element');
                    }
                    var nodeTemplate = element.children[0];
                    element.removeChild(nodeTemplate);
                    var nodeTemplateHtml = nodeTemplate.outerHTML;

                    var div = d3.select(element)
                        .append("div")
                        .style('position', 'relative');

                    var width = parseInt(attrs.width, 10);
                    var height = parseInt(attrs.height, 10);
                    var treemap = d3.layout.treemap()
                        .size([width, height])
                        .value(function (d) {
                            return 1;
                        });

                    div.datum(scope.data)
                        .selectAll(".pvtlD3TreemapNode")
                        .data(treemap.nodes)
                        .enter()
                        .append(function (d) {
                            var nodeScope = scope.$new();
                            angular.extend(nodeScope, d);
                            return $compile(angular.element(nodeTemplateHtml))(nodeScope)[0];
                        })
                        //.attr("class", "pvtlD3TreemapNode") // need this to update data correctly
                        .call(position);

                    function position() {
                        this.style({
                            position: 'absolute',
                            left: function (d) {
                                return d.x + "px";
                            },
                            top: function (d) {
                                return d.y + "px";
                            },
                            width: function (d) {
                                return d.dx + "px";
                            },
                            height: function (d) {
                                return d.dy + "px";
                            }
                        });
                    }

                }
            };
        });

}(angular, d3));
