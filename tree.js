"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var disarray_js_1 = require("./disarray.js");
var node_1 = require("node");
var btclass = (function () {
    return /** @class */ (function (_super) {
        __extends(BinaryTree, _super);
        function BinaryTree() {
            var _this = this;
            _this.stats = {
                size: 0,
                removed: 0,
                duplicates: 0,
                total: function () {
                    return this.size + this.removed + this.duplicates;
                }
            };
            _this.push = function (item) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                var colo_1;
                                return __generator(this, function (_a) {
                                    if (typeof item === "object" && item instanceof Array) {
                                        colo_1 = this;
                                        setTimeout(function () {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var i;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!(typeof (i = item.pop()) !== 'undefined')) return [3 /*break*/, 2];
                                                            return [4 /*yield*/, colo_1.push(i)];
                                                        case 1:
                                                            _a.sent();
                                                            return [3 /*break*/, 0];
                                                        case 2:
                                                            resolve();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        }, 1);
                                    }
                                    else {
                                        if (!this._top) {
                                            this._top = treenode(this, item, null, null, false);
                                        }
                                        else {
                                            this._top.add(item);
                                        }
                                        setTimeout(resolve, 1);
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    });
                });
            };
            _this.remove = function (item) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                var colo_2;
                                return __generator(this, function (_a) {
                                    if (typeof item === "object" && item instanceof Array) {
                                        colo_2 = this;
                                        setTimeout(function () {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var i;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!(typeof (i = item.pop()) !== 'undefined')) return [3 /*break*/, 2];
                                                            return [4 /*yield*/, colo_2.remove(i)];
                                                        case 1:
                                                            _a.sent();
                                                            return [3 /*break*/, 0];
                                                        case 2:
                                                            resolve();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        }, 1);
                                    }
                                    else {
                                        if (!this._top) {
                                            this._top = treenode(this, item, null, null, true);
                                        }
                                        else {
                                            this._top.remove(item);
                                        }
                                        setTimeout(resolve, 1);
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    });
                });
            };
            _this.next = function () {
                if (!current) {
                    if (!this._top)
                        return null;
                    current = this._top;
                    while (current.left !== null) {
                        current = current.left;
                    }
                    nm;
                }
                while (current.excluded && current.right !== null) {
                    current = current.right;
                }
                var out = (!current.excluded) ? current.item : null;
                if (current.right) {
                    current = current.right;
                }
                else {
                    current = null;
                }
                return out;
            };
            _this.random = function (shuffle) {
                if (shuffle === void 0) { shuffle = 2; }
                var n, output = new disarray_js_1.DisArray();
                current = null;
                while ((n = next()) !== null) {
                    output.displace(n);
                }
                output.disarrange(shuffle - 1);
                return output;
            };
            return _this;
        }
        return BinaryTree;
    }(node_1.Iterable));
    function treenode(tree, item, left, right, excluded) {
        if (excluded === void 0) { excluded = false; }
        function factory(tree, exmode) {
            if (exmode === void 0) { exmode = false; }
            return function (item) {
                var current = tree._top;
                var added = false;
                var previous;
                while (!added) {
                    if (item === current.item) {
                        if (exmode) {
                            if (!current.excluded) {
                                current.excluded = true;
                                tree.stats.size--;
                            }
                        }
                        else {
                            if (!current.excluded)
                                tree.stats.duplicates++;
                            else
                                tree.stats.removed++;
                        }
                        added = true;
                    }
                    else if (item < current.item) {
                        if (current.left !== null && current.left !== previous) {
                            previous = current;
                            current = current.left;
                        }
                        else {
                            var n = treenode(tree, item, current.left, current, exmode);
                            if (current.left === previous) {
                                previous.right = n;
                            }
                            current.left = n;
                            if (!exmode)
                                tree.stats.size++;
                            added = true;
                        }
                    }
                    else if (item > current.item) {
                        if (current.right !== null && current.right !== previous) {
                            previous = current;
                            current = current.right;
                        }
                        else {
                            var n = treenode(tree, item, current, current.right, exmode);
                            if (current.right === previous) {
                                previous.left = n;
                            }
                            current.right = n;
                            if (!exmode)
                                tree.stats.size++;
                            added = true;
                        }
                    }
                }
            };
        }
        return {
            item: item,
            right: right,
            left: left,
            excluded: excluded,
            add: factory(tree, false),
            remove: factory(tree, true)
        };
    }
})();
