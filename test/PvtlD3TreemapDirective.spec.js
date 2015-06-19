describe('PvtlD3TreemapDirective', function () {
    beforeEach(module('pvtlD3Treemap'));

    var $rootScope, $compile;
    var width, height;
    var data;

    function makeDirective(markup) {
        var $scope = $rootScope.$new();
        $scope.population = data;

        var pvtlD3Treemap = $compile(markup)($scope)[0];
        $rootScope.$digest();
        return pvtlD3Treemap.children[0];
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

    beforeEach(inject(function (_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;

        width = 300;
        height = 150;

        data = {
            label: 'United Kingdom',
            value: 63181775,
            children: [
                {
                    label: 'England',
                    value: 53012456
                },
                {
                    label: 'Scotland',
                    value: 5295000
                },
                {
                    label: 'Wales',
                    value: 3063456
                },
                {
                    label: 'Northern Ireland',
                    value: 1810863
                }
            ]
        };
    }));

    describe('with a valid node template', function () {
        var d3Container;

        beforeEach(function () {
            var markup =
                '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="population">' +
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
    });

    it('resolves directives in the nodes but not in the node template', function () {
        var markup =
            '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="population">' +
            '<div><div ng-if="!children"><pre>{{label}}</pre></div></div>' +
            '</pvtl-d3-treemap>';

        var d3Container = makeDirective(markup);

        expect(children(d3Container).map(textContent)).toEqual(['', 'England', 'Scotland', 'Wales', 'Northern Ireland']);
    });

    describe('with invalid input', function () {
        it('raises an error if there is no width', function () {
            var badMarkup =
                '<pvtl-d3-treemap height="' + height + '" data="population">' +
                '<pre></pre>' +
                '</pvtl-d3-treemap>';

            expect(function () {
                $compile(badMarkup);
            }).toThrow(new Error('You must specify both width and height'));
        });

        it('raises an error if there is no height', function () {
            var badMarkup =
                '<pvtl-d3-treemap width="' + width + '" data="population">' +
                '<pre></pre>' +
                '</pvtl-d3-treemap>';

            expect(function () {
                $compile(badMarkup);
            }).toThrow(new Error('You must specify both width and height'));
        });

        it('raises an error if there is no node template', function () {
            var badMarkup =
                '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="population">' +
                '</pvtl-d3-treemap>';

            expect(function () {
                $compile(badMarkup);
            }).toThrow(new Error('You must specify a node template as a single child of the directive element'));
        });

        it('raises an error if there is a node template with more than one element', function () {
            var badMarkup =
                '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="population">' +
                '<p></p><p></p>' +
                '</pvtl-d3-treemap>';

            expect(function () {
                $compile(badMarkup);
            }).toThrow(new Error('You must specify a node template as a single child of the directive element'));
        });
    });
});
