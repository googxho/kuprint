// ============================================================
// kuprint.d.ts — 类型声明文件
// kuprint 2.5.x 打印库 TypeScript 类型定义
// ============================================================

declare namespace kuprint {
  // ============================================================
  // 基础类型
  // ============================================================
  type PaperSizeKey =
    | "A1"
    | "A2"
    | "A3"
    | "A4"
    | "A5"
    | "A6"
    | "A7"
    | "A8"
    | "B1"
    | "B2"
    | "B3"
    | "B4"
    | "B5"
    | "B6"
    | "B7"
    | "B8";
  type ElementType =
    | "text"
    | "image"
    | "longText"
    | "table"
    | "tableCustom"
    | "html"
    | "vline"
    | "hline"
    | "rect"
    | "oval";
  type TextType = "text" | "barcode" | "qrcode";
  type AxisType = "h" | "v";
  type BorderStyleValue = "border" | "noBorder" | "topBorder" | "bottomBorder" | "topBottomBorder";
  type ShowInPageValue = "first" | "last" | "odd" | "even";
  type TextAlignValue = "left" | "center" | "right";
  type TextDecorationValue = "underline" | "overline" | "line-through";
  type VerticalAlignValue = "top" | "middle" | "bottom";
  type BarcodeMode =
    | "CODE128"
    | "CODE128A"
    | "CODE128B"
    | "CODE128C"
    | "CODE39"
    | "EAN-13"
    | "EAN-8"
    | "EAN-5"
    | "EAN-2"
    | "UPC（A）"
    | "ITF"
    | "ITF-14"
    | "MSI"
    | "MSI10"
    | "MSI11"
    | "MSI1010"
    | "MSI1110"
    | "Pharmacode";
  type PanelPaperRule = "odd" | "even";
  type OrientValue = 1 | 2; // 1=portrait, 2=landscape
  type TableFooterRepeat = "no" | "last" | "all";
  type PaperNumberFormat = string; // e.g. "paperNo-paperCount"

  // ============================================================
  // 纸张尺寸
  // ============================================================
  interface PaperSize {
    width: number;
    height: number;
  }

  // ============================================================
  // 表单函数类型
  // ============================================================
  type FormatterFn = (value: any, ...args: any[]) => string;
  type StylerFn = (value: any, ...args: any[]) => Record<string, string> | undefined;
  type GroupFormatterFn = (group: GroupData, options: any) => string;
  type GroupFooterFormatterFn = (group: GroupData, options: any) => string;
  type FooterFormatterFn = (options: any, data: any[], templateData: any, rows?: any[]) => string;
  type GridColumnsFooterFormatterFn = (options: any, data: any[], templateData: any) => string;
  type OnRenderedFn = (paper: Paper, target: JQuery) => void;

  interface GroupData {
    key: Record<string, any>;
    rows: any[];
  }

  // ============================================================
  // 配置选项接口
  // ============================================================
  interface SupportOption {
    name: string;
    hidden?: boolean;
    title?: string;
  }

  interface ElementTypeConfig {
    supportOptions: SupportOption[];
    default: Record<string, any>;
  }

