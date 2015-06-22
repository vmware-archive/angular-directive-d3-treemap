describe('PvtlD3TreemapDirective', function () {
    beforeEach(module('pvtlD3Treemap'));

    var $rootScope, $compile;
    var width, height;
    var data;
    var newData;

    function makeDirective(markup) {
        var $scope = $rootScope.$new();
        $scope.populationData = data;

        var link = $compile(markup);
        var pvtlD3Treemap = link($scope)[0];
        $rootScope.$digest();
        return pvtlD3Treemap.children[0];
    }

    function loadData(d3Container) {
        var $scope = angular.element(d3Container.parentNode).scope();
        $scope.populationData = data;

        $rootScope.$digest();
    }

    function children(parent) {
        var collection = parent.children,
            array = [],
            i;
        for (i = 0; i < collection.length; i += 1) {
            array.push(collection[i]);
        }
        return array;
    }

    function styleValue(attribute) {
        return function (el) {
            return el.style[attribute];
        };
    }

    function styleValuePx(attribute) {
        return function (el) {
            return parseInt(styleValue(attribute)(el), 10);
        };
    }

    function tagName(el) {
        return el.tagName;
    }

    function textContent(el) {
        return el.textContent;
    }

    function area(el) {
        return parseInt(el.style.width, 10) * parseInt(el.style.height, 10);
    }

    beforeEach(inject(function (_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;

        width = 1000;
        height = 800;

        data = {
            label: 'United Kingdom',
            population: 63181775,
            children: [
                {
                    label: 'England',
                    population: 53012456
                },
                {
                    label: 'Scotland',
                    population: 5295000
                },
                {
                    label: 'Wales',
                    population: 3063456
                },
                {
                    label: 'Northern Ireland',
                    population: 1810863
                }
            ]
        };
        newData = {
            label: 'United Kingdom',
            population: 63181775,
            children: [
                {
                    label: 'England',
                    population: 44704456
                },
                {
                    label: 'London',
                    population: 8308000
                },
                {
                    label: 'Wales',
                    population: 3063456
                },
                {
                    label: 'Northern Ireland',
                    population: 1810863
                }
            ]
        };
    }));

    describe('with a valid node template', function () {
        var d3Container;

        beforeEach(function () {
            var markup =
                '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="populationData" value="population">' +
                '<pre>{{label}}</pre>' +
                '</pvtl-d3-treemap>';
            d3Container = makeDirective(markup);
        });

        it('creates a d3 div which is positioned relatively', function () {
            expect(d3Container.style.position).toBe('relative');
        });

        it('creates nodes for each data item', function () {
            expect(d3Container.children.length).toBe(data.children.length + 1);
        });

        it('spreads the nodes across the specified height and width', function () {
            var nodeElements = children(d3Container).map(styleValue('position'));
            expect(_.uniq(nodeElements)).toEqual(['absolute']);

            expect(Math.min.apply(null, children(d3Container).map(styleValuePx('top')))).toBe(0);
            expect(Math.min.apply(null, children(d3Container).map(styleValuePx('left')))).toBe(0);

            function computeRight(el) {
                return parseInt(el.style.left, 10) + parseInt(el.style.width, 10);
            }

            expect(Math.max.apply(null, children(d3Container).map(computeRight))).toBe(width);

            function computeBottom(el) {
                return parseInt(el.style.top, 10) + parseInt(el.style.height, 10);
            }

            expect(Math.max.apply(null, children(d3Container).map(computeBottom))).toBe(height);
        });

        it('uses the content of the directive element as a template for the nodes', function () {
            expect(_.uniq(children(d3Container).map(tagName))).toEqual(['PRE']);
            expect(children(d3Container).map(textContent)).toEqual(['United Kingdom', 'England', 'Scotland', 'Wales', 'Northern Ireland']);
        });

        it('sizes the nodes in proportion to their value', function () {
            var areas = children(d3Container).map(area);

            var rootArea = areas.splice(0, 1);
            var totalPopulation = data.population;
            var areaPerPerson = (rootArea / totalPopulation);

            var expectedAreas = data.children.map(function (child) {
                return child.population * areaPerPerson;
            });

            expect(areas[0]).toBeApproximately(expectedAreas[0], 0.01);
            expect(areas[1]).toBeApproximately(expectedAreas[1], 0.01);
            expect(areas[2]).toBeApproximately(expectedAreas[2], 0.01);
            expect(areas[3]).toBeApproximately(expectedAreas[3], 0.01);
        });
    });

    it('resolves directives in the nodes but not in the node template', function () {
        var markup =
            '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="populationData" value="population">' +
            '<div><div ng-if="!children"><pre>{{label}}</pre></div></div>' +
            '</pvtl-d3-treemap>';

        var d3Container = makeDirective(markup);

        expect(children(d3Container).map(textContent)).toEqual(['', 'England', 'Scotland', 'Wales', 'Northern Ireland']);
    });

    describe('with invalid input', function () {
        it('raises an error if there is no width', function () {
            var badMarkup =
                '<pvtl-d3-treemap height="' + height + '" data="populationData" value="population">' +
                '<pre></pre>' +
                '</pvtl-d3-treemap>';

            expect(function () {
                $compile(badMarkup);
            }).toThrow(new Error('You must specify both width and height'));
        });

        it('raises an error if there is no height', function () {
            var badMarkup =
                '<pvtl-d3-treemap width="' + width + '" data="populationData" value="population">' +
                '<pre></pre>' +
                '</pvtl-d3-treemap>';

            expect(function () {
                $compile(badMarkup);
            }).toThrow(new Error('You must specify both width and height'));
        });

        it('raises an error if there is no node template', function () {
            var badMarkup =
                '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="populationData" value="population">' +
                '</pvtl-d3-treemap>';

            expect(function () {
                $compile(badMarkup);
            }).toThrow(new Error('You must specify a node template as a single child of the directive element'));
        });

        it('raises an error if there is a node template with more than one element', function () {
            var badMarkup =
                '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="populationData" value="population">' +
                '<p></p><p></p>' +
                '</pvtl-d3-treemap>';

            expect(function () {
                $compile(badMarkup);
            }).toThrow(new Error('You must specify a node template as a single child of the directive element'));
        });

        it('raises an error if there is no value property', function () {
            var badMarkup =
                '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="populationData">' +
                '<pre></pre>' +
                '</pvtl-d3-treemap>';

            expect(function () {
                $compile(badMarkup);
            }).toThrow(new Error('You must specify the value property'));
        });
    });

    describe('when data is not initially present', function () {
        var d3Container;

        beforeEach(function () {
            var markup =
                '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="populationData" value="population">' +
                '<pre>{{label}}</pre>' +
                '</pvtl-d3-treemap>';

            data = undefined;
            d3Container = makeDirective(markup);
        });

        it('should still create the container element', function () {
            expect(d3Container).toBeTruthy();
            expect(d3Container.children.length).toBe(0);
        });

        it('should create nodes when data arrives', function () {
            data = newData;
            loadData(d3Container);
            expect(children(d3Container).map(textContent)).toEqual(['United Kingdom', 'England', 'London', 'Wales', 'Northern Ireland']);
        });
    });

    describe('when data is refreshed', function () {
        it('updates the existing treemap', function () {
            var markup =
                '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="populationData" value="population">' +
                '<div data-pop="{{population}}">' +
                '<pre>{{label}}</pre>' +
                '</div>' +
                '</pvtl-d3-treemap>';
            var d3Container = makeDirective(markup);

            data = newData;
            loadData(d3Container);

            var actualLabelsSorted = children(d3Container).map(textContent).sort();
            var expectedLabelsSorted = ['United Kingdom', 'England', 'Wales', 'Northern Ireland', 'London'].sort();
            expect(actualLabelsSorted).toEqual(expectedLabelsSorted);

            function dataPop(el) {
                return parseInt(el.attributes['data-pop'].value, 10);
            }

            var actualPopulationSorted = children(d3Container).map(dataPop).sort();
            var expectedPopulationSorted = [newData.population, newData.children[0].population, newData.children[2].population, newData.children[3].population, newData.children[1].population].sort();
            expect(actualPopulationSorted).toEqual(expectedPopulationSorted);
        });

    });


});
