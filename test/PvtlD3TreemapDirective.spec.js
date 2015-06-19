describe('PvtlD3TreemapDirective', function () {
    beforeEach(module('pvtlD3Treemap'));

    var width, height;
    var data;
    var pvtlD3Treemap;
    var d3Div;

    beforeEach(inject(function ($rootScope, $compile) {
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

        var $scope = $rootScope.$new();
        $scope.population = data;

        var pvtlD3TreemapMarkup =
            '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="population">' +
            '<pre>{{label}}</pre>' +
            '</pvtl-d3-treemap>';

        pvtlD3Treemap = $compile(pvtlD3TreemapMarkup)($scope)[0];
        $rootScope.$digest();
        d3Div = pvtlD3Treemap.children[0];
    }));

    function children(parent) {
        var collection = parent.children,
            array = [],
            i;
        for (i = 0; i < collection.length; i += 1) {
            array.push(collection[i]);
        }
        return array;
    }

    it('creates a d3 div which is positioned relatively', function () {
        expect(d3Div.style.position).toBe('relative');
    });

    it('creates nodes for each data item', function () {
        expect(d3Div.children.length).toBe(data.children.length + 1);
    });

    function styleValue(attribute) {
        return function (el) {
            var style = el.style[attribute];
            return style;
        };
    }

    function styleValuePx(attribute) {
        return function (el) {
            return parseInt(styleValue(attribute)(el), 10);
        };
    }

    it('spreads the nodes across the specified height and width', function () {
        var nodeElements = children(d3Div).map(styleValue('position'));
        expect(_.uniq(nodeElements)).toEqual(['absolute']);

        expect(Math.min.apply(null, children(d3Div).map(styleValuePx('top')))).toBe(0);
        expect(Math.min.apply(null, children(d3Div).map(styleValuePx('left')))).toBe(0);

        function computeRight(el) {
            return parseInt(el.style.left, 10) + parseInt(el.style.width, 10);
        }

        expect(Math.max.apply(null, children(d3Div).map(computeRight))).toBe(width);

        function computeBottom(el) {
            return parseInt(el.style.top, 10) + parseInt(el.style.height, 10);
        }

        expect(Math.max.apply(null, children(d3Div).map(computeBottom))).toBe(height);
    });

    it('uses the content of the directive element as a template for the nodes', function () {
        function tagName(el) {
            return el.tagName;
        }

        function textContent(el) {
            return el.textContent;
        }

        expect(_.uniq(children(d3Div).map(tagName))).toEqual(['PRE']);
        expect(children(d3Div).map(textContent)).toEqual(['United Kingdom', 'England', 'Scotland', 'Wales', 'Northern Ireland']);
    });

    it('raises an error if there is no node template', inject(function ($rootScope, $compile) {
        var badMarkup =
            '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="population">' +
            '</pvtl-d3-treemap>';
        var link = $compile(badMarkup);

        expect(function () {
            return link($rootScope.$new());
        }).toThrow(new Error('You must specify a node template as a single child of the directive element'));
    }));

    it('raises an error if there is a node template with more than one element', inject(function ($rootScope, $compile) {
        var badMarkup =
            '<pvtl-d3-treemap width="' + width + '" height="' + height + '" data="population">' +
            '<p></p><p></p>' +
            '</pvtl-d3-treemap>';
        var link = $compile(badMarkup);

        expect(function () {
            return link($rootScope.$new());
        }).toThrow(new Error('You must specify a node template as a single child of the directive element'));
    }));

});