  // ============================================================
  // 打印元素选项（DTO）
  // ============================================================
  interface PrintElementOptionEntity {
    left?: number;
    top?: number;
    height?: number;
    width?: number;
    title?: string;
    field?: string;
    testData?: string;
    dataType?: string;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    letterSpacing?: number;
    color?: string;
    textDecoration?: TextDecorationValue;
    textAlign?: TextAlignValue;
    textContentVerticalAlign?: VerticalAlignValue;
    lineHeight?: number;
    textType?: TextType;
    barcodeMode?: BarcodeMode;
    hideTitle?: boolean;
    showInPage?: ShowInPageValue;
    unShowInPage?: ShowInPageValue;
    fixed?: boolean;
    axis?: AxisType;
    transform?: number;
    optionsGroup?: string;
    borderLeft?: string;
    borderTop?: string;
    borderRight?: string;
    borderBottom?: string;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: string;
    contentPaddingLeft?: number;
    contentPaddingTop?: number;
    contentPaddingRight?: number;
    contentPaddingBottom?: number;
    backgroundColor?: string;
    formatter?: string;
    styler?: string;
    src?: string;
    longTextIndent?: number;
    leftSpaceRemoved?: boolean;
    lHeight?: number;
    // 表格特有
    gridColumns?: number;
    gridColumnsGutter?: number;
    tableBorder?: string;
    tableHeaderBorder?: string;
    tableHeaderCellBorder?: string;
    tableHeaderRowHeight?: number;
    tableHeaderBackground?: string;
    tableHeaderFontSize?: number;
    tableHeaderFontWeight?: string;
    tableBodyRowHeight?: number;
    tableBodyRowBorder?: string;
    tableBodyCellBorder?: string;
    autoCompletion?: boolean;
    columns?: TableColumnOptionEntity[][];
    tableFooterRepeat?: TableFooterRepeat;
    footerFormatter?: string;
    gridColumnsFooterFormatter?: string;
    rowStyler?: string;
    content?: string;
    format?: string;
    name?: string;
    style?: Record<string, string>;
  }

  // ============================================================
  // 表格列选项实体（DTO）
  // ============================================================
  interface TableColumnOptionEntity {
    width?: number;
    title?: string;
    descTitle?: string;
    field?: string;
    columnId?: string;
    fixed?: boolean;
    rowspan?: number;
    colspan?: number;
    align?: TextAlignValue;
    halign?: TextAlignValue;
    vAlign?: VerticalAlignValue;
    formatter?: FormatterFn;
    styler?: StylerFn;
    formatter2?: string;
    styler2?: string;
    checkbox?: boolean;
    checked?: boolean;
  }

  // ============================================================
  // 打印元素类型实体（DTO）
  // ============================================================
  interface PrintElementTypeEntity {
    field?: string;
    title?: string;
    type?: ElementType;
    columns?: TableColumnOptionEntity[][];
  }

  // ============================================================
  // 打印元素实体（DTO）
  // ============================================================
  interface PrintElementEntity {
    tid?: string;
    printElementType?: PrintElementTypeEntity;
    options?: PrintElementOptionEntity;
  }

  // ============================================================
  // 面板实体（DTO）
  // ============================================================
  interface PanelEntityOptions {
    index?: number;
    width?: number;
    height?: number;
    paperType?: PaperSizeKey | string;
    paperHeader?: number;
    paperFooter?: number;
    paperNumberLeft?: number;
    paperNumberTop?: number;
    paperNumberDisabled?: boolean;
    paperNumberFormat?: string;
    panelPaperRule?: PanelPaperRule;
    printElements?: PrintElementEntity[];
    rotate?: boolean;
    firstPaperFooter?: number;
    evenPaperFooter?: number;
    oddPaperFooter?: number;
    lastPaperFooter?: number;
    topOffset?: number;
    leftOffset?: number;
    fontFamily?: string;
    orient?: OrientValue;
  }

  // ============================================================
  // 模板实体（DTO）
  // ============================================================
  interface TemplateEntityOptions {
    panels?: PanelEntityOptions[];
  }

  // ============================================================
  // 打印元素类型定义
  // ============================================================
  interface PrintElementTypeDefinition {
    /** 唯一模板ID */
    tid?: string;
    /** 元素标题 */
    title?: string;
    /** 显示文本 */
    text?: string;
    /** 绑定的数据字段名 */
    field?: string;
    /** 绑定的数据字段名数组 */
    fields?: string[];
    /** 元素类型 */
    type?: ElementType;
    /** 默认数据 */
    data?: any;
    /** 选项 */
    options?: PrintElementOptionEntity;
    /** 格式化函数 */
    formatter?: FormatterFn;
    /** 样式函数 */
    styler?: StylerFn;
    /** 渲染完成后回调 */
    onRendered?: OnRenderedFn;
  }

