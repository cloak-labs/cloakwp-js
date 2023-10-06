"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var coreBlocks_1 = require("./coreBlocks");
var Container_1 = require("./components/Container");
var ConditionalWrapper_1 = require("./components/ConditionalWrapper");
var classNames_1 = require("./utils/classNames");
var deepMerge_1 = require("./utils/deepMerge");
var useBlockConfig_1 = require("./hooks/useBlockConfig");
function Block(_a) {
    var _b, _c, _d, _e;
    var block = _a.block, 
    // blockConfig, at some point in future, allow this prop to override the blockConfig on a per-block basis by conditionally wrapping the rendered block with another <BlockConfigProvider />
    _f = _a.isNested, 
    // blockConfig, at some point in future, allow this prop to override the blockConfig on a per-block basis by conditionally wrapping the rendered block with another <BlockConfigProvider />
    isNested = _f === void 0 ? false : _f, parentBlock = _a.parentBlock, _g = _a.containerClasses, containerClasses = _g === void 0 ? "" : _g, container = _a.container, // dev has the ability to override the default container function -- this prop is only useful when dev is explicitly rendering <Block /> (not common) --> <Blocks /> does not pass 'container' to Block as prop, instead it uses context (see useBlockConfig() below)
    containerCondition = _a.containerCondition, // dev has the ability to override the default condition that determines whether to wrap a block with a container -- this prop is only useful when dev is explicitly rendering <Block /> (not common) --> <Blocks /> does not pass 'container' to Block as prop, instead it uses context (see useBlockConfig() below)
    prevSibling = _a.prevSibling, // the block data for the current block's previous sibling block
    nextSibling = _a.nextSibling, // the block data for the current block's next sibling block
    _h = _a.dataSource, // the block data for the current block's next sibling block
    dataSource = _h === void 0 ? "default" : _h, // the key of the WP data source where this block's data came from -- we pass this into the Block's component so users can render things conditionally based on the data source
    props = __rest(_a, ["block", "isNested", "parentBlock", "containerClasses", "container", "containerCondition", "prevSibling", "nextSibling", "dataSource"]);
    var _j = (0, useBlockConfig_1.useBlockConfig)(), globalCustomContainer = _j.container, globalCustomContainerCondition = _j.containerCondition, blockConfig = _j.blocks;
    var SmallContainer = function (_a) {
        var block = _a.block;
        return ((0, jsx_runtime_1.jsx)(Container_1.default, __assign({ innerClassName: (0, classNames_1.classNames)("max-w-3xl lg:max-w-4xl", block.config.containerClasses) }, { children: block.rendered })));
    };
    /*
      cloakwp provides simple/sensible defaults for core block components, the block container,
      and the condition for which the block container is used --> devs can override all these
      defaults via props or context (when using our <BlockConfigProvider>)
    */
    var defaults = {
        container: function (_a) {
            var block = _a.block;
            return ((0, jsx_runtime_1.jsx)(Container_1.default, __assign({ className: (0, classNames_1.classNames)("relative", block.config.containerClasses) }, { children: block.rendered })));
        },
        containerCondition: function (_a) {
            var block = _a.block;
            return !block.isNested;
        },
        blocks: {
            "core/paragraph": {
                component: coreBlocks_1.Paragraph,
                container: SmallContainer,
                containerClasses: "py-2",
            },
            "core/heading": {
                component: coreBlocks_1.Heading,
                container: SmallContainer,
                containerClasses: "py-2",
            },
            "core/image": {
                component: coreBlocks_1.Image,
                container: SmallContainer,
                containerClasses: "py-2",
            },
            "core/embed": {
                component: coreBlocks_1.Embed,
                container: SmallContainer,
                containerClasses: "py-2",
            },
            "core/html": {
                component: coreBlocks_1.Html,
                container: true,
                containerClasses: "py-2",
            },
            "core/columns": {
                component: coreBlocks_1.Columns,
                container: false,
            },
            "core/column": {
                component: coreBlocks_1.Column,
                container: false,
            },
            "core/group": {
                component: coreBlocks_1.Group,
                container: false,
            },
            "core/list": {
                component: coreBlocks_1.List,
                container: SmallContainer,
            },
            "core/list-item": {
                component: coreBlocks_1.ListItem,
                container: false,
            },
            "core/buttons": {
                component: coreBlocks_1.Buttons,
                container: SmallContainer,
                containerClasses: "py-2",
            },
            "core/button": {
                component: coreBlocks_1.Button,
                container: true,
            },
        },
    };
    var finalConfig = (0, deepMerge_1.deepMerge)(__assign({}, defaults.blocks), __assign({}, blockConfig))[block.name]; // immediately after deep merging, we pick out the specific block we're currently rendering from the final config
    if (!finalConfig) {
        console.error("Failed to render Block (".concat(block.name, ") due to missing config object for this particular block. You probably didn't provide a 'blocks' prop to your <Blocks /> component, or failed to include a sub-object for '").concat(block.name, "'."));
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    }
    var possibleContainers = [
        // an array of all the possible containers to use for this Block, where index 0 takes highest priority
        container,
        (_b = blockConfig[block.name]) === null || _b === void 0 ? void 0 : _b.container,
        globalCustomContainer,
        (_c = defaults.blocks[block.name]) === null || _c === void 0 ? void 0 : _c.container,
        defaults.container, // default global container specified by cloakwp (last priority)
    ]; // note: there are 4 ways for package users to provide a custom container (and a default container provided by us)
    var finalContainer = possibleContainers.filter(function (cntr) { return typeof cntr == "function"; })[0]; // filter out non-component & non-boolean containers, then pick off the 1st one (smallest index == highest priority)
    var containerEnabled = true;
    possibleContainers.every(function (cntr, index) {
        // stops iterating when we return false
        if (cntr === false) {
            // we found a falsy container value before we found a container function, which means we set containerEnabled = false and don't render a container
            containerEnabled = false;
            return false; // equivalent to 'break;'
        }
        if (typeof cntr == "function") {
            return false; // we found a container function before we found a falsy value, which means we leave containerEnabled = true
        }
        return true; // equivalent to 'continue;' and is required for 'every()'
    });
    var possibleContainerConditions = [
        // same idea as 'possibleContainers' above ^ .. a container condition is a function that returns true/false to determine if this block gets rendered inside a container or not
        containerCondition,
        (_d = blockConfig[block.name]) === null || _d === void 0 ? void 0 : _d.containerCondition,
        globalCustomContainerCondition,
        (_e = defaults.blocks[block.name]) === null || _e === void 0 ? void 0 : _e.containerCondition,
        defaults.containerCondition,
    ];
    var finalContainerCondition = possibleContainerConditions.filter(function (condition) { return typeof condition == "function"; })[0];
    var Component = finalConfig.component, _k = finalConfig.props, configProps = _k === void 0 ? {} : _k;
    var finalProps = (0, deepMerge_1.deepMerge)(
    // merge custom props provided to Block component with custom props provided by default/block config
    configProps, props);
    if (!Component) {
        console.error("Failed to render Block (".concat(block.name, ") due to a missing component. You probably didn't provide this block with a 'component' property in your 'blocks' object."));
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    }
    var blockObj = __assign(__assign({}, block), { isNested: isNested, parent: parentBlock, config: finalConfig, prevSibling: prevSibling, nextSibling: nextSibling });
    return ((0, jsx_runtime_1.jsx)(ConditionalWrapper_1.default, __assign({ condition: function () {
            return containerEnabled
                ? finalContainerCondition === null || finalContainerCondition === void 0 ? void 0 : finalContainerCondition({ block: blockObj, finalProps: finalProps })
                : false;
        }, wrapper: function (children) {
            return finalContainer === null || finalContainer === void 0 ? void 0 : finalContainer({
                block: __assign(__assign({}, blockObj), { rendered: children }),
                finalProps: finalProps,
            });
        } }, { children: (0, jsx_runtime_1.jsx)(Component, __assign({ block: blockObj, dataSource: dataSource }, finalProps)) })));
}
exports.default = Block;
