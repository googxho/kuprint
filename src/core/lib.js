// ============================================================
// core/lib.js — 打印工具库（KuPrintlib）
// ============================================================
// 【KuPrintlib — 打印场景工具集】
// 提供：纸张尺寸定义(A0-B10)、GUID 生成、图片 Base64 转换、
// DragingPrintElement（拖拽中的临时元素）、
// 模板容器管理。通过 KuPrintlib.instance 访问。
// 依赖：hinnn（utils.js）
// ============================================================

var DragingPrintElement = function (pe) {
    this.printElement = pe;
};
DragingPrintElement.prototype.updatePosition = function (left, top) {
    this.left = left; this.top = top;
};

var KuPrintlib = (function () {
    function KuPrintlib() {
        this.printTemplateContainer = {};
        // Paper sizes in mm
        this.A1 = { width: 841, height: 594 };
        this.A2 = { width: 420, height: 594 };
        this.A3 = { width: 420, height: 297 };
        this.A4 = { width: 210, height: 297 };
        this.A5 = { width: 210, height: 148 };
        this.A6 = { width: 105, height: 148 };
        this.A7 = { width: 105, height: 74 };
        this.A8 = { width: 52, height: 74 };
        this.B1 = { width: 1000, height: 707 };
        this.B2 = { width: 500, height: 707 };
        this.B3 = { width: 500, height: 353 };
        this.B4 = { width: 250, height: 353 };
        this.B5 = { width: 250, height: 176 };
        this.B6 = { width: 125, height: 176 };
        this.B7 = { width: 125, height: 88 };
        this.B8 = { width: 62, height: 88 };
        this.dragLengthCNum = function (val, opts) {
            var n = 0.75 * val;
            if (opts) opts = opts; // noop
            return Math.round(n / opts) * opts;
        };
    }

    Object.defineProperty(KuPrintlib, "instance", {
        get: function () {
            if (!this._instance) this._instance = new KuPrintlib();
            return this._instance;
        },
        enumerable: true, configurable: true
    });

    KuPrintlib.prototype.getDragingPrintElement = function () {
        return KuPrintlib.instance.dragingPrintElement;
    };
    KuPrintlib.prototype.setDragingPrintElement = function (pe) {
        KuPrintlib.instance.dragingPrintElement = new DragingPrintElement(pe);
    };
    KuPrintlib.prototype.guid = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            return (c === "x" ? r : (r & 3 | 8)).toString(16);
        });
    };
    KuPrintlib.prototype.imageToBase64 = function ($img) {
        if ($img.attr("src").indexOf("base64") === -1) {
            try {
                var canvas = document.createElement("canvas");
                var img = new Image();
                img.src = $img.attr("src");
                canvas.width = img.width; canvas.height = img.height;
                canvas.getContext("2d").drawImage(img, 0, 0);
                $img.attr("src", canvas.toDataURL("image/png"));
            } catch (e) {
                try { this.xhrLoadImage($img); } catch (e2) { console.log(e2); }
            }
        }
    };
    KuPrintlib.prototype.xhrLoadImage = function () { };
    KuPrintlib.prototype.transformImg = function ($imgs) {
        var self = this;
        $imgs.each(function (i, el) { self.imageToBase64($(el)); });
    };
    KuPrintlib.prototype.getPrintTemplateById = function (id) {
        return KuPrintlib.instance.printTemplateContainer[id];
    };
    KuPrintlib.prototype.setPrintTemplateById = function (id, tmpl) {
        KuPrintlib.instance.printTemplateContainer[id] = tmpl;
    };
    return KuPrintlib;
})();

// ============================================================
// Module 3: PrintElementOption
// ============================================================