  interface TablePrintElementTypeDefinition extends PrintElementTypeDefinition {
    type: "table";
    /** 表格列定义 */
    columns?: TableColumnOptionEntity[][];
    /** 是否可编辑 */
    editable?: boolean;
    /** 列显示是否可编辑 */
    columnDisplayEditable?: boolean;
    /** 列显示顺序是否可编辑 */
    columnDisplayIndexEditable?: boolean;
    /** 列标题是否可编辑 */
    columnTitleEditable?: boolean;
    /** 列宽是否可调整 */
    columnResizable?: boolean;
    /** 列对齐是否可编辑 */
    columnAlignEditable?: boolean;
    /** 行样式函数 */
    rowStyler?: StylerFn;
    /** 是否斑马纹 */
    striped?: boolean;
    /** 分组字段 */
    groupFields?: string[];
    /** 分组格式化函数 */
    groupFormatter?: GroupFormatterFn;
    /** 分组脚格式化函数 */
    groupFooterFormatter?: GroupFooterFormatterFn;
    /** 表格脚格式化函数 */
    footerFormatter?: FooterFormatterFn;
    /** 多列表格脚格式化函数 */
    gridColumnsFooterFormatter?: GridColumnsFooterFormatterFn;
  }

  interface TableCustomPrintElementTypeDefinition extends TablePrintElementTypeDefinition {
    type: "tableCustom";
  }

  // ============================================================
  // 元素类型组
  // ============================================================
  interface PrintElementTypeGroup {
    name: string;
    printElementTypes: BasePrintElementType[];
  }

  // ============================================================
  // 元素类型管理器
  // ============================================================
  interface PrintElementTypeManagerStatic {
    /** 获取元素类型分组 */
    getElementTypeGroups(moduleKey?: string): PrintElementTypeGroup[];
    /** 根据 tid 获取元素类型 */
    getElementType(tid: string, type?: ElementType): BasePrintElementType | undefined;
    /** 构建拖拽元素面板 */
    build(container: HTMLElement | JQuery | string, moduleKey?: string): void;
    /** 通过 HTML 构建拖拽 */
    buildByHtml(items: JQuery): void;
  }

  // ============================================================
  // 提供者接口
  // ============================================================
  interface Provider {
    addElementTypes(manager: any): void;
  }

  // ============================================================
  // 初始化选项
  // ============================================================
  interface KuPrintInitOptions {
    movingDistance?: number;
    paperHeightTrim?: number;
    providers?: Provider[];
    optionItems?: any[];
    text?: Partial<ElementTypeConfig>;
    image?: Partial<ElementTypeConfig>;
    longText?: Partial<ElementTypeConfig>;
    table?: Partial<ElementTypeConfig>;
    tableCustom?: Partial<ElementTypeConfig>;
    hline?: Partial<ElementTypeConfig>;
    vline?: Partial<ElementTypeConfig>;
    rect?: Partial<ElementTypeConfig>;
    oval?: Partial<ElementTypeConfig>;
    html?: Partial<ElementTypeConfig>;
    [key: string]: any;
  }

  // ============================================================
  // 打印模板选项
  // ============================================================
  interface PrintTemplateOptions {
    /** 模板数据（面板定义） */
    template?: TemplateEntityOptions;
    /** 可选字段列表 */
    fields?: string[];
    /** 选项设置面板容器 */
    settingContainer?: HTMLElement | JQuery | string;
    /** 分页器容器 */
    paginationContainer?: HTMLElement | JQuery | string;
    /** 是否自动保存 */
    autoSave?: boolean;
    /** 自动保存键 */
    autoSaveKey?: string;
    /** 自动保存模式：0=TID模式，1=完整JSON */
    autoSaveMode?: 0 | 1;
  }

  // ============================================================
  // 打印选项
  // ============================================================
  interface PrintOptions {
    /** 是否将图片转为base64 */
    imgToBase64?: boolean;
    /** 左偏移 */
    leftOffset?: number;
    /** 上偏移 */
    topOffset?: number;
    /** 偶数页切换页码位置 */
    paperNumberToggleInEven?: boolean;
    [key: string]: any;
  }

  // ============================================================
  // PDF 选项
  // ============================================================
  interface PdfOptions {
    scale?: number;
    width?: number;
    x?: number;
    y?: number;
    useCORS?: boolean;
    [key: string]: any;
  }

  // ============================================================
  // 联合打印选项
  // ============================================================
  interface JointTemplateOption {
    template: PrintTemplate;
    data?: Record<string, any>;
    options?: PrintOptions;
  }

