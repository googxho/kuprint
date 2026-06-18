// ============================================================
// options/manager.js — 配置项注册管理器
// 从 core/option-items.js 拆分
// ============================================================

// 所有分类文件将配置项实例推入此数组
window.__printElementOptionItems = window.__printElementOptionItems || [];

var PrintElementOptionItemManager = (function () {
    var _items = {};

    // 从各分类文件收集的配置项实例
    var _printElementOptionItems = window.__printElementOptionItems;

    return {
        init: function () {
            if (!this.printElementOptionItems) {
                this.printElementOptionItems = {};
                for (var i = 0; i < _printElementOptionItems.length; i++) {
                    this.printElementOptionItems[_printElementOptionItems[i].name] = _printElementOptionItems[i];
                }
            }
        },
        registerItem: function (item) {
            if (!item.name) throw new Error("styleItem must have name");
            this.init();
            this.printElementOptionItems[item.name] = item;
        },
        getItem: function (name) {
            this.init();
            return this.printElementOptionItems[name];
        }
    };
})();
