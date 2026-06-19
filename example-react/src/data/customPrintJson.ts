// ============================================================
// customPrintJson.ts — 打印模板 JSON 数据
// 从 example/custom_test/custom-print-json.js 移植
// ============================================================

export const customPrintJson = {
  panels: [
    {
      index: 0,
      height: 297,
      width: 210,
      paperHeader: 49.5,
      paperFooter: 780,
      printElements: [
        {
          options: {
            left: 175.5,
            top: 10.5,
            height: 27,
            width: 259,
            title: "KuPrint自定义模块打印插件",
            fontSize: 19,
            fontWeight: "600",
            textAlign: "center",
            lineHeight: 26,
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 27,
            height: 13,
            width: 52,
            title: "页眉线",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 25.5,
            top: 57,
            height: 705,
            width: 9,
            fixed: true,
            borderStyle: "dotted",
          },
          printElementType: {
            type: "vline",
          },
        },
        {
          options: {
            left: 60,
            top: 61.5,
            height: 48,
            width: 87,
            src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
          },
          printElementType: {
            title: "图片",
            type: "image",
          },
        },
        {
          options: {
            left: 153,
            top: 64.5,
            height: 39,
            width: 276,
            title:
              "二维码以及条形码均采用svg格式打印。不同打印机打印不会造成失真。图片打印：不同DPI打印可能会导致失真，",
            fontFamily: "微软雅黑",
            textAlign: "center",
            lineHeight: 18,
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 457.5,
            top: 79.5,
            height: 13,
            width: 120,
            title: "姓名",
            field: "name",
            testData: "古力娜扎",
            color: "#f00808",
            textDecoration: "underline",
            textAlign: "center",
          },
          printElementType: {
            title: "文本",
            type: "text",
          },
        },
        {
          options: {
            left: 499.5,
            top: 120,
            height: 43,
            width: 51,
            title: "123456789",
            textType: "qrcode",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 285,
            top: 130.5,
            height: 34,
            width: 175,
            title: "123456789",
            fontFamily: "微软雅黑",
            textAlign: "center",
            textType: "barcode",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 132,
            height: 19,
            width: 213,
            title: "所有打印元素都可已拖拽的方式来改变元素大小",
            fontFamily: "微软雅黑",
            textAlign: "center",
            lineHeight: 18,
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 153,
            top: 189,
            height: 13,
            width: 238,
            title: "单击元素，右侧可自定义元素属性",
            textAlign: "center",
            fontFamily: "微软雅黑",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 190.5,
            height: 13,
            width: 51,
            title: "横线",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 415.5,
            top: 190.5,
            height: 13,
            width: 164,
            title: "可以配置各属性的默认值",
            textAlign: "center",
            fontFamily: "微软雅黑",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 214.5,
            height: 8,
            width: 457.5,
            borderStyle: "dashed",
          },
          printElementType: {
            type: "hline",
          },
        },
        {
          options: {
            left: 303,
            top: 244.5,
            height: 34,
            width: 175,
            title: "123456789",
            fontFamily: "微软雅黑",
            textAlign: "center",
            textType: "barcode",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 246,
            height: 28,
            width: 109,
            title: "长文文本",
            fontFamily: "微软雅黑",
            textAlign: "center",
            lineHeight: 28,
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 291,
            height: 97,
            width: 459,
            field: "longText",
            fontFamily: "微软雅黑",
            fontSize: 9,
          },
          printElementType: {
            title: "长文",
            type: "longText",
          },
        },
        {
          options: {
            left: 60,
            top: 408,
            height: 0,
            width: 459,
            field: "table",
            columns: [
              [
                { width: 85.25, colspan: 1, rowspan: 1 },
                { width: 85.25, colspan: 1, rowspan: 1 },
                {
                  title: "姓名",
                  field: "name",
                  width: 85.25,
                  align: "center",
                  colspan: 1,
                  rowspan: 1,
                },
                { width: 85.25, colspan: 1, rowspan: 1 },
                { width: 85.25, colspan: 1, rowspan: 1 },
                { width: 85.25, colspan: 1, rowspan: 1 },
              ],
            ],
          },
          printElementType: {
            title: "表格",
            type: "table",
          },
        },
        {
          options: {
            left: 36,
            top: 601.5,
            height: 13,
            width: 70,
            title: "第",
            fontSize: 10,
            textAlign: "right",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 103.5,
            top: 600,
            height: 16,
            width: 19,
            title: "1",
            textType: "pageNumber",
            fontSize: 10,
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 120,
            top: 601.5,
            height: 13,
            width: 70,
            title: "页 共",
            fontSize: 10,
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 190.5,
            top: 600,
            height: 16,
            width: 19,
            title: "1",
            textType: "pageTotal",
            fontSize: 10,
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 210,
            top: 601.5,
            height: 13,
            width: 70,
            title: "页",
            fontSize: 10,
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 66,
            top: 616.5,
            height: 37,
            width: 163,
            fitting: true,
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 258,
            top: 618,
            height: 34,
            width: 229,
            borderStyle: "solid",
          },
          printElementType: {
            type: "rect",
          },
        },
      ],
    },
  ],
};
