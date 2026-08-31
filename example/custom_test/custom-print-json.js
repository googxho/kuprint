var customPrintJson = {
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
            height: 64,
            width: 64,
            src: "data:image/jpeg;base64,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",
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
            height: 10,
            width: 475.5,
          },
          printElementType: {
            title: "横线",
            type: "hline",
          },
        },
        {
          options: {
            left: 235.5,
            top: 220.5,
            height: 32,
            width: 342,
            title:
              "自定义表格：用户可左键选中表头，右键查看可操作项，操作类似Excel，双击表头单元格可进行编辑。内容：title#field",
            fontFamily: "微软雅黑",
            textAlign: "center",
            lineHeight: 15,
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 156,
            top: 265.5,
            height: 13,
            width: 94,
            title: "表头列大小可拖动",
            fontFamily: "微软雅黑",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 265.5,
            height: 13,
            width: 90,
            title: "红色区域可拖动",
            fontFamily: "微软雅黑",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 285,
            height: 44,
            width: 511.5,
            field: "table",
            columns: [
              [
                {
                  width: 85.25,
                  colspan: 1,
                  rowspan: 1,
                },
                {
                  width: 85.25,
                  colspan: 1,
                  rowspan: 1,
                },
                {
                  title: "姓名",
                  field: "name",
                  width: 85.25,
                  align: "center",
                  colspan: 1,
                  rowspan: 1,
                },
                {
                  width: 85.25,
                  colspan: 1,
                  rowspan: 1,
                },
                {
                  width: 85.25,
                  colspan: 1,
                  rowspan: 1,
                },
                {
                  width: 85.25,
                  colspan: 1,
                  rowspan: 1,
                },
              ],
            ],
          },
          printElementType: {
            title: "表格",
            type: "tableCustom",
            footerFormatter: function (options, rows, data, currentPageGridRowsData) {
              return "<tr><td>" + currentPageGridRowsData.length + "</td></tr>";
            },
          },
        },
        {
          options: {
            left: 21,
            top: 346.5,
            height: 61.5,
            width: 15,
            title: "装订线",
            lineHeight: 18,
            fixed: true,
            contentPaddingTop: 3.75,
            backgroundColor: "#ffffff",
          },
          printElementType: {
            type: "text",
          },
        },
        {
          options: {
            left: 225,
            top: 349.5,
            height: 13,
            width: 346.5,
            title: "自定义模块：主要为开发人员设计，能够快速，简单，实现自己功能",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 370.5,
            height: 18,
            width: 79,
            title: "配置项表格",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 225,
            top: 385.5,
            height: 38,
            width: 346.5,
            title:
              "配置模块：主要为客户使用，开发人员可以配置属性，字段，标题等，客户直接使用，配置模块请参考实例2",
            fontFamily: "微软雅黑",
            lineHeight: 15,
            textAlign: "center",
            color: "#d93838",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 487.5,
            height: 13,
            width: 123,
            title: "长文本会自动分页",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 507,
            height: 40,
            width: 511.5,
            field: "longText",
          },
          printElementType: {
            title: "长文",
            type: "longText",
          },
        },
        {
          options: {
            left: 475.5,
            top: 565.5,
            height: 100,
            width: 100,
          },
          printElementType: {
            title: "矩形",
            type: "rect",
          },
        },
        {
          options: {
            left: 174,
            top: 568.5,
            height: 13,
            width: 90,
            title: "竖线",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 60,
            top: 574.5,
            height: 100,
            width: 10,
          },
          printElementType: {
            title: "竖线",
            type: "vline",
          },
        },
        {
          options: {
            left: 210,
            top: 604.5,
            height: 13,
            width: 120,
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
            left: 130.5,
            top: 625.5,
            height: 10,
            width: 277,
          },
          printElementType: {
            title: "横线",
            type: "hline",
          },
        },
        {
          options: {
            left: 364.5,
            top: 649.5,
            height: 13,
            width: 101,
            title: "矩形",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 525,
            top: 784.5,
            height: 13,
            width: 63,
            title: "页尾线",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 12,
            top: 786,
            height: 49,
            width: 49,
          },
          printElementType: {
            title: "html",
            type: "html",
          },
        },
        {
          options: {
            left: 75,
            top: 790.5,
            height: 13,
            width: 137,
            title: "红色原型是自动定义的Html",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
        {
          options: {
            left: 334.5,
            top: 810,
            height: 13,
            width: 205,
            title: "页眉线已上。页尾下以下每页都会重复打印",
            textAlign: "center",
          },
          printElementType: {
            title: "自定义文本",
            type: "text",
          },
        },
      ],
      paperNumberLeft: 565.5,
      paperNumberTop: 819,
    },
  ],
};
