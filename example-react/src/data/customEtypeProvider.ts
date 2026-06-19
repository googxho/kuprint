// ============================================================
// customEtypeProvider.ts — 自定义打印元素类型提供者
// 从 example/custom_test/custom-etype-provider.js 移植
// ============================================================

declare const kuprint: {
  PrintElementTypeGroup: new (name: string, elements: unknown[]) => unknown;
};

export function customElementTypeProvider() {
  const addElementTypes = (context: {
    addPrintElementTypes: (module: string, groups: unknown[]) => void;
  }) => {
    context.addPrintElementTypes("testModule", [
      new kuprint.PrintElementTypeGroup("常规", [
        { tid: "testModule.text", text: "文本", data: "", type: "text" },
        {
          tid: "testModule.image",
          text: "图片",
          data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
          type: "image",
        },
        { tid: "testModule.longText", text: "长文", data: "", type: "longText" },
        {
          tid: "testModule.table",
          field: "table",
          text: "表格",
          type: "table",
          groupFields: ["name"],
          groupFooterFormatter: function (_group: unknown, _option: unknown) {
            return "这里自定义统计脚信息";
          },
          columns: [
            [
              { title: "行号", fixed: true, rowspan: 2, field: "id", width: 70 },
              { title: "人员信息", colspan: 2 },
              { title: "销售统计", colspan: 2 },
            ],
            [
              { title: "姓名", align: "left", field: "name", width: 100 },
              { title: "性别", field: "gender", width: 100 },
              { title: "销售数量", field: "count", width: 100 },
              { title: "销售金额", field: "amount", width: 100 },
            ],
          ],
        },
        {
          tid: "testModule.tableCustom",
          title: "表格",
          type: "tableCustom",
        },
        {
          tid: "testModule.html",
          title: "html",
          formatter: function (_data: unknown, _options: unknown) {
            return $(
              '<div style="height:50pt;width:50pt;background:red;border-radius: 50%;"></div>',
            );
          },
          type: "html",
        },
        {
          tid: "testModule.customText",
          text: "自定义文本",
          customText: "自定义文本",
          custom: true,
          type: "text",
        },
      ]),
      new kuprint.PrintElementTypeGroup("辅助", [
        {
          tid: "testModule.hline",
          text: "横线",
          type: "hline",
        },
        {
          tid: "testModule.vline",
          text: "竖线",
          type: "vline",
        },
        {
          tid: "testModule.rect",
          text: "矩形",
          type: "rect",
        },
        {
          tid: "testModule.oval",
          text: "椭圆",
          type: "oval",
        },
      ]),
    ]);
  };

  return {
    addElementTypes,
  };
}