  interface JointPrintOptions {
    templates?: JointTemplateOption[];
  }

  // ============================================================
  // 纸张类
  // ============================================================
  interface Paper {
    templateId: string;
    width: number;
    height: number;
    mmwidth: number;
    mmheight: number;
    paperHeader: number;
    paperFooter: number;
    index: number;
    paperNumberLeft: number;
    paperNumberTop: number;
    paperNumberDisabled: boolean | undefined;
    paperNumberFormat: string | undefined;
    referenceElement: any;

    getTarget(): JQuery;
    getPaperFooter(pageOffset: number): number;
    getContentHeight(pageOffset: number): number;
    getPanelTarget(): JQuery;
    append(el: JQuery): void;
    setOffset(left: number, top: number): void;
    setLeftOffset(v: number): void;
    setTopOffset(v: number): void;
    setFooter(first: number, even: number, odd: number, last: number): void;
    updateReferenceElement(ref: any): void;
    updatePrintLine(line: number): void;
    updatePaperNumber(current: number, total: number, toggle?: boolean): void;
    resize(w: number, h: number): void;
    design(opts?: any): void;
    displayHeight(): string;
    displayWidth(): string;
  }

  // ============================================================
  // 打印元素基类类型
  // ============================================================
  interface BasePrintElementType {
    tid?: string;
    title?: string;
    text?: string;
    field?: string;
    fields?: string[];
    type: ElementType;
    data?: any;
    options?: PrintElementOptionEntity;
    styler?: StylerFn;
    formatter?: FormatterFn;
    onRendered?: OnRenderedFn;

    getText(forProxy?: boolean): string;
    getData(): any;
    createPrintElement(opts?: PrintElementOptionEntity): BasePrintElement;
    getPrintElementTypeEntity(): PrintElementTypeEntity;
    getFields(): string[] | undefined;
    getOptions(): PrintElementOptionEntity;
  }

  // ============================================================
  // 打印元素接口
  // ============================================================
  interface BasePrintElement {
    id: string;
    printElementType: BasePrintElementType;
    options: PrintElementOption;
    templateId: string;
    designTarget: JQuery | undefined;

    getField(): string | undefined;
    getTitle(): string;
    getData(data?: Record<string, any>): any;
    getHtml(paper: Paper, data?: Record<string, any>, n?: number): any[];
    getDesignTarget(paper: Paper): JQuery;
    getProxyTarget(overrideOpts?: PrintElementOptionEntity): JQuery;
    getConfigOptions(): ElementTypeConfig;
    getPrintElementOptionItems(): any[];
    getPrintElementEntity(withTid?: boolean): PrintElementEntity;
    getFormatter(): FormatterFn | undefined;
    setTemplateId(id: string): void;
    setPanel(panel: PrintPanel): void;
    setCurrenttemplateData(data: any): void;
    showInPage(pageIdx: number, totalPages: number): boolean;
    submitOption(): void;
    design(opts?: any, paper?: Paper): void;
    delete(): void;
    css($el: JQuery, data?: any): void;
    isFixed(): boolean;
    isHeaderOrFooter(): boolean;
    onRendered(paper: Paper, target: JQuery): void;
    updatePositionByMultipleSelect(dx: number, dy: number): void;
    inRect(rect: any): boolean;
    updateSizeAndPositionOptions(left: number, top: number, width?: number, height?: number): void;
  }

  // ============================================================
  // 打印元素选项类
  // ============================================================
  interface PrintElementOption {
    left?: number;
    top?: number;
    topInDesign?: number;
    height?: number;
    width?: number;
    title?: string;
    field?: string;
    testData?: string;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    textAlign?: TextAlignValue;
    textType?: TextType;
    hideTitle?: boolean;
    color?: string;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: string;
    showInPage?: ShowInPageValue;
    unShowInPage?: ShowInPageValue;
    fixed?: boolean;
    axis?: AxisType;
    transform?: number;
    contentPaddingLeft?: number;
    contentPaddingTop?: number;
    contentPaddingRight?: number;
    contentPaddingBottom?: number;
    backgroundColor?: string;
    formatter?: string;
    styler?: string;
    src?: string;
    lHeight?: number;
    textDecoration?: TextDecorationValue;
    lineHeight?: number;
    barcodeMode?: BarcodeMode;
    longTextIndent?: number;
    leftSpaceRemoved?: boolean;
    optionsGroup?: string;
    letterSpacing?: number;
    textContentVerticalAlign?: VerticalAlignValue;
    format?: string;
    dataType?: string;
    content?: string;
    name?: string;
    [key: string]: any;

