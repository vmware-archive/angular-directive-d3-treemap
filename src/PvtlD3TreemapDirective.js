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
                compile: function (jqTemplateElement, attrs) {
                    var valueProperty = attrs.value;
                    if (!valueProperty) {
                        throw new Error('You must specify the value property');
                    }

                    var width = parseInt(attrs.width, 10);
                    var height = parseInt(attrs.height, 10);
                    if (!width || !height) {
                        throw new Error('You must specify both width and height');
                    }

                    var element = jqTemplateElement[0];
                    if (element.children.length !== 1) {
                        throw new Error('You must specify a node template as a single child of the directive element');
                    }
                    var nodeTemplate = element.children[0];
                    element.removeChild(nodeTemplate);
                    var nodeTemplateHtml = nodeTemplate.outerHTML;

                    function link(scope, jqElement) {
                        var element = jqElement[0];
                        var div = d3.select(element)
                            .append("div")
                            .style('position', 'relative');

                        var treemap = d3.layout.treemap()
                            .size([width, height])
                            .value(function (d) {
                                return d[valueProperty];
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

                    return {
                        post: link
                    };
                }
            };
        });

}(angular, d3));
