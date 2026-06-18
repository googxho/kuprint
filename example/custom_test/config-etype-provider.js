var configElementTypeProvider = (function () {
  return function (options) {
    var addElementTypes = function (context) {
      context.addPrintElementTypes("testModule", [
        new kuprint.PrintElementTypeGroup("常规", [
          {
            tid: "configModule.name",
            title: "姓名",
            field: "name",
            data: "古力娜扎",
            type: "text",
            options: {
              height: 42,
              width: 107,
              fontSize: 19,
              fontWeight: "700",
              textAlign: "center",
              lineHeight: 39,
              hideTitle: true,
            },
          },
          {
            tid: "configModule.mySite",
            title: "个人网页",
            field: "mySite",
            data: "http://www.hinnn.com",
            type: "text",
            options: {
              height: 50,
              width: 50,
              fontSize: 19,
              fontWeight: "700",
              textAlign: "center",
              lineHeight: 39,
              hideTitle: true,
              textType: "qrcode",
            },
          },
          { tid: "configModule.gender", title: "性别", field: "gender", data: "男", type: "text" },
          {
            tid: "configModule.like",
            title: "爱好",
            field: "like",
            data: "读书写字",
            type: "text",
          },
          {
            tid: "configModule.email",
            title: "邮箱",
            field: "email",
            data: "hinnn.com@gmail.com",
            type: "text",
          },
          {
            tid: "configModule.address",
            title: "地址",
            field: "address",
            data: "北京朝阳区",
            type: "text",
          },
          {
            tid: "configModule.phone",
            title: "电话",
            field: "phone",
            data: "18888888888",
            type: "text",
          },
          {
            tid: "configModule.target",
            title: "目标",
            field: "target",
            data: "数据产品经理",
            type: "text",
          },

          {
            tid: "configModule.image",
            title: "图片",
            data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
            type: "image",
          },
          //{ tid: 'testModule.longText', title: '长文', data: '155123456789', type: 'longText' },
          {
            tid: "configModule.workExperience",
            field: "workExperience",
            title: "工作经历",
            type: "table",
            columns: [
              [
                { title: "职位", align: "center", field: "position", width: 100 },
                { title: "公司", align: "center", field: "company", width: 100 },
                { title: "地点", align: "center", field: "address", width: 100 },
                { title: "时间", align: "center", field: "date", width: 100 },
                { title: "主要工作", align: "center", field: "work", width: 200 },
              ],
            ],
          },
          {
            tid: "configModule.html",
            title: "html",
            formatter: function (data, options) {
              return $(
                '<div style="height:50pt;width:50pt;background:red;border-radius: 50%;"></div>',
              );
            },
            type: "html",
          },
          {
            tid: "configModule.customText",
            title: "自定义文本",
            customText: "自定义文本",
            custom: true,
            type: "text",
          },
        ]),
        new kuprint.PrintElementTypeGroup("专业", [
          {
            tid: "configModule.professional",
            title: "专业",
            field: "professional",
            data: "信息管理与信息系统",
            type: "text",
          },
          {
            tid: "configModule.university",
            title: "大学",
            field: "university",
            data: "北京邮电大学",
            type: "text",
          },
          {
            tid: "configModule.universityAddress",
            title: "地点",
            field: "universityAddress",
            data: "北京",
            type: "text",
          },
          {
            tid: "configModule.universityDate",
            title: "时间",
            field: "universityDate",
            data: "2008",
            type: "text",
          },
          {
            tid: "configModule.tech",
            title: "技能",
            field: "tech",
            data: "MYSQL,HIVE(数据仓库工具),SPSS(统计产品已服务解决方案),数据挖掘，跨部门沟通能力，业务理解能力，数据解读分析。",
            type: "longText",
          },
        ]),
        new kuprint.PrintElementTypeGroup("辅助", [
          {
            tid: "configModule.hline",
            title: "横线",
            type: "hline",
          },
          {
            tid: "configModule.vline",
            title: "竖线",
            type: "vline",
          },
          {
            tid: "configModule.rect",
            title: "矩形",
            type: "rect",
          },
          {
            tid: "testModule.oval",
            title: "椭圆",
            type: "oval",
          },
        ]),
      ]);
    };

    return {
      addElementTypes: addElementTypes,
    };
  };
})();