    getLeft(): number;
    getTop(): number;
    getTopInDesign(): number;
    getHeight(): number;
    getWidth(): number;
    displayLeft(): string;
    displayTop(): string;
    displayHeight(): string;
    displayWidth(): string;
    setLeft(v: number): void;
    setTop(v: number): void;
    setHeight(v: number): void;
    setWidth(v: number): void;
    copyDesignTopFromTop(): void;
    getValueFromOptionsOrDefault(key: string): any;
    getPrintElementOptionEntity(): PrintElementOptionEntity;
    getHideTitle(): boolean;
    getTextType(): TextType;
    getFontSize(): number;
    getBarcodeMode(): BarcodeMode;
    setDefault(defaults: PrintElementOptionEntity): void;
    initSizeByHtml(w: number, h: number): void;
    init(opts: Record<string, any>): void;
  }

  // ============================================================
  // 文本打印元素
  // ============================================================
  interface TextPrintElement extends BasePrintElement {
    printElementType: BasePrintElementType;
    options: PrintElementOption;
    updateTargetText($el: JQuery, title: string, data: any, n?: number): void;
  }

  // ============================================================
  // 图片打印元素
  // ============================================================
  interface ImagePrintElement extends BasePrintElement {
    options: PrintElementOption;
    updateTargetImage($el: JQuery, title: string, src: string): void;
  }

  // ============================================================
  // 长文本打印元素
  // ============================================================
  interface LongTextPrintElement extends BasePrintElement {
    options: PrintElementOption;
    getText(title: string, data: any): string;
    getHeightByData(data: any): number;
  }

  // ============================================================
  // HTML 片段打印元素
  // ============================================================
  interface HtmlPrintElement extends BasePrintElement {
    options: PrintElementOption;
    updateTargetHtml(): void;
  }

  // ============================================================
  // 线条/形状打印元素
  // ============================================================
  interface VlinePrintElement extends BasePrintElement {}
  interface HlinePrintElement extends BasePrintElement {}
  interface RectPrintElement extends BasePrintElement {}
  interface OvalPrintElement extends BasePrintElement {}

  // ============================================================
  // 表格打印元素
  // ============================================================
  interface TablePrintElement extends BasePrintElement {
    options: TablePrintElementOption;
    printElementType: TablePrintElementType;
    getColumns(): TableColumnOptionEntity[][];
    getColumnByColumnId(id: string): TableColumnOptionEntity | undefined;
  }

  interface TablePrintElementOption extends PrintElementOption {
    columns?: TableColumnOptionEntity[][];
    lHeight?: number;
    autoCompletion?: boolean;
    tableFooterRepeat?: TableFooterRepeat;
    gridColumns?: number;
    tableBorder?: string;
    tableHeaderBorder?: string;
    tableHeaderCellBorder?: string;

    getColumnByColumnId(id: string): TableColumnOptionEntity | undefined;
    makeColumnObj(): Record<string, TableColumnOptionEntity>;
    getGridColumns(): number;
  }

  // ============================================================
  // 自定义表格打印元素
  // ============================================================
  interface TableCustomPrintElement extends BasePrintElement {
    options: PrintElementOption;
    columns: TableColumnOptionEntity[][];
  }

  // ============================================================
  // 打印面板
  // ============================================================
  interface PrintPanel {
    templateId: string;
    index: number;
    width: number;
    height: number;
    paperType: PaperSizeKey | string;
    paperHeader: number;
    paperFooter: number;
    paperNumberLeft: number;
    paperNumberTop: number;
    paperNumberDisabled: boolean | undefined;
    paperNumberFormat: string | undefined;
    panelPaperRule: PanelPaperRule | undefined;
    printElements: BasePrintElement[];

    getTarget(): JQuery;
    getPanelEntity(includeTid?: boolean): PanelEntityOptions;
    getHtml(
      data: Record<string, any> | Record<string, any>[],
      opts?: PrintOptions,
      existingPapers?: Paper[],
      parentPanel?: PrintPanel,
      jointOpts?: JointPrintOptions,
    ): JQuery;
    design(opts?: any): void;
    enable(): void;
    disable(): void;
    clear(): void;
    resize(type: PaperSizeKey | string, w: number, h: number, rotate: boolean): void;
    rotatePaper(): void;
    addPrintText(opts: PrintElementEntity): void;
    addPrintImage(opts: PrintElementEntity): void;
    addPrintLongText(opts: PrintElementEntity): void;
    addPrintHtml(opts: PrintElementEntity): void;
    addPrintTable(opts: PrintElementEntity): void;
    addPrintVline(opts: PrintElementEntity): void;
    addPrintHline(opts: PrintElementEntity): void;
    addPrintRect(opts: PrintElementEntity): void;
    addPrintOval(opts: PrintElementEntity): void;
    getElementByTid(tid: string): BasePrintElement[];
    getElementByName(name: string): BasePrintElement[];
    getFieldsInPanel(): string[];
    getPrintStyle(): string;
    deletePrintElement(pe: BasePrintElement): void;
  }

  // ============================================================
  // 打印模板（核心类）
  // ============================================================
  interface PrintTemplate {
    id: string;
    printPanels: PrintPanel[];
    fields?: string[];
    editingPanel: PrintPanel;

    /** 进入设计模式 */
    design(container: HTMLElement | JQuery | string, opts?: any): void;

    /** 获取打印 HTML */
    getHtml(data?: Record<string, any> | Record<string, any>[], opts?: PrintOptions): JQuery;

    /** 获取简单 HTML（不含额外样式） */
    getSimpleHtml(data?: Record<string, any> | Record<string, any>[], opts?: PrintOptions): JQuery;

    /** 获取联合打印 HTML（多模板合并） */
    getJointHtml(
      data?: Record<string, any>,
      opts?: PrintOptions,
      jointOpts?: JointPrintOptions,
    ): JQuery;

    /** 打印 */
    print(data?: Record<string, any>, opts?: PrintOptions): void;

    /** 客户端打印（需配合打印客户端） */
    print2(data?: Record<string, any>, opts?: PrintOptions): void;

    /** 通过 HTML 打印 */
    printByHtml($html: JQuery): void;

    /** 通过 HTML 客户端打印 */
    printByHtml2($html: JQuery, opts?: PrintOptions): void;

    /** 导出 PDF */
    toPdf(data: Record<string, any>, filename: string, opts?: PdfOptions): void;

    /** 设置纸张类型/尺寸 */
    setPaper(type: PaperSizeKey | string, height?: number): void;

    /** 旋转纸张 */
    rotatePaper(): void;

    /** 添加打印面板 */
    addPrintPanel(entity?: PanelEntityOptions, immediate?: boolean): PrintPanel;

    /** 选中面板 */
    selectPanel(idx: number): void;

    /** 删除面板 */
    deletePanel(idx: number): void;

    /** 获取面板数量 */
    getPaneltotal(): number;

    /** 获取指定面板 */
    getPanel(idx?: number): PrintPanel;

    /** 获取纸张类型 */
    getPaperType(idx?: number): PaperSizeKey | string;

    /** 获取纸张方向 1=纵向, 2=横向 */
    getOrient(idx?: number): OrientValue;

    /** 获取打印样式 */
    getPrintStyle(idx?: number): string;

    /** 获取 JSON（带 TID） */
    getJsonTid(): TemplateEntityOptions;

    /** 获取完整 JSON */
    getJson(): TemplateEntityOptions;

    /** 根据 tid 获取元素 */
    getElementByTid(tid: string, panelIdx?: number): BasePrintElement[];

    /** 根据 name 获取元素 */
    getElementByName(name: string, panelIdx?: number): BasePrintElement[];

    /** 删除打印元素 */
    deletePrintElement(pe: BasePrintElement): void;

    /** 设置字段 */
    setFields(fields: string[]): void;

    /** 获取字段 */
    getFields(): string[] | undefined;

    /** 获取面板中所有字段 */
    getFieldsInPanel(): string[];

    /** 清除（保留第一个面板） */
    clear(): void;

    /** 订阅事件 */
    on(event: string, fn: (...args: any[]) => void): void;

    /** 获取打印机列表 */
    getPrinterList(): string[];

    /** 图片转 base64 */
    imageToBase64($img: JQuery): void;

    /** 加载所有图片 */
    loadAllImages($html: JQuery, cb: () => void, attempt?: number): void;
  }

  // ============================================================
  // PrintTemplate 构造函数
  // ============================================================
  interface PrintTemplateConstructor {
    new (opts?: PrintTemplateOptions): PrintTemplate;
  }

  // ============================================================
  // 全局工具
  // ============================================================
  interface KuPrintlibStatic {
    A1: PaperSize;
    A2: PaperSize;
    A3: PaperSize;
    A4: PaperSize;
    A5: PaperSize;
    A6: PaperSize;
    A7: PaperSize;
    A8: PaperSize;
    B1: PaperSize;
    B2: PaperSize;
    B3: PaperSize;
    B4: PaperSize;
    B5: PaperSize;
    B6: PaperSize;
    B7: PaperSize;
    B8: PaperSize;
    guid(): string;
    imageToBase64($img: JQuery): void;
    transformImg($imgs: JQuery): void;
    getPrintTemplateById(id: string): PrintTemplate | undefined;
    setPrintTemplateById(id: string, tmpl: PrintTemplate): void;
  }

  // ============================================================
  // 全局配置
  // ============================================================
  interface KuPrintConfigStatic {
    movingDistance: number;
    paperHeightTrim: number;
    providers: Provider[];
    text: ElementTypeConfig;
    image: ElementTypeConfig;
    longText: ElementTypeConfig;
    table: ElementTypeConfig;
    tableCustom: ElementTypeConfig;
    hline: ElementTypeConfig;
    vline: ElementTypeConfig;
    rect: ElementTypeConfig;
    oval: ElementTypeConfig;
    html: ElementTypeConfig;
    init(cfg?: KuPrintInitOptions): void;
  }

  // ============================================================
  // 打印工具函数
  // ============================================================
  interface HinnnPt {
    dpi: number;
    toPx(pt: number): number;
    getDpi(): number;
  }
  interface HinnnPx {
    dpi: number;
    toPt(px: number): number;
    getDpi(): number;
  }
  interface HinnnMm {
    toPt(mm: number): number;
    toPx(mm: number): number;
  }
}

// ============================================================
// jQuery 插件类型扩展
// ============================================================
interface JQueryStatic {
  kuprintparser: {
    parseOptions(el: HTMLElement, keys?: (string | Record<string, string>)[]): Record<string, any>;
  };
}

interface JQuery {
  // --- hidraggable ---
  hidraggable(opts?: kuprint.HidraggableOptions): JQuery;
  hidraggable(method: "options"): kuprint.HidraggableOptions;
  hidraggable(method: "proxy"): JQuery;
  hidraggable(method: "enable" | "disable"): JQuery;

  // --- hidroppable ---
  hidroppable(opts?: kuprint.HidroppableOptions): JQuery;
  hidroppable(method: "options"): kuprint.HidroppableOptions;
  hidroppable(method: "enable" | "disable"): JQuery;

  // --- hireizeable ---
  hireizeable(opts?: kuprint.HireizeableOptions): JQuery;
  hireizeable(method: "options"): kuprint.HireizeableOptions;
  hireizeable(method: "enable" | "disable"): JQuery;

  // --- hiwprint ---
  hiwprint(opts?: kuprint.HiwprintOptions): void;

  // --- dragLengthC / dragLengthCNum ---
  dragLengthC(val: number, opts: { moveUnit: string; minMove?: number }): string;
  dragLengthCNum(val: number, opts?: { moveUnit: string; minMove?: number }): number;
}

declare namespace kuprint {
  interface HidraggableOptions {
    proxy?: "clone" | ((el: HTMLElement) => JQuery) | null;
    revert?: boolean;
    cursor?: string;
    deltaX?: number | null;
    deltaY?: number | null;
    handle?: string | JQuery | null;
    disabled?: boolean;
    edge?: number;
    axis?: "h" | "v" | null;
    moveUnit?: string;
    minMove?: number;
    onBeforeDrag?: (e: JQuery.Event) => boolean | void;
    onStartDrag?: (e: JQuery.Event) => void;
    onDrag?: (e: JQuery.Event, left: number, top: number) => number | void;
    onStopDrag?: (e: JQuery.Event) => void;
  }

  interface HidroppableOptions {
    accept?: string;
    disabled?: boolean;
    onDragEnter?: (e: JQuery.Event, target: HTMLElement) => void;
    onDragOver?: (e: JQuery.Event, target: HTMLElement) => void;
    onDragLeave?: (e: JQuery.Event, target: HTMLElement) => void;
    onDrop?: (e: JQuery.Event, target: HTMLElement) => void;
  }

  interface HireizeableOptions {
    showPoints?: string[];
    noContainer?: boolean;
    minResize?: number;
    stage?: HTMLElement | JQuery | string;
    onBeforeResize?: () => void;
    onResize?: (e: JQuery.Event, height: number, width: number, top: number, left: number) => void;
    onStopResize?: () => void;
  }

  interface HiwprintOptions {
    /** 导入的 CSS 样式 */
    importCss?: boolean;
    /** 自定义样式字符串 */
    style?: string;
    /** 打印前回调 */
    beforePrint?: () => void;
    /** 打印后回调 */
    afterPrint?: () => void;
    [key: string]: any;
  }
}

// ============================================================
// 全局声明
// ============================================================
declare var PrintTemplate: kuprint.PrintTemplateConstructor;
declare var PrintElementTypeManager: kuprint.PrintElementTypeManagerStatic;
declare var ElementTypeManager: {
  instance: {
    addPrintElementTypes(moduleKey: string, groups: kuprint.PrintElementTypeGroup[]): void;
    getElementTypeGroups(moduleKey: string): kuprint.PrintElementTypeGroup[];
    getElementType(tid: string): kuprint.BasePrintElementType | undefined;
  };
};
declare var PrintElementTypeGroup: {
  new (name: string, types: kuprint.PrintElementTypeDefinition[]): kuprint.PrintElementTypeGroup;
};
declare var PrintElementTypeCreator: {
  createPrintElementType(opts: kuprint.PrintElementTypeDefinition): kuprint.BasePrintElementType;
};
declare var SimplePrintElementType: {
  new (opts: kuprint.PrintElementTypeDefinition): kuprint.BasePrintElementType;
};
declare var BasePrintElementType: {
  new (opts: kuprint.PrintElementTypeDefinition): kuprint.BasePrintElementType;
};
declare var TablePrintElementType: {
  new (opts: kuprint.TablePrintElementTypeDefinition): kuprint.BasePrintElementType;
};
declare var TableCustomPrintElementType: {
  new (opts: kuprint.TableCustomPrintElementTypeDefinition): kuprint.BasePrintElementType;
};
declare var KuPrintConfig: kuprint.KuPrintConfigStatic;
declare var KuPrintlib: kuprint.KuPrintlibStatic;
declare var PrintPanel: kuprint.PrintPanel;
declare var PanelEntity: {
  new (opts: kuprint.PanelEntityOptions): kuprint.PanelEntityOptions;
};
declare var TemplateEntity: {
  new (t: kuprint.TemplateEntityOptions): kuprint.TemplateEntityOptions;
};

// ============================================================
// Window 扩展
// ============================================================
interface Window {
  KUPRINT_CONFIG?: kuprint.KuPrintInitOptions;
  hiwebSocket?: {
    opened: boolean;
    send(data: any): void;
    getPrinterList(): string[];
  };
  hiLocalStorage?: {
    saveLocalData(key: string, value: string): void;
  };
  JsBarcode?: any;
}
