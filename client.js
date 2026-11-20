(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/react-shim.cjs
  var require_react_shim = __commonJS({
    "src/react-shim.cjs"(exports, module) {
      module.exports = globalThis.__BOOK_LOOM_REACT__;
    }
  });

  // node_modules/lucide-react/dist/esm/shared/src/utils.js
  var toKebabCase, mergeClasses;
  var init_utils = __esm({
    "node_modules/lucide-react/dist/esm/shared/src/utils.js"() {
      toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      mergeClasses = (...classes) => classes.filter((className, index2, array) => {
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index2;
      }).join(" ").trim();
    }
  });

  // node_modules/lucide-react/dist/esm/defaultAttributes.js
  var defaultAttributes;
  var init_defaultAttributes = __esm({
    "node_modules/lucide-react/dist/esm/defaultAttributes.js"() {
      defaultAttributes = {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      };
    }
  });

  // node_modules/lucide-react/dist/esm/Icon.js
  var import_react, Icon;
  var init_Icon = __esm({
    "node_modules/lucide-react/dist/esm/Icon.js"() {
      import_react = __toESM(require_react_shim());
      init_defaultAttributes();
      init_utils();
      Icon = (0, import_react.forwardRef)(
        ({
          color = "currentColor",
          size = 24,
          strokeWidth = 2,
          absoluteStrokeWidth,
          className = "",
          children,
          iconNode,
          ...rest
        }, ref) => {
          return (0, import_react.createElement)(
            "svg",
            {
              ref,
              ...defaultAttributes,
              width: size,
              height: size,
              stroke: color,
              strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
              className: mergeClasses("lucide", className),
              ...rest
            },
            [
              ...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)),
              ...Array.isArray(children) ? children : [children]
            ]
          );
        }
      );
    }
  });

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var import_react2, createLucideIcon;
  var init_createLucideIcon = __esm({
    "node_modules/lucide-react/dist/esm/createLucideIcon.js"() {
      import_react2 = __toESM(require_react_shim());
      init_utils();
      init_Icon();
      createLucideIcon = (iconName, iconNode) => {
        const Component = (0, import_react2.forwardRef)(
          ({ className, ...props }, ref) => (0, import_react2.createElement)(Icon, {
            ref,
            iconNode,
            className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
            ...props
          })
        );
        Component.displayName = `${iconName}`;
        return Component;
      };
    }
  });

  // node_modules/lucide-react/dist/esm/icons/align-left.js
  var AlignLeft;
  var init_align_left = __esm({
    "node_modules/lucide-react/dist/esm/icons/align-left.js"() {
      init_createLucideIcon();
      AlignLeft = createLucideIcon("AlignLeft", [
        ["path", { d: "M15 12H3", key: "6jk70r" }],
        ["path", { d: "M17 18H3", key: "1amg6g" }],
        ["path", { d: "M21 6H3", key: "1jwq7v" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/book-open-text.js
  var BookOpenText;
  var init_book_open_text = __esm({
    "node_modules/lucide-react/dist/esm/icons/book-open-text.js"() {
      init_createLucideIcon();
      BookOpenText = createLucideIcon("BookOpenText", [
        ["path", { d: "M12 7v14", key: "1akyts" }],
        ["path", { d: "M16 12h2", key: "7q9ll5" }],
        ["path", { d: "M16 8h2", key: "msurwy" }],
        [
          "path",
          {
            d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
            key: "ruj8y"
          }
        ],
        ["path", { d: "M6 12h2", key: "32wvfc" }],
        ["path", { d: "M6 8h2", key: "30oboj" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/book-open.js
  var BookOpen;
  var init_book_open = __esm({
    "node_modules/lucide-react/dist/esm/icons/book-open.js"() {
      init_createLucideIcon();
      BookOpen = createLucideIcon("BookOpen", [
        ["path", { d: "M12 7v14", key: "1akyts" }],
        [
          "path",
          {
            d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
            key: "ruj8y"
          }
        ]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/check.js
  var Check;
  var init_check = __esm({
    "node_modules/lucide-react/dist/esm/icons/check.js"() {
      init_createLucideIcon();
      Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/chevron-down.js
  var ChevronDown;
  var init_chevron_down = __esm({
    "node_modules/lucide-react/dist/esm/icons/chevron-down.js"() {
      init_createLucideIcon();
      ChevronDown = createLucideIcon("ChevronDown", [
        ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/chevron-right.js
  var ChevronRight;
  var init_chevron_right = __esm({
    "node_modules/lucide-react/dist/esm/icons/chevron-right.js"() {
      init_createLucideIcon();
      ChevronRight = createLucideIcon("ChevronRight", [
        ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/circle-alert.js
  var CircleAlert;
  var init_circle_alert = __esm({
    "node_modules/lucide-react/dist/esm/icons/circle-alert.js"() {
      init_createLucideIcon();
      CircleAlert = createLucideIcon("CircleAlert", [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
        ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/cloud.js
  var Cloud;
  var init_cloud = __esm({
    "node_modules/lucide-react/dist/esm/icons/cloud.js"() {
      init_createLucideIcon();
      Cloud = createLucideIcon("Cloud", [
        ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/columns-3.js
  var Columns3;
  var init_columns_3 = __esm({
    "node_modules/lucide-react/dist/esm/icons/columns-3.js"() {
      init_createLucideIcon();
      Columns3 = createLucideIcon("Columns3", [
        ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
        ["path", { d: "M9 3v18", key: "fh3hqa" }],
        ["path", { d: "M15 3v18", key: "14nvp0" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/file-up.js
  var FileUp;
  var init_file_up = __esm({
    "node_modules/lucide-react/dist/esm/icons/file-up.js"() {
      init_createLucideIcon();
      FileUp = createLucideIcon("FileUp", [
        ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
        ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
        ["path", { d: "M12 12v6", key: "3ahymv" }],
        ["path", { d: "m15 15-3-3-3 3", key: "15xj92" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/focus.js
  var Focus;
  var init_focus = __esm({
    "node_modules/lucide-react/dist/esm/icons/focus.js"() {
      init_createLucideIcon();
      Focus = createLucideIcon("Focus", [
        ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
        ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
        ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
        ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
        ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/git-fork.js
  var GitFork;
  var init_git_fork = __esm({
    "node_modules/lucide-react/dist/esm/icons/git-fork.js"() {
      init_createLucideIcon();
      GitFork = createLucideIcon("GitFork", [
        ["circle", { cx: "12", cy: "18", r: "3", key: "1mpf1b" }],
        ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
        ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
        ["path", { d: "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9", key: "1uq4wg" }],
        ["path", { d: "M12 12v3", key: "158kv8" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/git-merge.js
  var GitMerge;
  var init_git_merge = __esm({
    "node_modules/lucide-react/dist/esm/icons/git-merge.js"() {
      init_createLucideIcon();
      GitMerge = createLucideIcon("GitMerge", [
        ["circle", { cx: "18", cy: "18", r: "3", key: "1xkwt0" }],
        ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
        ["path", { d: "M6 21V9a9 9 0 0 0 9 9", key: "7kw0sc" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/highlighter.js
  var Highlighter;
  var init_highlighter = __esm({
    "node_modules/lucide-react/dist/esm/icons/highlighter.js"() {
      init_createLucideIcon();
      Highlighter = createLucideIcon("Highlighter", [
        ["path", { d: "m9 11-6 6v3h9l3-3", key: "1a3l36" }],
        ["path", { d: "m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4", key: "14a9rk" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/loader-circle.js
  var LoaderCircle;
  var init_loader_circle = __esm({
    "node_modules/lucide-react/dist/esm/icons/loader-circle.js"() {
      init_createLucideIcon();
      LoaderCircle = createLucideIcon("LoaderCircle", [
        ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/network.js
  var Network;
  var init_network = __esm({
    "node_modules/lucide-react/dist/esm/icons/network.js"() {
      init_createLucideIcon();
      Network = createLucideIcon("Network", [
        ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1", key: "4q2zg0" }],
        ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1", key: "8cvhb9" }],
        ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1", key: "1egb70" }],
        ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", key: "1jsf9p" }],
        ["path", { d: "M12 12V8", key: "2874zd" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/panel-bottom-open.js
  var PanelBottomOpen;
  var init_panel_bottom_open = __esm({
    "node_modules/lucide-react/dist/esm/icons/panel-bottom-open.js"() {
      init_createLucideIcon();
      PanelBottomOpen = createLucideIcon("PanelBottomOpen", [
        ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
        ["path", { d: "M3 15h18", key: "5xshup" }],
        ["path", { d: "m9 10 3-3 3 3", key: "11gsxs" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/pencil.js
  var Pencil;
  var init_pencil = __esm({
    "node_modules/lucide-react/dist/esm/icons/pencil.js"() {
      init_createLucideIcon();
      Pencil = createLucideIcon("Pencil", [
        [
          "path",
          {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
            key: "1a8usu"
          }
        ],
        ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/scissors.js
  var Scissors;
  var init_scissors = __esm({
    "node_modules/lucide-react/dist/esm/icons/scissors.js"() {
      init_createLucideIcon();
      Scissors = createLucideIcon("Scissors", [
        ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
        ["path", { d: "M8.12 8.12 12 12", key: "1alkpv" }],
        ["path", { d: "M20 4 8.12 15.88", key: "xgtan2" }],
        ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
        ["path", { d: "M14.8 14.8 20 20", key: "ptml3r" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/search.js
  var Search;
  var init_search = __esm({
    "node_modules/lucide-react/dist/esm/icons/search.js"() {
      init_createLucideIcon();
      Search = createLucideIcon("Search", [
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
        ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/settings-2.js
  var Settings2;
  var init_settings_2 = __esm({
    "node_modules/lucide-react/dist/esm/icons/settings-2.js"() {
      init_createLucideIcon();
      Settings2 = createLucideIcon("Settings2", [
        ["path", { d: "M20 7h-9", key: "3s1dr2" }],
        ["path", { d: "M14 17H5", key: "gfn3mx" }],
        ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
        ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/sparkles.js
  var Sparkles;
  var init_sparkles = __esm({
    "node_modules/lucide-react/dist/esm/icons/sparkles.js"() {
      init_createLucideIcon();
      Sparkles = createLucideIcon("Sparkles", [
        [
          "path",
          {
            d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
            key: "4pj2yx"
          }
        ],
        ["path", { d: "M20 3v4", key: "1olli1" }],
        ["path", { d: "M22 5h-4", key: "1gvqau" }],
        ["path", { d: "M4 17v2", key: "vumght" }],
        ["path", { d: "M5 18H3", key: "zchphs" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/trash-2.js
  var Trash2;
  var init_trash_2 = __esm({
    "node_modules/lucide-react/dist/esm/icons/trash-2.js"() {
      init_createLucideIcon();
      Trash2 = createLucideIcon("Trash2", [
        ["path", { d: "M3 6h18", key: "d0wm0j" }],
        ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
        ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
        ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
        ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/underline.js
  var Underline;
  var init_underline = __esm({
    "node_modules/lucide-react/dist/esm/icons/underline.js"() {
      init_createLucideIcon();
      Underline = createLucideIcon("Underline", [
        ["path", { d: "M6 4v6a6 6 0 0 0 12 0V4", key: "9kb039" }],
        ["line", { x1: "4", x2: "20", y1: "20", y2: "20", key: "nun2al" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/waypoints.js
  var Waypoints;
  var init_waypoints = __esm({
    "node_modules/lucide-react/dist/esm/icons/waypoints.js"() {
      init_createLucideIcon();
      Waypoints = createLucideIcon("Waypoints", [
        ["circle", { cx: "12", cy: "4.5", r: "2.5", key: "r5ysbb" }],
        ["path", { d: "m10.2 6.3-3.9 3.9", key: "1nzqf6" }],
        ["circle", { cx: "4.5", cy: "12", r: "2.5", key: "jydg6v" }],
        ["path", { d: "M7 12h10", key: "b7w52i" }],
        ["circle", { cx: "19.5", cy: "12", r: "2.5", key: "1piiel" }],
        ["path", { d: "m13.8 17.7 3.9-3.9", key: "1wyg1y" }],
        ["circle", { cx: "12", cy: "19.5", r: "2.5", key: "13o1pw" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/x.js
  var X;
  var init_x = __esm({
    "node_modules/lucide-react/dist/esm/icons/x.js"() {
      init_createLucideIcon();
      X = createLucideIcon("X", [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
      ]);
    }
  });

  // node_modules/lucide-react/dist/esm/lucide-react.js
  var init_lucide_react = __esm({
    "node_modules/lucide-react/dist/esm/lucide-react.js"() {
      init_circle_alert();
      init_columns_3();
      init_loader_circle();
      init_sparkles();
      init_align_left();
      init_book_open_text();
      init_book_open();
      init_check();
      init_chevron_down();
      init_chevron_right();
      init_cloud();
      init_file_up();
      init_focus();
      init_git_fork();
      init_git_merge();
      init_highlighter();
      init_network();
      init_panel_bottom_open();
      init_pencil();
      init_scissors();
      init_search();
      init_settings_2();
      init_trash_2();
      init_underline();
      init_waypoints();
      init_x();
    }
  });

  // node_modules/d3-quadtree/dist/d3-quadtree.mjs
  function tree_add(d) {
    const x = +this._x.call(null, d), y = +this._y.call(null, d);
    return add(this.cover(x, y), x, y, d);
  }
  function add(tree, x, y, d) {
    if (isNaN(x) || isNaN(y)) return tree;
    var parent, node = tree._root, leaf = { data: d }, x0 = tree._x0, y0 = tree._y0, x1 = tree._x1, y1 = tree._y1, xm, ym, xp, yp, right, bottom, i, j;
    if (!node) return tree._root = leaf, tree;
    while (node.length) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;
      else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;
      else y1 = ym;
      if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
    }
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
    do {
      parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;
      else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;
      else y1 = ym;
    } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));
    return parent[j] = node, parent[i] = leaf, tree;
  }
  function addAll(data) {
    if (!Array.isArray(data)) data = Array.from(data);
    const n = data.length;
    const xz = new Float64Array(n);
    const yz = new Float64Array(n);
    let x0 = Infinity, y0 = x0, x1 = -x0, y1 = x1;
    for (let i = 0, d, x, y; i < n; ++i) {
      if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) {
        xz[i] = NaN;
        continue;
      }
      xz[i] = x;
      yz[i] = y;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    if (x0 > x1 || y0 > y1) return this;
    this.cover(x0, y0).cover(x1, y1);
    for (let i = 0; i < n; ++i) {
      add(this, xz[i], yz[i], data[i]);
    }
    return this;
  }
  function tree_cover(x, y) {
    if (isNaN(x = +x) || isNaN(y = +y)) return this;
    var x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
    if (isNaN(x0)) {
      x1 = (x0 = Math.floor(x)) + 1;
      y1 = (y0 = Math.floor(y)) + 1;
    } else {
      var z = x1 - x0 || 1, node = this._root, parent, i;
      while (x0 > x || x >= x1 || y0 > y || y >= y1) {
        i = (y < y0) << 1 | x < x0;
        parent = new Array(4), parent[i] = node, node = parent, z *= 2;
        switch (i) {
          case 0:
            x1 = x0 + z, y1 = y0 + z;
            break;
          case 1:
            x0 = x1 - z, y1 = y0 + z;
            break;
          case 2:
            x1 = x0 + z, y0 = y1 - z;
            break;
          case 3:
            x0 = x1 - z, y0 = y1 - z;
            break;
        }
      }
      if (this._root && this._root.length) this._root = node;
    }
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    return this;
  }
  function tree_data() {
    var data = [];
    this.visit(function(node) {
      if (!node.length) do
        data.push(node.data);
      while (node = node.next);
    });
    return data;
  }
  function tree_extent(_) {
    return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
  }
  function Quad(node, x0, y0, x1, y1) {
    this.node = node;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }
  function tree_find(x, y, radius) {
    var data, x0 = this._x0, y0 = this._y0, x1, y1, x2, y2, x3 = this._x1, y3 = this._y1, quads = [], node = this._root, q, i;
    if (node) quads.push(new Quad(node, x0, y0, x3, y3));
    if (radius == null) radius = Infinity;
    else {
      x0 = x - radius, y0 = y - radius;
      x3 = x + radius, y3 = y + radius;
      radius *= radius;
    }
    while (q = quads.pop()) {
      if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x2 = q.x1) < x0 || (y2 = q.y1) < y0) continue;
      if (node.length) {
        var xm = (x1 + x2) / 2, ym = (y1 + y2) / 2;
        quads.push(
          new Quad(node[3], xm, ym, x2, y2),
          new Quad(node[2], x1, ym, xm, y2),
          new Quad(node[1], xm, y1, x2, ym),
          new Quad(node[0], x1, y1, xm, ym)
        );
        if (i = (y >= ym) << 1 | x >= xm) {
          q = quads[quads.length - 1];
          quads[quads.length - 1] = quads[quads.length - 1 - i];
          quads[quads.length - 1 - i] = q;
        }
      } else {
        var dx = x - +this._x.call(null, node.data), dy = y - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
        if (d2 < radius) {
          var d = Math.sqrt(radius = d2);
          x0 = x - d, y0 = y - d;
          x3 = x + d, y3 = y + d;
          data = node.data;
        }
      }
    }
    return data;
  }
  function tree_remove(d) {
    if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this;
    var parent, node = this._root, retainer, previous, next, x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1, x, y, xm, ym, right, bottom, i, j;
    if (!node) return this;
    if (node.length) while (true) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;
      else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;
      else y1 = ym;
      if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
      if (!node.length) break;
      if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
    }
    while (node.data !== d) if (!(previous = node, node = node.next)) return this;
    if (next = node.next) delete node.next;
    if (previous) return next ? previous.next = next : delete previous.next, this;
    if (!parent) return this._root = next, this;
    next ? parent[i] = next : delete parent[i];
    if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
      if (retainer) retainer[j] = node;
      else this._root = node;
    }
    return this;
  }
  function removeAll(data) {
    for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
    return this;
  }
  function tree_root() {
    return this._root;
  }
  function tree_size() {
    var size = 0;
    this.visit(function(node) {
      if (!node.length) do
        ++size;
      while (node = node.next);
    });
    return size;
  }
  function tree_visit(callback) {
    var quads = [], q, node = this._root, child, x0, y0, x1, y1;
    if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
        var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      }
    }
    return this;
  }
  function tree_visitAfter(callback) {
    var quads = [], next = [], q;
    if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      var node = q.node;
      if (node.length) {
        var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      }
      next.push(q);
    }
    while (q = next.pop()) {
      callback(q.node, q.x0, q.y0, q.x1, q.y1);
    }
    return this;
  }
  function defaultX(d) {
    return d[0];
  }
  function tree_x(_) {
    return arguments.length ? (this._x = _, this) : this._x;
  }
  function defaultY(d) {
    return d[1];
  }
  function tree_y(_) {
    return arguments.length ? (this._y = _, this) : this._y;
  }
  function quadtree(nodes, x, y) {
    var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
  }
  function Quadtree(x, y, x0, y0, x1, y1) {
    this._x = x;
    this._y = y;
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    this._root = void 0;
  }
  function leaf_copy(leaf) {
    var copy = { data: leaf.data }, next = copy;
    while (leaf = leaf.next) next = next.next = { data: leaf.data };
    return copy;
  }
  var treeProto;
  var init_d3_quadtree = __esm({
    "node_modules/d3-quadtree/dist/d3-quadtree.mjs"() {
      treeProto = quadtree.prototype = Quadtree.prototype;
      treeProto.copy = function() {
        var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1), node = this._root, nodes, child;
        if (!node) return copy;
        if (!node.length) return copy._root = leaf_copy(node), copy;
        nodes = [{ source: node, target: copy._root = new Array(4) }];
        while (node = nodes.pop()) {
          for (var i = 0; i < 4; ++i) {
            if (child = node.source[i]) {
              if (child.length) nodes.push({ source: child, target: node.target[i] = new Array(4) });
              else node.target[i] = leaf_copy(child);
            }
          }
        }
        return copy;
      };
      treeProto.add = tree_add;
      treeProto.addAll = addAll;
      treeProto.cover = tree_cover;
      treeProto.data = tree_data;
      treeProto.extent = tree_extent;
      treeProto.find = tree_find;
      treeProto.remove = tree_remove;
      treeProto.removeAll = removeAll;
      treeProto.root = tree_root;
      treeProto.size = tree_size;
      treeProto.visit = tree_visit;
      treeProto.visitAfter = tree_visitAfter;
      treeProto.x = tree_x;
      treeProto.y = tree_y;
    }
  });

  // node_modules/d3-dispatch/dist/d3-dispatch.mjs
  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }
  function Dispatch(_) {
    this._ = _;
  }
  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return { type: t, name };
    });
  }
  function get(type, name) {
    for (var i = 0, n = type.length, c2; i < n; ++i) {
      if ((c2 = type[i]).name === name) {
        return c2.value;
      }
    }
  }
  function set(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({ name, value: callback });
    return type;
  }
  var noop;
  var init_d3_dispatch = __esm({
    "node_modules/d3-dispatch/dist/d3-dispatch.mjs"() {
      noop = { value: () => {
      } };
      Dispatch.prototype = dispatch.prototype = {
        constructor: Dispatch,
        on: function(typename, callback) {
          var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
          if (arguments.length < 2) {
            while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
            return;
          }
          if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
          while (++i < n) {
            if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
            else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
          }
          return this;
        },
        copy: function() {
          var copy = {}, _ = this._;
          for (var t in _) copy[t] = _[t].slice();
          return new Dispatch(copy);
        },
        call: function(type, that) {
          if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
          if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
          for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
        },
        apply: function(type, that, args) {
          if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
          for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
        }
      };
    }
  });

  // node_modules/d3-timer/dist/d3-timer.mjs
  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }
  function clearNow() {
    clockNow = 0;
  }
  function Timer() {
    this._call = this._time = this._next = null;
  }
  function timer(callback, delay, time) {
    var t = new Timer();
    t.restart(callback, delay, time);
    return t;
  }
  function timerFlush() {
    now();
    ++frame;
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
      t = t._next;
    }
    --frame;
  }
  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout$1 = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }
  function poke() {
    var now2 = clock.now(), delay = now2 - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
  }
  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }
  function sleep(time) {
    if (frame) return;
    if (timeout$1) timeout$1 = clearTimeout(timeout$1);
    var delay = time - clockNow;
    if (delay > 24) {
      if (time < Infinity) timeout$1 = setTimeout(wake, Math.ceil(time - clock.now() - clockSkew) + 1);
      if (interval$1) interval$1 = clearInterval(interval$1);
    } else {
      if (!interval$1) clockLast = clock.now(), interval$1 = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }
  var frame, timeout$1, interval$1, pokeDelay, taskHead, taskTail, clockLast, clockNow, clockSkew, clock, setFrame;
  var init_d3_timer = __esm({
    "node_modules/d3-timer/dist/d3-timer.mjs"() {
      frame = 0;
      timeout$1 = 0;
      interval$1 = 0;
      pokeDelay = 1e3;
      clockLast = 0;
      clockNow = 0;
      clockSkew = 0;
      clock = typeof performance === "object" && performance.now ? performance : Date;
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
        setTimeout(f, 17);
      };
      Timer.prototype = timer.prototype = {
        constructor: Timer,
        restart: function(callback, delay, time) {
          if (typeof callback !== "function") throw new TypeError("callback is not a function");
          time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
          if (!this._next && taskTail !== this) {
            if (taskTail) taskTail._next = this;
            else taskHead = this;
            taskTail = this;
          }
          this._call = callback;
          this._time = time;
          sleep();
        },
        stop: function() {
          if (this._call) {
            this._call = null;
            this._time = Infinity;
            sleep();
          }
        }
      };
    }
  });

  // node_modules/d3-force/dist/d3-force.mjs
  function center(x, y) {
    var nodes, strength = 1;
    if (x == null) x = 0;
    if (y == null) y = 0;
    function force() {
      var i, n = nodes.length, node, sx = 0, sy = 0;
      for (i = 0; i < n; ++i) {
        node = nodes[i], sx += node.x, sy += node.y;
      }
      for (sx = (sx / n - x) * strength, sy = (sy / n - y) * strength, i = 0; i < n; ++i) {
        node = nodes[i], node.x -= sx, node.y -= sy;
      }
    }
    force.initialize = function(_) {
      nodes = _;
    };
    force.x = function(_) {
      return arguments.length ? (x = +_, force) : x;
    };
    force.y = function(_) {
      return arguments.length ? (y = +_, force) : y;
    };
    force.strength = function(_) {
      return arguments.length ? (strength = +_, force) : strength;
    };
    return force;
  }
  function constant(x) {
    return function() {
      return x;
    };
  }
  function jiggle(random) {
    return (random() - 0.5) * 1e-6;
  }
  function x$2(d) {
    return d.x + d.vx;
  }
  function y$2(d) {
    return d.y + d.vy;
  }
  function collide(radius) {
    var nodes, radii, random, strength = 1, iterations = 1;
    if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);
    function force() {
      var i, n = nodes.length, tree, node, xi, yi, ri, ri2;
      for (var k = 0; k < iterations; ++k) {
        tree = quadtree(nodes, x$2, y$2).visitAfter(prepare);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          ri = radii[node.index], ri2 = ri * ri;
          xi = node.x + node.vx;
          yi = node.y + node.vy;
          tree.visit(apply);
        }
      }
      function apply(quad, x0, y0, x1, y1) {
        var data = quad.data, rj = quad.r, r = ri + rj;
        if (data) {
          if (data.index > node.index) {
            var x = xi - data.x - data.vx, y = yi - data.y - data.vy, l = x * x + y * y;
            if (l < r * r) {
              if (x === 0) x = jiggle(random), l += x * x;
              if (y === 0) y = jiggle(random), l += y * y;
              l = (r - (l = Math.sqrt(l))) / l * strength;
              node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
              node.vy += (y *= l) * r;
              data.vx -= x * (r = 1 - r);
              data.vy -= y * r;
            }
          }
          return;
        }
        return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
      }
    }
    function prepare(quad) {
      if (quad.data) return quad.r = radii[quad.data.index];
      for (var i = quad.r = 0; i < 4; ++i) {
        if (quad[i] && quad[i].r > quad.r) {
          quad.r = quad[i].r;
        }
      }
    }
    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, node;
      radii = new Array(n);
      for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
    }
    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };
    force.iterations = function(_) {
      return arguments.length ? (iterations = +_, force) : iterations;
    };
    force.strength = function(_) {
      return arguments.length ? (strength = +_, force) : strength;
    };
    force.radius = function(_) {
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
    };
    return force;
  }
  function index(d) {
    return d.index;
  }
  function find(nodeById, nodeId) {
    var node = nodeById.get(nodeId);
    if (!node) throw new Error("node not found: " + nodeId);
    return node;
  }
  function link(links) {
    var id = index, strength = defaultStrength, strengths, distance = constant(30), distances, nodes, count, bias, random, iterations = 1;
    if (links == null) links = [];
    function defaultStrength(link2) {
      return 1 / Math.min(count[link2.source.index], count[link2.target.index]);
    }
    function force(alpha) {
      for (var k = 0, n = links.length; k < iterations; ++k) {
        for (var i = 0, link2, source, target, x, y, l, b; i < n; ++i) {
          link2 = links[i], source = link2.source, target = link2.target;
          x = target.x + target.vx - source.x - source.vx || jiggle(random);
          y = target.y + target.vy - source.y - source.vy || jiggle(random);
          l = Math.sqrt(x * x + y * y);
          l = (l - distances[i]) / l * alpha * strengths[i];
          x *= l, y *= l;
          target.vx -= x * (b = bias[i]);
          target.vy -= y * b;
          source.vx += x * (b = 1 - b);
          source.vy += y * b;
        }
      }
    }
    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, m2 = links.length, nodeById = new Map(nodes.map((d, i2) => [id(d, i2, nodes), d])), link2;
      for (i = 0, count = new Array(n); i < m2; ++i) {
        link2 = links[i], link2.index = i;
        if (typeof link2.source !== "object") link2.source = find(nodeById, link2.source);
        if (typeof link2.target !== "object") link2.target = find(nodeById, link2.target);
        count[link2.source.index] = (count[link2.source.index] || 0) + 1;
        count[link2.target.index] = (count[link2.target.index] || 0) + 1;
      }
      for (i = 0, bias = new Array(m2); i < m2; ++i) {
        link2 = links[i], bias[i] = count[link2.source.index] / (count[link2.source.index] + count[link2.target.index]);
      }
      strengths = new Array(m2), initializeStrength();
      distances = new Array(m2), initializeDistance();
    }
    function initializeStrength() {
      if (!nodes) return;
      for (var i = 0, n = links.length; i < n; ++i) {
        strengths[i] = +strength(links[i], i, links);
      }
    }
    function initializeDistance() {
      if (!nodes) return;
      for (var i = 0, n = links.length; i < n; ++i) {
        distances[i] = +distance(links[i], i, links);
      }
    }
    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };
    force.links = function(_) {
      return arguments.length ? (links = _, initialize(), force) : links;
    };
    force.id = function(_) {
      return arguments.length ? (id = _, force) : id;
    };
    force.iterations = function(_) {
      return arguments.length ? (iterations = +_, force) : iterations;
    };
    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initializeStrength(), force) : strength;
    };
    force.distance = function(_) {
      return arguments.length ? (distance = typeof _ === "function" ? _ : constant(+_), initializeDistance(), force) : distance;
    };
    return force;
  }
  function lcg() {
    let s = 1;
    return () => (s = (a * s + c) % m) / m;
  }
  function x$1(d) {
    return d.x;
  }
  function y$1(d) {
    return d.y;
  }
  function simulation(nodes) {
    var simulation2, alpha = 1, alphaMin = 1e-3, alphaDecay = 1 - Math.pow(alphaMin, 1 / 300), alphaTarget = 0, velocityDecay = 0.6, forces = /* @__PURE__ */ new Map(), stepper = timer(step), event = dispatch("tick", "end"), random = lcg();
    if (nodes == null) nodes = [];
    function step() {
      tick();
      event.call("tick", simulation2);
      if (alpha < alphaMin) {
        stepper.stop();
        event.call("end", simulation2);
      }
    }
    function tick(iterations) {
      var i, n = nodes.length, node;
      if (iterations === void 0) iterations = 1;
      for (var k = 0; k < iterations; ++k) {
        alpha += (alphaTarget - alpha) * alphaDecay;
        forces.forEach(function(force) {
          force(alpha);
        });
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          if (node.fx == null) node.x += node.vx *= velocityDecay;
          else node.x = node.fx, node.vx = 0;
          if (node.fy == null) node.y += node.vy *= velocityDecay;
          else node.y = node.fy, node.vy = 0;
        }
      }
      return simulation2;
    }
    function initializeNodes() {
      for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], node.index = i;
        if (node.fx != null) node.x = node.fx;
        if (node.fy != null) node.y = node.fy;
        if (isNaN(node.x) || isNaN(node.y)) {
          var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
          node.x = radius * Math.cos(angle);
          node.y = radius * Math.sin(angle);
        }
        if (isNaN(node.vx) || isNaN(node.vy)) {
          node.vx = node.vy = 0;
        }
      }
    }
    function initializeForce(force) {
      if (force.initialize) force.initialize(nodes, random);
      return force;
    }
    initializeNodes();
    return simulation2 = {
      tick,
      restart: function() {
        return stepper.restart(step), simulation2;
      },
      stop: function() {
        return stepper.stop(), simulation2;
      },
      nodes: function(_) {
        return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation2) : nodes;
      },
      alpha: function(_) {
        return arguments.length ? (alpha = +_, simulation2) : alpha;
      },
      alphaMin: function(_) {
        return arguments.length ? (alphaMin = +_, simulation2) : alphaMin;
      },
      alphaDecay: function(_) {
        return arguments.length ? (alphaDecay = +_, simulation2) : +alphaDecay;
      },
      alphaTarget: function(_) {
        return arguments.length ? (alphaTarget = +_, simulation2) : alphaTarget;
      },
      velocityDecay: function(_) {
        return arguments.length ? (velocityDecay = 1 - _, simulation2) : 1 - velocityDecay;
      },
      randomSource: function(_) {
        return arguments.length ? (random = _, forces.forEach(initializeForce), simulation2) : random;
      },
      force: function(name, _) {
        return arguments.length > 1 ? (_ == null ? forces.delete(name) : forces.set(name, initializeForce(_)), simulation2) : forces.get(name);
      },
      find: function(x, y, radius) {
        var i = 0, n = nodes.length, dx, dy, d2, node, closest;
        if (radius == null) radius = Infinity;
        else radius *= radius;
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dx = x - node.x;
          dy = y - node.y;
          d2 = dx * dx + dy * dy;
          if (d2 < radius) closest = node, radius = d2;
        }
        return closest;
      },
      on: function(name, _) {
        return arguments.length > 1 ? (event.on(name, _), simulation2) : event.on(name);
      }
    };
  }
  function manyBody() {
    var nodes, node, random, alpha, strength = constant(-30), strengths, distanceMin2 = 1, distanceMax2 = Infinity, theta2 = 0.81;
    function force(_) {
      var i, n = nodes.length, tree = quadtree(nodes, x$1, y$1).visitAfter(accumulate);
      for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
    }
    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, node2;
      strengths = new Array(n);
      for (i = 0; i < n; ++i) node2 = nodes[i], strengths[node2.index] = +strength(node2, i, nodes);
    }
    function accumulate(quad) {
      var strength2 = 0, q, c2, weight = 0, x, y, i;
      if (quad.length) {
        for (x = y = i = 0; i < 4; ++i) {
          if ((q = quad[i]) && (c2 = Math.abs(q.value))) {
            strength2 += q.value, weight += c2, x += c2 * q.x, y += c2 * q.y;
          }
        }
        quad.x = x / weight;
        quad.y = y / weight;
      } else {
        q = quad;
        q.x = q.data.x;
        q.y = q.data.y;
        do
          strength2 += strengths[q.data.index];
        while (q = q.next);
      }
      quad.value = strength2;
    }
    function apply(quad, x1, _, x2) {
      if (!quad.value) return true;
      var x = quad.x - node.x, y = quad.y - node.y, w = x2 - x1, l = x * x + y * y;
      if (w * w / theta2 < l) {
        if (l < distanceMax2) {
          if (x === 0) x = jiggle(random), l += x * x;
          if (y === 0) y = jiggle(random), l += y * y;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
          node.vx += x * quad.value * alpha / l;
          node.vy += y * quad.value * alpha / l;
        }
        return true;
      } else if (quad.length || l >= distanceMax2) return;
      if (quad.data !== node || quad.next) {
        if (x === 0) x = jiggle(random), l += x * x;
        if (y === 0) y = jiggle(random), l += y * y;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
      }
      do
        if (quad.data !== node) {
          w = strengths[quad.data.index] * alpha / l;
          node.vx += x * w;
          node.vy += y * w;
        }
      while (quad = quad.next);
    }
    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };
    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };
    force.distanceMin = function(_) {
      return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
    };
    force.distanceMax = function(_) {
      return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
    };
    force.theta = function(_) {
      return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
    };
    return force;
  }
  var a, c, m, initialRadius, initialAngle;
  var init_d3_force = __esm({
    "node_modules/d3-force/dist/d3-force.mjs"() {
      init_d3_quadtree();
      init_d3_dispatch();
      init_d3_timer();
      a = 1664525;
      c = 1013904223;
      m = 4294967296;
      initialRadius = 10;
      initialAngle = Math.PI * (3 - Math.sqrt(5));
    }
  });

  // src/graph-utils.js
  function shortestPath(relations, startId, targetId, type = "all") {
    if (!startId || !targetId) return { nodeIds: [], edgeIds: [] };
    if (startId === targetId) return { nodeIds: [startId], edgeIds: [] };
    const adjacency = /* @__PURE__ */ new Map();
    for (const relation of relations) {
      if (type !== "all" && relation.type !== type) continue;
      addNeighbor(adjacency, relation.source, relation.target, relation.id);
      addNeighbor(adjacency, relation.target, relation.source, relation.id);
    }
    const queue = [startId];
    const previous = /* @__PURE__ */ new Map([[startId, null]]);
    while (queue.length > 0) {
      const current = queue.shift();
      for (const next of adjacency.get(current) || []) {
        if (previous.has(next.id)) continue;
        previous.set(next.id, { id: current, edgeId: next.edgeId });
        if (next.id === targetId) return restorePath(previous, targetId);
        queue.push(next.id);
      }
    }
    return { nodeIds: [], edgeIds: [] };
  }
  function compareKeywordSets(chapters, chapterIds) {
    const selected = chapterIds.map((id) => chapters.find((chapter) => chapter.id === id)).filter(Boolean).slice(0, 3);
    const counts = /* @__PURE__ */ new Map();
    for (const chapter of selected) for (const word of chapter.keywords || []) counts.set(word.term, (counts.get(word.term) || 0) + 1);
    const shared = new Set([...counts].filter(([, count]) => count > 1).map(([term]) => term));
    return { selected, shared };
  }
  function addNeighbor(adjacency, source, target, edgeId) {
    const values = adjacency.get(source) || [];
    values.push({ id: target, edgeId });
    adjacency.set(source, values);
  }
  function restorePath(previous, targetId) {
    const nodeIds = [];
    const edgeIds = [];
    let current = targetId;
    while (current) {
      nodeIds.push(current);
      const item = previous.get(current);
      if (item?.edgeId) edgeIds.push(item.edgeId);
      current = item?.id || null;
    }
    return { nodeIds: nodeIds.reverse(), edgeIds: edgeIds.reverse() };
  }
  var init_graph_utils = __esm({
    "src/graph-utils.js"() {
    }
  });

  // src/styles.js
  var STYLES;
  var init_styles = __esm({
    "src/styles.js"() {
      STYLES = String.raw`
*{box-sizing:border-box;letter-spacing:0}.bl-shell,.bl-library{width:100%;height:100%;min-width:0;min-height:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);font:13px/1.45 ui-sans-serif,system-ui,sans-serif}.bl-shell button,.bl-library button,.bl-shell input,.bl-library input{font:inherit;color:inherit}.bl-shell button,.bl-library button{border:0}.bl-toolbar{height:52px;display:flex;align-items:center;gap:8px;padding:0 10px;border-bottom:1px solid var(--dsw-alias-border-secondary);background:var(--dsw-alias-bg-base);position:relative;z-index:5}.bl-book-button{display:flex;align-items:center;gap:7px;min-width:160px;max-width:260px;height:34px;padding:0 9px;background:transparent;border-radius:6px!important}.bl-book-button:hover{background:var(--dsw-alias-bg-hover)}.bl-book-button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}.bl-view-tabs{display:flex;height:34px;padding:2px;background:var(--dsw-alias-bg-elevated);border:1px solid var(--dsw-alias-border-secondary);border-radius:6px}.bl-view-tabs button{display:flex;align-items:center;gap:5px;height:28px;padding:0 9px;background:transparent;border-radius:4px}.bl-view-tabs button.active{background:var(--dsw-alias-bg-base);box-shadow:0 0 0 1px var(--dsw-alias-border-secondary)}.bl-search{height:34px;min-width:170px;max-width:340px;flex:1;display:flex;align-items:center;gap:7px;padding:0 10px;border:1px solid var(--dsw-alias-border-secondary);border-radius:6px;background:var(--dsw-alias-bg-elevated)}.bl-search:focus-within{border-color:var(--dsw-alias-border-focus)}.bl-search input{width:100%;min-width:0;border:0;outline:0;background:transparent}.bl-progress-control{display:flex;align-items:center;gap:10px}.bl-progress-control>label:first-child{display:flex;align-items:center;gap:5px}.bl-progress-control input[type=range]{width:74px}.bl-toggle{display:flex;align-items:center;gap:6px;white-space:nowrap}.bl-toggle input{position:absolute;opacity:0}.bl-toggle span{width:28px;height:16px;border-radius:8px;background:var(--dsw-alias-bg-elevated);border:1px solid var(--dsw-alias-border-primary);position:relative}.bl-toggle span:after{content:'';position:absolute;width:10px;height:10px;left:2px;top:2px;border-radius:50%;background:var(--dsw-alias-label-tertiary);transition:transform .18s ease}.bl-toggle input:checked+span{background:var(--dsw-alias-bg-brand)}.bl-toggle input:checked+span:after{transform:translateX(12px);background:var(--dsw-alias-label-on-color)}.bl-workspace{height:calc(100% - 52px);display:grid;grid-template-columns:minmax(160px,220px) minmax(360px,1fr) minmax(220px,292px);min-width:0;min-height:0}.bl-tree,.bl-detail{min-width:0;min-height:0;overflow:auto;background:var(--dsw-alias-bg-base)}.bl-tree{border-right:1px solid var(--dsw-alias-border-secondary)}.bl-tree h2,.bl-detail>h2{margin:0;padding:14px 14px 9px;font-size:13px}.bl-tree-list{padding:0 6px 12px}.bl-tree-list button{width:100%;min-height:34px;display:grid;grid-template-columns:24px minmax(0,1fr);align-items:center;gap:4px;padding:5px 7px 5px calc(7px + var(--bl-depth,0)*12px);text-align:left;background:transparent;border-radius:5px}.bl-tree-list button:hover{background:var(--dsw-alias-bg-hover)}.bl-tree-list button.active{background:var(--dsw-alias-bg-selected);color:var(--dsw-alias-label-brand)}.bl-tree-list button.locked{opacity:.36}.bl-tree-index{display:grid;place-items:center;width:20px;height:20px;border:1px solid var(--dsw-alias-border-secondary);border-radius:50%;font-size:10px}.bl-canvas{position:relative;min-width:0;min-height:0;overflow:hidden;background-color:var(--dsw-alias-bg-elevated);background-image:radial-gradient(var(--dsw-alias-border-secondary) 1px,transparent 1px);background-size:18px 18px}.bl-graph,.bl-radial{display:block;width:100%;height:100%;min-width:0;min-height:0}.bl-edge{stroke:var(--dsw-alias-border-secondary);stroke-width:1;opacity:.52;cursor:pointer}.bl-edge.theme{stroke-dasharray:5 5}.bl-edge.concept{stroke:var(--dsw-alias-label-link);stroke-width:1.4}.bl-edge.argument{stroke:var(--dsw-alias-label-warning);stroke-width:2.2}.bl-edge.selected{stroke:var(--dsw-alias-label-brand);stroke-width:3;opacity:1}.bl-node{cursor:pointer;outline:none}.bl-node circle{fill:var(--dsw-alias-bg-base);stroke:var(--dsw-alias-border-primary);stroke-width:2}.bl-node:hover circle,.bl-node:focus-visible circle,.bl-node.selected circle{fill:var(--dsw-alias-bg-selected);stroke:var(--dsw-alias-border-focus);stroke-width:3}.bl-node text{fill:var(--dsw-alias-label-secondary);font-size:11px;paint-order:stroke;stroke:var(--dsw-alias-bg-elevated);stroke-width:4px;stroke-linejoin:round}.bl-node.selected text{fill:var(--dsw-alias-label-primary);font-weight:700}.bl-canvas-graph{cursor:crosshair}.bl-radial{padding:28px}.bl-radial-track{fill:none;stroke:var(--dsw-alias-border-secondary);stroke-width:24;opacity:.4}.bl-radial-center{fill:var(--dsw-alias-label-primary);font-size:18px;font-weight:700}.bl-radial-sub{fill:var(--dsw-alias-label-tertiary);font-size:11px}.bl-legend{position:absolute;left:10px;bottom:10px;display:flex;flex-wrap:wrap;gap:3px;padding:4px;border:1px solid var(--dsw-alias-border-secondary);border-radius:6px;background:var(--dsw-alias-bg-base)}.bl-legend button{display:flex;align-items:center;gap:5px;height:26px;padding:0 7px;background:transparent;border-radius:4px;opacity:.48}.bl-legend button.active{background:var(--dsw-alias-bg-selected);opacity:1}.bl-legend i,.bl-relations i{width:15px;height:2px;background:var(--dsw-alias-border-primary)}.bl-legend .theme i{background:repeating-linear-gradient(90deg,var(--dsw-alias-label-secondary) 0 3px,transparent 3px 6px)}.bl-legend .concept i,.bl-relations i.concept{background:var(--dsw-alias-label-link)}.bl-legend .argument i,.bl-relations i.argument{height:3px;background:var(--dsw-alias-label-warning)}.bl-detail{border-left:1px solid var(--dsw-alias-border-secondary);padding:14px}.bl-detail>h2{padding:0;margin:3px 0 10px;font:600 18px/1.25 ui-serif,Georgia,serif;overflow-wrap:anywhere}.bl-detail>h3{margin:18px 0 8px;font-size:12px}.bl-detail>p{color:var(--dsw-alias-label-secondary)}.bl-eyebrow{font-size:11px;color:var(--dsw-alias-label-tertiary)}.bl-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;margin:10px 0;background:var(--dsw-alias-border-secondary)}.bl-stats strong{padding:10px 6px;text-align:center;background:var(--dsw-alias-bg-base);font-size:18px}.bl-stats strong span{display:block;font-size:10px;font-weight:400;color:var(--dsw-alias-label-tertiary)}.bl-chips{display:flex;flex-wrap:wrap;gap:5px}.bl-chips span{padding:3px 7px;border:1px solid var(--dsw-alias-border-secondary);border-radius:4px;background:var(--dsw-alias-bg-elevated);font-size:11px}.bl-relations,.bl-occurrences{display:flex;flex-direction:column;gap:2px}.bl-relations button,.bl-occurrences button{display:grid;grid-template-columns:18px minmax(0,1fr);gap:2px 6px;padding:7px;background:transparent;text-align:left;border-radius:5px}.bl-relations button:hover,.bl-occurrences button:hover{background:var(--dsw-alias-bg-hover)}.bl-relations i{margin-top:7px}.bl-relations small{grid-column:2;color:var(--dsw-alias-label-tertiary)}.bl-occurrences button{grid-template-columns:1fr}.bl-occurrences small{display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;color:var(--dsw-alias-label-tertiary)}.bl-primary,.bl-command{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:34px;padding:0 12px;border-radius:6px!important}.bl-primary{margin-top:14px;background:var(--dsw-alias-bg-brand);color:var(--dsw-alias-label-on-color)!important}.bl-command{background:var(--dsw-alias-bg-elevated);border:1px solid var(--dsw-alias-border-secondary)!important}.bl-primary:disabled,.bl-command:disabled{opacity:.45}.bl-muted{color:var(--dsw-alias-label-tertiary)!important}.bl-reader{position:absolute;z-index:10;left:0;right:0;bottom:0;height:36px;border-top:1px solid var(--dsw-alias-border-secondary);background:var(--dsw-alias-bg-base);transition:height .2s ease}.bl-reader.open{height:min(52%,520px);box-shadow:0 -8px 22px var(--dsw-alias-shadow)}.bl-reader-handle{width:100%;height:35px;display:flex;align-items:center;gap:7px;padding:0 12px;background:var(--dsw-alias-bg-base);text-align:left}.bl-reader-handle span{flex:1;font-weight:600}.bl-reader-handle small{color:var(--dsw-alias-label-tertiary)}.bl-reader.open .bl-reader-handle{display:none}.bl-reader-tools{height:38px;display:flex;align-items:center;gap:6px;padding:0 10px;border-bottom:1px solid var(--dsw-alias-border-secondary)}.bl-reader-tools>strong{flex:1}.bl-reader-tools>button,.bl-selection-tools button{width:28px;height:28px;display:grid;place-items:center;border-radius:5px;background:transparent}.bl-reader-tools button:hover,.bl-selection-tools button:hover{background:var(--dsw-alias-bg-hover)}.bl-selection-tools{display:flex;padding:2px;border:1px solid var(--dsw-alias-border-secondary);border-radius:6px}.bl-reader-content{height:calc(100% - 38px);overflow:auto;padding:20px max(20px,calc((100% - 760px)/2)) 80px;scroll-behavior:smooth}.bl-reader-content.compare{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;padding:0;background:var(--dsw-alias-border-secondary)}.bl-reader-content article{min-width:0;padding:20px 26px;background:var(--dsw-alias-bg-base)}.bl-reader-content h2{margin:0 0 18px;font:600 20px/1.3 ui-serif,Georgia,serif}.bl-reader-content p{position:relative;margin:0 0 1em;font:15px/1.8 ui-serif,Georgia,serif;white-space:pre-wrap}.bl-reader-content p.focus{animation:bl-focus 1.3s ease;background:var(--dsw-alias-bg-selected)}.bl-concept-anchor{display:inline;padding:0 1px;background:transparent;border-bottom:1px dashed var(--dsw-alias-label-link)!important;color:inherit}.bl-annotation-count{display:inline-grid;place-items:center;min-width:17px;height:17px;margin-left:5px;border-radius:50%;background:var(--dsw-alias-bg-selected);font:10px ui-sans-serif,system-ui}.bl-word-cloud{width:100%;height:100%;display:flex;align-content:center;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px 18px;padding:10%;overflow:auto}.bl-word-cloud button{font-size:calc(14px * var(--bl-weight));font-weight:calc(450 + var(--bl-row)*40);background:transparent;color:var(--dsw-alias-label-secondary)}.bl-word-cloud button:hover{color:var(--dsw-alias-label-brand)}.bl-banner,.bl-library-error{display:flex;align-items:center;gap:7px;min-height:34px;padding:7px 10px;color:var(--dsw-alias-label-error);background:var(--dsw-alias-bg-danger)}.bl-banner{position:absolute;z-index:20;top:52px;left:0;right:0}.bl-banner button{margin-left:auto;background:transparent}.bl-search-results{position:absolute;z-index:30;top:46px;left:min(45%,480px);width:min(520px,calc(100% - 24px));max-height:min(60vh,480px);overflow:auto;border:1px solid var(--dsw-alias-border-secondary);border-radius:6px;background:var(--dsw-alias-bg-base);box-shadow:0 10px 28px var(--dsw-alias-shadow)}.bl-search-results button{width:100%;display:grid;grid-template-columns:42px minmax(0,1fr);gap:1px 8px;padding:9px 11px;background:transparent;text-align:left;border-bottom:1px solid var(--dsw-alias-border-secondary)}.bl-search-results button:hover{background:var(--dsw-alias-bg-hover)}.bl-search-results button>span{grid-row:1/3;font-size:10px;color:var(--dsw-alias-label-tertiary)}.bl-search-results small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary)}.bl-search-results p{padding:10px}.bl-library{overflow:auto}.bl-library>header{height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-bottom:1px solid var(--dsw-alias-border-secondary)}.bl-library>header>div{display:flex;align-items:center;gap:8px}.bl-library h1{font-size:16px}.bl-file-input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}.bl-empty{height:calc(100% - 58px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}.bl-empty-mark{width:68px;height:68px;display:grid;place-items:center;margin-bottom:12px;border:1px solid var(--dsw-alias-border-primary);border-radius:50%;background:var(--dsw-alias-bg-elevated)}.bl-empty h2{margin:0;font:600 21px/1.3 ui-serif,Georgia,serif}.bl-empty p{margin:7px 0;color:var(--dsw-alias-label-tertiary)}.bl-book-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;padding:16px}.bl-book-card{position:relative;min-height:118px;border:1px solid var(--dsw-alias-border-secondary);border-radius:7px;background:var(--dsw-alias-bg-elevated);overflow:hidden}.bl-book-card:hover{border-color:var(--dsw-alias-border-primary)}.bl-book-open{width:100%;height:100%;display:grid;grid-template-columns:48px minmax(0,1fr);grid-template-rows:auto auto 8px;gap:3px 9px;padding:14px 38px 14px 14px;text-align:left;background:transparent}.bl-cover{grid-row:1/4;width:44px;height:62px;display:grid;place-items:center;border:1px solid var(--dsw-alias-border-primary);border-radius:4px;background:var(--dsw-alias-bg-base)}.bl-book-open strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bl-book-open small{color:var(--dsw-alias-label-tertiary)}.bl-book-open progress{width:100%;height:3px}.bl-delete{position:absolute;right:7px;top:7px;width:27px;height:27px;display:grid;place-items:center;border-radius:5px;background:transparent;opacity:.42}.bl-delete:hover{opacity:1;background:var(--dsw-alias-bg-danger);color:var(--dsw-alias-label-error)}.bl-job{margin:12px 16px;padding:10px 12px;border:1px solid var(--dsw-alias-border-secondary);border-radius:6px;background:var(--dsw-alias-bg-elevated)}.bl-job>div{display:grid;grid-template-columns:22px minmax(0,1fr);gap:2px 7px}.bl-job span{grid-column:2;color:var(--dsw-alias-label-tertiary)}.bl-job progress{width:100%;height:3px;margin-top:8px}.bl-job.failed{border-color:var(--dsw-alias-border-danger)}.bl-fatal{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-error)}.bl-fatal h2{margin:8px 0 0}.bl-fatal p{max-width:480px}.bl-fatal button{height:32px;padding:0 12px;border-radius:5px;background:var(--dsw-alias-bg-elevated)}.bl-spin{animation:bl-spin .9s linear infinite}@keyframes bl-spin{to{transform:rotate(360deg)}}@keyframes bl-focus{0%,100%{outline-color:transparent}30%{outline:2px solid var(--dsw-alias-border-focus)}}
.bl-icon-command{width:32px;height:32px;display:grid;place-items:center;flex:0 0 auto;border-radius:5px!important;background:transparent}.bl-icon-command:hover,.bl-icon-command.active{background:var(--dsw-alias-bg-selected);color:var(--dsw-alias-label-brand)}.bl-path-controls{position:absolute;z-index:12;top:58px;left:50%;transform:translateX(-50%);width:min(760px,calc(100% - 24px));min-height:42px;display:flex;align-items:center;gap:7px;padding:5px 7px;border:1px solid var(--dsw-alias-border-secondary);border-radius:7px;background:var(--dsw-alias-bg-base);box-shadow:0 8px 24px var(--dsw-alias-shadow)}.bl-path-controls label{min-width:0;display:flex;align-items:center;gap:5px}.bl-path-controls label span{font-size:10px;color:var(--dsw-alias-label-tertiary)}.bl-path-controls select{min-width:110px;max-width:180px;height:28px;border:1px solid var(--dsw-alias-border-secondary);border-radius:4px;background:var(--dsw-alias-bg-elevated)}.bl-path-controls output{margin-left:auto;white-space:nowrap;color:var(--dsw-alias-label-secondary)}.bl-path-controls output.empty{color:var(--dsw-alias-label-error)}.bl-path-controls>button{width:28px;height:28px;display:grid;place-items:center;border-radius:4px;background:transparent}.bl-edge,.bl-node{transition:opacity .14s ease}.bl-edge.path{stroke:var(--dsw-alias-label-brand);stroke-width:3;opacity:1}.bl-edge.dimmed,.bl-node.dimmed{opacity:.12}.bl-node.path circle,.bl-node.reading circle{fill:var(--dsw-alias-bg-selected);stroke:var(--dsw-alias-border-focus);stroke-width:3}.bl-node.reading circle{animation:bl-breathe 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}.bl-node.group-1 circle{stroke:var(--dsw-alias-label-link)}.bl-node.group-2 circle{stroke:var(--dsw-alias-label-warning)}.bl-node.group-3 circle{stroke:var(--dsw-alias-label-success)}.bl-node.group-4 circle{stroke:var(--dsw-alias-label-brand)}.bl-node.group-5 circle{stroke:var(--dsw-alias-label-secondary)}@keyframes bl-breathe{50%{transform:scale(1.16)}}
.bl-preview{width:100%;height:100%;overflow:auto;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);font:13px/1.45 ui-sans-serif,system-ui,sans-serif}.bl-preview>header{position:sticky;z-index:5;top:0;min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 16px;border-bottom:1px solid var(--dsw-alias-border-secondary);background:var(--dsw-alias-bg-base)}.bl-preview>header>div{display:flex;align-items:center;gap:9px}.bl-preview h1{margin:0;font-size:16px}.bl-preview header small{color:var(--dsw-alias-label-tertiary)}.bl-preview .bl-primary{margin-top:0}.bl-preview-list{max-width:1080px;margin:0 auto;padding:14px}.bl-preview-row{display:grid;grid-template-columns:28px minmax(230px,1fr) minmax(190px,1fr) 96px;align-items:center;gap:10px;min-height:88px;padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-secondary)}.bl-preview-row:hover{background:var(--dsw-alias-bg-hover)}.bl-preview-fields{display:grid;grid-template-columns:minmax(140px,1fr) 72px;gap:7px}.bl-preview-fields label{display:grid;gap:3px}.bl-preview-fields label>span{font-size:10px;color:var(--dsw-alias-label-tertiary)}.bl-preview-fields input,.bl-preview-fields select{width:100%;height:30px;border:1px solid var(--dsw-alias-border-secondary);border-radius:4px;padding:0 7px;background:var(--dsw-alias-bg-elevated);color:var(--dsw-alias-label-primary)}.bl-preview-meta{min-width:0;display:flex;flex-wrap:wrap;gap:4px 10px;color:var(--dsw-alias-label-tertiary)}.bl-preview-meta p{flex-basis:100%;margin:3px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bl-preview-actions{display:flex;justify-content:flex-end;gap:3px}.bl-preview-actions button{width:28px;height:28px;display:grid;place-items:center;border-radius:4px;background:transparent;color:var(--dsw-alias-label-secondary)}.bl-preview-actions button:hover{background:var(--dsw-alias-bg-selected)}.bl-preview-actions button:disabled{opacity:.25}
.bl-radial-wrap{position:relative;width:100%;height:100%}.bl-radial-modes{position:absolute;z-index:2;top:10px;left:50%;transform:translateX(-50%);display:flex;padding:2px;border:1px solid var(--dsw-alias-border-secondary);border-radius:6px;background:var(--dsw-alias-bg-base)}.bl-radial-modes button{height:27px;padding:0 9px;border-radius:4px;background:transparent}.bl-radial-modes button.active{background:var(--dsw-alias-bg-selected);color:var(--dsw-alias-label-brand)}.bl-word-workspace{width:100%;height:100%;display:grid;grid-template-rows:auto minmax(0,1fr);background:var(--dsw-alias-bg-base)}.bl-word-select{display:flex;gap:4px;overflow:auto;padding:8px;border-bottom:1px solid var(--dsw-alias-border-secondary)}.bl-word-select label{flex:0 0 auto;max-width:180px;height:28px;display:flex;align-items:center;padding:0 8px;border:1px solid var(--dsw-alias-border-secondary);border-radius:4px;background:var(--dsw-alias-bg-elevated)}.bl-word-select label.active{border-color:var(--dsw-alias-border-focus);background:var(--dsw-alias-bg-selected)}.bl-word-select input{position:absolute;opacity:0}.bl-word-select span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bl-word-columns{min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--dsw-alias-border-secondary)}.bl-word-columns.columns-1{grid-template-columns:1fr}.bl-word-columns.columns-2{grid-template-columns:repeat(2,minmax(0,1fr))}.bl-word-columns>section{min-width:0;min-height:0;display:grid;grid-template-rows:34px minmax(0,1fr);background:var(--dsw-alias-bg-base)}.bl-word-columns h2{margin:0;padding:8px 10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}.bl-word-cloud button.shared{color:var(--dsw-alias-label-brand);text-decoration:underline;text-decoration-style:dotted}.bl-processing{position:absolute;z-index:11;top:58px;right:12px;display:flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid var(--dsw-alias-border-secondary);border-radius:5px;background:var(--dsw-alias-bg-base)}.bl-annotation-settings{position:absolute;z-index:14;top:54px;right:10px;width:240px;padding:8px;border:1px solid var(--dsw-alias-border-secondary);border-radius:7px;background:var(--dsw-alias-bg-base);box-shadow:0 8px 24px var(--dsw-alias-shadow)}.bl-annotation-settings header,.bl-annotation-settings>div{display:flex;align-items:center;justify-content:space-between;min-height:32px}.bl-annotation-settings header{border-bottom:1px solid var(--dsw-alias-border-secondary)}.bl-annotation-settings header button{width:26px;height:26px;display:grid;place-items:center;background:transparent}.bl-annotation-settings>div>div{display:flex;gap:5px}.bl-annotation-settings>div button{width:22px;height:22px;border-radius:50%!important;background:var(--bl-annotation-color);box-shadow:0 0 0 1px var(--dsw-alias-border-primary)}.bl-annotation-settings>div button.active{box-shadow:0 0 0 2px var(--dsw-alias-bg-base),0 0 0 4px var(--dsw-alias-border-focus)}[data-color=brand]{--bl-annotation-color:var(--dsw-alias-label-brand)}[data-color=success]{--bl-annotation-color:var(--dsw-alias-label-success)}[data-color=warning]{--bl-annotation-color:var(--dsw-alias-label-warning)}[data-color=error]{--bl-annotation-color:var(--dsw-alias-label-error)}.bl-annotation{background:color-mix(in srgb,var(--bl-annotation-color) 20%,transparent);color:inherit;border-radius:2px}.bl-annotation.underline{background:transparent;border-bottom:2px solid var(--bl-annotation-color)}.bl-annotation.comment{background:color-mix(in srgb,var(--bl-annotation-color) 14%,transparent);text-decoration:underline;text-decoration-style:dotted;text-decoration-color:var(--bl-annotation-color)}.bl-annotation.concept{box-shadow:inset 0 -2px var(--bl-annotation-color)}
@media(max-width:1000px){.bl-workspace{grid-template-columns:minmax(150px,190px) minmax(320px,1fr)}.bl-detail{position:absolute;z-index:8;right:0;top:52px;bottom:36px;width:min(320px,86vw);box-shadow:-8px 0 22px var(--dsw-alias-shadow)}.bl-progress-control .bl-toggle{display:none}.bl-view-tabs button span{display:none}.bl-search{max-width:none}.bl-preview-row{grid-template-columns:28px minmax(210px,1fr) minmax(160px,1fr);}.bl-preview-actions{grid-column:2/4}}
@media(max-width:720px){.bl-toolbar{gap:4px;padding:0 6px}.bl-book-button{min-width:0;width:42px;padding:0 10px}.bl-book-button span,.bl-book-button>svg:last-child{display:none}.bl-view-tabs button{width:31px;justify-content:center;padding:0}.bl-search{min-width:80px}.bl-progress-control{display:none}.bl-workspace{display:block}.bl-tree{position:absolute;z-index:7;left:0;top:52px;bottom:36px;width:min(260px,80vw);display:none}.bl-detail{top:52px}.bl-reader.open{height:72%}.bl-reader-content.compare{grid-template-columns:1fr}.bl-legend{right:6px;left:6px}.bl-legend button{flex:1;justify-content:center}.bl-search-results{left:8px;right:8px;width:auto}.bl-book-grid{grid-template-columns:1fr}.bl-canvas{height:100%}.bl-path-controls{align-items:stretch;flex-wrap:wrap}.bl-path-controls>svg{display:none}.bl-path-controls label{flex:1 1 42%}.bl-path-controls select{width:100%;min-width:0}.bl-preview>header{align-items:flex-start;flex-direction:column}.bl-preview-row{grid-template-columns:28px minmax(0,1fr)}.bl-preview-meta,.bl-preview-actions{grid-column:2}.bl-preview-fields{grid-template-columns:minmax(0,1fr) 66px}.bl-word-columns,.bl-word-columns.columns-2{grid-template-columns:1fr;overflow:auto}.bl-word-columns>section{min-height:340px}.bl-radial-modes button{padding:0 6px;font-size:11px}}
@media(prefers-reduced-motion:reduce){.bl-reader,.bl-toggle span:after,.bl-edge,.bl-node{transition:none}.bl-spin,.bl-node.reading circle{animation:none}.bl-reader-content{scroll-behavior:auto}}
.bl-path-controls{position:relative;top:auto;left:auto;transform:none;margin:6px auto}.bl-shell.path-open .bl-workspace{height:calc(100% - 106px)}
@media(max-width:720px){.bl-shell.path-open .bl-workspace{height:calc(100% - 154px)}}
`;
    }
  });

  // src/client-app.jsx
  var client_app_exports = {};
  __export(client_app_exports, {
    createBookLoomPlugin: () => createBookLoomPlugin
  });
  function createBookLoomPlugin() {
    const inject = ["slots", "layout"];
    function apply(ctx) {
      installStyles(ctx);
      ctx.slots.inject("main", () => {
        const dispose = ctx.slots.register({ name: "main", key: "book-loom" }, (props) => /* @__PURE__ */ React.createElement(BookLoomBoundary, { ctx, ...props }));
        return () => {
          ctx.layout.selectPanel(null);
          dispose();
        };
      });
      ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
        name: "sidebar.panellist",
        id: "book-loom",
        order: 24,
        label: "\u4E66\u8109"
      }, ({ size }) => /* @__PURE__ */ React.createElement(BookOpenText, { size })));
    }
    return { inject, apply };
  }
  function BookLoomApp() {
    const [state, setState] = useState({ books: [], jobs: [], capabilities: {} });
    const [book, setBook] = useState(null);
    const [preview, setPreview] = useState(null);
    const [view, setView] = useState("chapters");
    const [selected, setSelected] = useState(null);
    const [filters, setFilters] = useState(/* @__PURE__ */ new Set(["structure", "theme", "concept", "argument"]));
    const [query, setQuery] = useState("");
    const [readerOpen, setReaderOpen] = useState(false);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [pathMode, setPathMode] = useState(false);
    const [pathDraft, setPathDraft] = useState({ startId: "", targetId: "", type: "all" });
    const [currentReadingId, setCurrentReadingId] = useState("");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const refreshTimer = useRef(null);
    const refresh = useCallback(async () => {
      const next = await api("/state");
      setState(next);
      return next;
    }, []);
    useEffect(() => {
      refresh().catch((reason) => setError(messageOf(reason)));
    }, [refresh]);
    useEffect(() => {
      if (!state.jobs.some((job) => job.status === "running")) return;
      refreshTimer.current = window.setInterval(async () => {
        try {
          const next = await refresh();
          const completed = next.jobs.find((job) => job.status === "completed" && (!state.books.some((item) => item.id === job.bookId) || book?.id === job.bookId));
          if (completed) setBook(await api(`/books/${encodeURIComponent(completed.bookId)}`));
        } catch (reason) {
          setError(messageOf(reason));
        }
      }, 900);
      return () => window.clearInterval(refreshTimer.current);
    }, [refresh, state.jobs, state.books, book?.id]);
    const openBook = useCallback(async (id) => {
      try {
        const next = await api(`/books/${encodeURIComponent(id)}`);
        setBook(next);
        setSelected(null);
        setError("");
      } catch (reason) {
        setError(messageOf(reason));
      }
    }, []);
    async function importFile(file, encoding) {
      if (!file || uploading) return;
      setUploading(true);
      setError("");
      try {
        const suffix = encoding ? `&encoding=${encodeURIComponent(encoding)}` : "";
        const next = await api(`/previews?filename=${encodeURIComponent(file.name)}${suffix}`, { method: "POST", raw: file, contentType: file.type || "application/octet-stream" });
        setPreview(next);
      } catch (reason) {
        if (reason.code === "ENCODING_REQUIRED") {
          const encodingChoice = window.prompt(`\u65E0\u6CD5\u786E\u5B9A\u6587\u672C\u7F16\u7801\u3002\u8BF7\u8F93\u5165\u7F16\u7801\uFF1A
${(reason.data?.choices || []).join(" / ")}`, reason.data?.detectedEncoding || "UTF-8");
          if (encodingChoice) {
            setUploading(false);
            return importFile(file, encodingChoice);
          }
        }
        setError(messageOf(reason));
      } finally {
        setUploading(false);
      }
    }
    async function editImportPreview(operation) {
      const next = await api(`/previews/${encodeURIComponent(preview.id)}/edit`, { method: "POST", body: operation });
      setPreview(next);
    }
    async function confirmImportPreview() {
      setUploading(true);
      setError("");
      try {
        const job = await api(`/previews/${encodeURIComponent(preview.id)}/confirm`, { method: "POST" });
        setPreview(null);
        await refresh();
        setBook(await api(`/books/${encodeURIComponent(job.bookId)}`));
      } catch (reason) {
        setError(messageOf(reason));
      } finally {
        setUploading(false);
      }
    }
    async function cancelImportPreview() {
      try {
        await api(`/previews/${encodeURIComponent(preview.id)}`, { method: "DELETE" });
      } catch {
      }
      setPreview(null);
    }
    async function removeBook(id) {
      if (!window.confirm("\u5220\u9664\u8FD9\u672C\u4E66\u7684\u7ED3\u6784\u5316\u6587\u672C\u3001\u56FE\u8C31\u4E0E\u6279\u6CE8\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002")) return;
      try {
        await api(`/books/${encodeURIComponent(id)}`, { method: "DELETE", body: { confirm: id } });
        if (book?.id === id) setBook(null);
        await refresh();
      } catch (reason) {
        setError(messageOf(reason));
      }
    }
    if (preview) return /* @__PURE__ */ React.createElement(PreviewEditor, { preview, busy: uploading, onEdit: editImportPreview, onConfirm: confirmImportPreview, onCancel: cancelImportPreview });
    if (!book) return /* @__PURE__ */ React.createElement(LibraryView, { state, uploading, error, onImport: importFile, onOpen: openBook, onRemove: removeBook });
    const visible = visibleChapters(book);
    const selection = resolveSelection(book, selected);
    const results = searchBook(book, query);
    const pathResult = shortestPath(book.relations, pathDraft.startId, pathDraft.targetId, pathDraft.type);
    function chooseGraphItem(value) {
      if (!pathMode || value.kind !== "chapter") {
        setSelected(value);
        return;
      }
      setPathDraft((current) => current.startId && !current.targetId ? { ...current, targetId: value.id } : { ...current, startId: value.id, targetId: "" });
      setSelected(value);
    }
    return /* @__PURE__ */ React.createElement("main", { className: `bl-shell ${pathMode ? "path-open" : ""}`, "data-build": BUILD_MARK }, /* @__PURE__ */ React.createElement("header", { className: "bl-toolbar" }, /* @__PURE__ */ React.createElement("button", { className: "bl-book-button", onClick: () => {
      setBook(null);
      setSelected(null);
    }, title: "\u8FD4\u56DE\u4E66\u5E93" }, /* @__PURE__ */ React.createElement(BookOpen, { size: 18 }), /* @__PURE__ */ React.createElement("span", null, book.title), /* @__PURE__ */ React.createElement(ChevronDown, { size: 14 })), /* @__PURE__ */ React.createElement("nav", { className: "bl-view-tabs", "aria-label": "\u89C6\u56FE" }, Object.entries(VIEW_LABELS).map(([key, label]) => /* @__PURE__ */ React.createElement("button", { key, className: view === key ? "active" : "", onClick: () => setView(key), title: label, "aria-label": label }, viewIcon(key), /* @__PURE__ */ React.createElement("span", null, label)))), /* @__PURE__ */ React.createElement("label", { className: "bl-search" }, /* @__PURE__ */ React.createElement(Search, { size: 16 }), /* @__PURE__ */ React.createElement("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "\u641C\u7D22\u7AE0\u8282\u3001\u6982\u5FF5\u6216\u539F\u6587" })), /* @__PURE__ */ React.createElement("button", { className: `bl-icon-command ${pathMode ? "active" : ""}`, onClick: () => setPathMode((value) => !value), title: "\u8DEF\u5F84\u6A21\u5F0F", "aria-label": "\u8DEF\u5F84\u6A21\u5F0F" }, /* @__PURE__ */ React.createElement(Focus, { size: 17 })), /* @__PURE__ */ React.createElement("button", { className: `bl-icon-command ${settingsOpen ? "active" : ""}`, onClick: () => setSettingsOpen((value) => !value), title: "\u6279\u6CE8\u8BBE\u7F6E", "aria-label": "\u6279\u6CE8\u8BBE\u7F6E" }, /* @__PURE__ */ React.createElement(Settings2, { size: 17 })), /* @__PURE__ */ React.createElement(ProgressControl, { book, onChange: async (progress, progressiveReveal) => {
      const userState = await api(`/books/${book.id}/progress`, { method: "POST", body: { progress, progressiveReveal } });
      setBook((current) => ({ ...current, userState }));
    } })), pathMode && /* @__PURE__ */ React.createElement(PathControls, { book, draft: pathDraft, result: pathResult, onChange: setPathDraft, onClose: () => setPathMode(false) }), settingsOpen && /* @__PURE__ */ React.createElement(AnnotationSettings, { colors: book.userState?.annotationColors || DEFAULT_ANNOTATION_COLORS, onChange: async (annotationColors) => {
      const userState = await api(`/books/${book.id}/settings`, { method: "POST", body: { annotationColors } });
      setBook((current) => ({ ...current, userState }));
    }, onClose: () => setSettingsOpen(false) }), book.analysisStatus === "processing" && /* @__PURE__ */ React.createElement("div", { className: "bl-processing" }, /* @__PURE__ */ React.createElement(LoaderCircle, { className: "bl-spin", size: 15 }), "\u6B63\u5728\u8865\u9F50\u6982\u5FF5\u4E0E\u5173\u7CFB"), error && /* @__PURE__ */ React.createElement("div", { className: "bl-banner", role: "alert" }, /* @__PURE__ */ React.createElement(CircleAlert, { size: 16 }), error, /* @__PURE__ */ React.createElement("button", { onClick: () => setError(""), title: "\u5173\u95ED" }, /* @__PURE__ */ React.createElement(X, { size: 15 }))), query && /* @__PURE__ */ React.createElement(SearchResults, { results, onSelect: (item) => {
      setSelected(item);
      setReaderOpen(item.kind !== "concept");
    } }), /* @__PURE__ */ React.createElement("div", { className: "bl-workspace" }, /* @__PURE__ */ React.createElement(ChapterTree, { chapters: book.chapters, visible, selected, onSelect: (item) => {
      setSelected({ kind: "chapter", id: item.id });
      setReaderOpen(true);
    } }), /* @__PURE__ */ React.createElement("section", { className: "bl-canvas" }, view === "chapters" && /* @__PURE__ */ React.createElement(ChapterGraph, { book, chapters: visible, filters, selected, path: pathResult, currentReadingId, onSelect: chooseGraphItem }), view === "radial" && /* @__PURE__ */ React.createElement(RadialView, { book, chapters: visible, selected, path: pathResult, currentReadingId, onSelect: chooseGraphItem }), view === "concepts" && /* @__PURE__ */ React.createElement(ConceptGraph, { book, chapters: visible, selected, currentReadingId, onSelect: chooseGraphItem }), view === "words" && /* @__PURE__ */ React.createElement(WordCloud, { book, selected, onSelect: setSelected }), /* @__PURE__ */ React.createElement(RelationLegend, { filters, setFilters })), /* @__PURE__ */ React.createElement(DetailPanel, { book, selection, onSelect: (value) => {
      setSelected(value);
      setReaderOpen(true);
    } })), /* @__PURE__ */ React.createElement(Reader, { book, selection, open: readerOpen, onOpen: setReaderOpen, onBook: setBook, onSelect: setSelected, onVisibleChapter: setCurrentReadingId, annotationColors: book.userState?.annotationColors || DEFAULT_ANNOTATION_COLORS }));
  }
  function LibraryView({ state, uploading, error, onImport, onOpen, onRemove }) {
    const input = useRef(null);
    return /* @__PURE__ */ React.createElement("main", { className: "bl-library" }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(BookOpenText, { size: 24 }), /* @__PURE__ */ React.createElement("h1", null, "\u4E66\u8109")), /* @__PURE__ */ React.createElement(ImportButton, { input, uploading, onImport })), error && /* @__PURE__ */ React.createElement("div", { className: "bl-library-error", role: "alert" }, /* @__PURE__ */ React.createElement(CircleAlert, { size: 18 }), error), state.jobs.filter((job) => job.status !== "completed").map((job) => /* @__PURE__ */ React.createElement(ImportJob, { key: job.id, job })), state.books.length === 0 && state.jobs.length === 0 ? /* @__PURE__ */ React.createElement("section", { className: "bl-empty" }, /* @__PURE__ */ React.createElement("div", { className: "bl-empty-mark" }, /* @__PURE__ */ React.createElement(Waypoints, { size: 34 })), /* @__PURE__ */ React.createElement("h2", null, "\u5BFC\u5165\u4E00\u672C\u4E66\uFF0C\u67E5\u770B\u5B83\u7684\u5185\u90E8\u8109\u7EDC"), /* @__PURE__ */ React.createElement("p", null, "\u652F\u6301 EPUB\u3001Markdown\u3001TXT \u548C\u542B\u6587\u672C\u5C42\u7684 PDF\uFF1B\u626B\u63CF\u7248 PDF \u8BF7\u5148 OCR"), /* @__PURE__ */ React.createElement(ImportButton, { input, uploading, onImport, primary: true })) : /* @__PURE__ */ React.createElement("section", { className: "bl-book-grid" }, state.books.map((item) => /* @__PURE__ */ React.createElement("article", { className: "bl-book-card", key: item.id }, /* @__PURE__ */ React.createElement("button", { className: "bl-book-open", onClick: () => onOpen(item.id) }, /* @__PURE__ */ React.createElement("span", { className: "bl-cover" }, /* @__PURE__ */ React.createElement(BookOpen, { size: 25 })), /* @__PURE__ */ React.createElement("strong", null, item.title), /* @__PURE__ */ React.createElement("small", null, item.chapterCount, " \u7AE0 \xB7 ", item.conceptCount, " \u4E2A\u6982\u5FF5"), /* @__PURE__ */ React.createElement("progress", { value: item.progress || 0, max: "1" })), /* @__PURE__ */ React.createElement("button", { className: "bl-delete", onClick: () => onRemove(item.id), title: "\u5220\u9664" }, /* @__PURE__ */ React.createElement(Trash2, { size: 16 }))))));
  }
  function PreviewEditor({ preview, busy, onEdit, onConfirm, onCancel }) {
    const [error, setError] = useState("");
    async function edit(operation) {
      try {
        setError("");
        await onEdit(operation);
      } catch (reason) {
        setError(messageOf(reason));
      }
    }
    return /* @__PURE__ */ React.createElement("main", { className: "bl-preview" }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(BookOpenText, { size: 22 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "\u7AE0\u8282\u6811\u9884\u89C8"), /* @__PURE__ */ React.createElement("small", null, preview.filename, " \xB7 ", preview.format.toUpperCase()))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { className: "bl-command", onClick: onCancel, disabled: busy }, /* @__PURE__ */ React.createElement(X, { size: 16 }), "\u53D6\u6D88"), /* @__PURE__ */ React.createElement("button", { className: "bl-primary", onClick: onConfirm, disabled: busy }, /* @__PURE__ */ React.createElement(Check, { size: 16 }), "\u786E\u8BA4\u5E76\u89E3\u6790"))), error && /* @__PURE__ */ React.createElement("div", { className: "bl-library-error", role: "alert" }, /* @__PURE__ */ React.createElement(CircleAlert, { size: 17 }), error), /* @__PURE__ */ React.createElement("section", { className: "bl-preview-list" }, preview.chapters.map((chapter, index2) => /* @__PURE__ */ React.createElement("article", { key: chapter.id, className: "bl-preview-row" }, /* @__PURE__ */ React.createElement("span", { className: "bl-tree-index" }, index2 + 1), /* @__PURE__ */ React.createElement("div", { className: "bl-preview-fields" }, /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("span", null, "\u6807\u9898"), /* @__PURE__ */ React.createElement("input", { defaultValue: chapter.title, onBlur: (event) => {
      const title = event.target.value.trim();
      if (title && title !== chapter.title) edit({ action: "update", chapterId: chapter.id, title, level: chapter.level });
    } })), /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("span", null, "\u5C42\u7EA7"), /* @__PURE__ */ React.createElement("select", { value: chapter.level, onChange: (event) => edit({ action: "update", chapterId: chapter.id, title: chapter.title, level: Number(event.target.value) }) }, [1, 2, 3, 4, 5, 6].map((level) => /* @__PURE__ */ React.createElement("option", { key: level, value: level }, "H", level))))), /* @__PURE__ */ React.createElement("div", { className: "bl-preview-meta" }, /* @__PURE__ */ React.createElement("span", null, chapter.paragraphCount, " \u6BB5"), /* @__PURE__ */ React.createElement("span", null, chapter.characterCount, " \u5B57"), /* @__PURE__ */ React.createElement("span", null, confidenceLabel(chapter.confidence)), /* @__PURE__ */ React.createElement("p", null, chapter.excerpt)), /* @__PURE__ */ React.createElement("div", { className: "bl-preview-actions" }, /* @__PURE__ */ React.createElement("button", { title: "\u91CD\u547D\u540D", onClick: (event) => event.currentTarget.closest("article").querySelector("input")?.focus() }, /* @__PURE__ */ React.createElement(Pencil, { size: 15 })), /* @__PURE__ */ React.createElement("button", { title: "\u4E0E\u4E0A\u4E00\u7AE0\u5408\u5E76", disabled: index2 === 0, onClick: () => edit({ action: "merge", chapterId: chapter.id }) }, /* @__PURE__ */ React.createElement(GitMerge, { size: 15 })), /* @__PURE__ */ React.createElement("button", { title: "\u6309\u6BB5\u843D\u62C6\u5206", disabled: chapter.paragraphCount < 2, onClick: () => {
      const value = window.prompt(`\u62C6\u5206\u4F4D\u7F6E\uFF081-${chapter.paragraphCount - 1}\uFF09`, String(Math.max(1, Math.floor(chapter.paragraphCount / 2))));
      if (value) edit({ action: "split", chapterId: chapter.id, paragraphIndex: Number(value) });
    } }, /* @__PURE__ */ React.createElement(Scissors, { size: 15 })))))));
  }
  function PathControls({ book, draft, result, onChange, onClose }) {
    return /* @__PURE__ */ React.createElement("div", { className: "bl-path-controls" }, /* @__PURE__ */ React.createElement(Focus, { size: 16 }), /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("span", null, "\u8D77\u70B9"), /* @__PURE__ */ React.createElement("select", { value: draft.startId, onChange: (event) => onChange({ ...draft, startId: event.target.value, targetId: event.target.value === draft.targetId ? "" : draft.targetId }) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\u9009\u62E9\u7AE0\u8282"), book.chapters.map((chapter) => /* @__PURE__ */ React.createElement("option", { key: chapter.id, value: chapter.id }, chapter.title)))), /* @__PURE__ */ React.createElement(ChevronRight, { size: 14 }), /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("span", null, "\u7EC8\u70B9"), /* @__PURE__ */ React.createElement("select", { value: draft.targetId, onChange: (event) => onChange({ ...draft, targetId: event.target.value }) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\u9009\u62E9\u7AE0\u8282"), book.chapters.map((chapter) => /* @__PURE__ */ React.createElement("option", { key: chapter.id, value: chapter.id }, chapter.title)))), /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("span", null, "\u5173\u7CFB"), /* @__PURE__ */ React.createElement("select", { value: draft.type, onChange: (event) => onChange({ ...draft, type: event.target.value }) }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "\u5168\u90E8"), Object.entries(RELATION_LABELS).map(([key, label]) => /* @__PURE__ */ React.createElement("option", { key, value: key }, label)))), /* @__PURE__ */ React.createElement("output", { className: draft.startId && draft.targetId && result.nodeIds.length === 0 ? "empty" : "" }, result.nodeIds.length > 0 ? `${result.nodeIds.length} \u4E2A\u8282\u70B9` : draft.startId && draft.targetId ? "\u65E0\u53EF\u8FBE\u8DEF\u5F84" : ""), /* @__PURE__ */ React.createElement("button", { onClick: onClose, title: "\u5173\u95ED\u8DEF\u5F84\u6A21\u5F0F" }, /* @__PURE__ */ React.createElement(X, { size: 15 })));
  }
  function AnnotationSettings({ colors, onChange, onClose }) {
    const labels = { highlight: "\u9AD8\u4EAE", underline: "\u5212\u7EBF", comment: "\u6279\u6CE8", concept: "\u6982\u5FF5" };
    const choices = ["brand", "success", "warning", "error"];
    return /* @__PURE__ */ React.createElement("div", { className: "bl-annotation-settings" }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("strong", null, "\u6279\u6CE8\u8BED\u4E49\u8272"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, title: "\u5173\u95ED" }, /* @__PURE__ */ React.createElement(X, { size: 15 }))), Object.entries(labels).map(([kind, label]) => /* @__PURE__ */ React.createElement("div", { key: kind }, /* @__PURE__ */ React.createElement("span", null, label), /* @__PURE__ */ React.createElement("div", null, choices.map((color) => /* @__PURE__ */ React.createElement("button", { key: color, className: colors[kind] === color ? "active" : "", "data-color": color, title: color, "aria-label": `${label}\uFF1A${color}`, onClick: () => onChange({ ...colors, [kind]: color }) }))))));
  }
  function ImportButton({ input, uploading, onImport, primary = false }) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { ref: input, className: "bl-file-input", type: "file", accept: ".epub,.md,.markdown,.txt,.pdf,application/epub+zip,text/markdown,text/plain,application/pdf", onChange: (event) => {
      const file = event.target.files?.[0];
      if (file) onImport(file);
      event.target.value = "";
    } }), /* @__PURE__ */ React.createElement("button", { className: primary ? "bl-primary" : "bl-command", disabled: uploading, onClick: () => input.current?.click() }, uploading ? /* @__PURE__ */ React.createElement(LoaderCircle, { className: "bl-spin", size: 17 }) : /* @__PURE__ */ React.createElement(FileUp, { size: 17 }), "\u5BFC\u5165\u4E66\u7C4D"));
  }
  function ImportJob({ job }) {
    const labels = { queued: "\u7B49\u5F85\u89E3\u6790", structure: "\u6B63\u5728\u63D0\u53D6\u7AE0\u8282\u7ED3\u6784", keywords: "\u6B63\u5728\u62BD\u53D6\u5173\u952E\u8BCD", relations: "\u6B63\u5728\u5EFA\u7ACB\u5173\u7CFB", saving: "\u6B63\u5728\u4FDD\u5B58", cancelled: "\u5DF2\u53D6\u6D88" };
    return /* @__PURE__ */ React.createElement("section", { className: `bl-job ${job.status}` }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(LoaderCircle, { className: job.status === "running" ? "bl-spin" : "", size: 18 }), /* @__PURE__ */ React.createElement("strong", null, job.filename), /* @__PURE__ */ React.createElement("span", null, job.error?.message || labels[job.stage] || job.stage)), /* @__PURE__ */ React.createElement("progress", { value: job.progress || 0, max: "1" }));
  }
  function ProgressControl({ book, onChange }) {
    const state = book.userState || {};
    const percent = Math.round((state.progress || 0) * 100);
    return /* @__PURE__ */ React.createElement("div", { className: "bl-progress-control" }, /* @__PURE__ */ React.createElement("label", { title: "\u9605\u8BFB\u8FDB\u5EA6" }, /* @__PURE__ */ React.createElement("span", null, percent, "%"), /* @__PURE__ */ React.createElement("input", { type: "range", min: "0", max: "100", value: percent, onChange: (event) => onChange(Number(event.target.value) / 100, state.progressiveReveal) })), /* @__PURE__ */ React.createElement("label", { className: "bl-toggle" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: state.progressiveReveal !== false, onChange: (event) => onChange(state.progress || 0, event.target.checked) }), /* @__PURE__ */ React.createElement("span", null), "\u53EA\u770B\u5F53\u524D\u8FDB\u5EA6"));
  }
  function ChapterTree({ chapters, visible, selected, onSelect }) {
    const visibleIds = new Set(visible.map((item) => item.id));
    return /* @__PURE__ */ React.createElement("aside", { className: "bl-tree" }, /* @__PURE__ */ React.createElement("h2", null, "\u7AE0\u8282"), /* @__PURE__ */ React.createElement("div", { className: "bl-tree-list" }, chapters.map((chapter) => /* @__PURE__ */ React.createElement("button", { key: chapter.id, style: { "--bl-depth": Math.max(0, chapter.level - 1) }, className: `${selected?.id === chapter.id ? "active " : ""}${visibleIds.has(chapter.id) ? "" : "locked"}`, onClick: () => onSelect(chapter) }, /* @__PURE__ */ React.createElement("span", { className: "bl-tree-index" }, chapter.index + 1), /* @__PURE__ */ React.createElement("span", null, chapter.title)))));
  }
  function ChapterGraph({ book, chapters, filters, selected, path, currentReadingId, onSelect }) {
    const chapterIds = new Set(chapters.map((item) => item.id));
    const links = book.relations.filter((item) => filters.has(item.type) && chapterIds.has(item.source) && chapterIds.has(item.target));
    return /* @__PURE__ */ React.createElement(GraphSurface, { nodes: chapters.map((chapter) => ({ id: chapter.id, label: chapter.title, size: 8 + Math.min(20, Math.sqrt(chapter.wordCount || 1)), group: Math.max(1, chapter.level) })), links, selected, path, currentReadingId, onSelect: (item) => onSelect(item.type ? { kind: "relation", id: item.id } : { kind: "chapter", id: item.id }) });
  }
  function ConceptGraph({ book, chapters, selected, currentReadingId, onSelect }) {
    const chapterIds = new Set(chapters.map((item) => item.id));
    const concepts = book.concepts.filter((concept) => concept.occurrences.some((item) => chapterIds.has(item.chapterId))).slice(0, 180);
    const paragraphConcepts = /* @__PURE__ */ new Map();
    for (const concept of concepts) for (const occurrence of concept.occurrences) {
      const values = paragraphConcepts.get(occurrence.paragraphId) || [];
      values.push(concept.id);
      paragraphConcepts.set(occurrence.paragraphId, values);
    }
    const pairs = /* @__PURE__ */ new Map();
    for (const values of paragraphConcepts.values()) for (let a2 = 0; a2 < values.length; a2 += 1) for (let b = a2 + 1; b < values.length; b += 1) {
      const key = [values[a2], values[b]].sort().join(":");
      pairs.set(key, (pairs.get(key) || 0) + 1);
    }
    const links = [...pairs].map(([key, weight]) => {
      const [source, target] = key.split(":");
      return { id: `concept-link-${key}`, source, target, type: "concept", weight };
    }).slice(0, 360);
    return /* @__PURE__ */ React.createElement(GraphSurface, { nodes: concepts.map((concept) => ({ id: concept.id, label: concept.label, size: 7 + Math.min(24, Math.sqrt(concept.frequency) * 3), group: book.chapters.findIndex((item) => item.id === concept.firstChapterId) % 6 })), links, selected, currentReadingId, onSelect: (item) => onSelect({ kind: "concept", id: item.id }) });
  }
  function GraphSurface({ nodes, links, selected, path = { nodeIds: [], edgeIds: [] }, currentReadingId, onSelect }) {
    const [layout, setLayout] = useState([]);
    useEffect(() => {
      const width = 900;
      const height = 620;
      const next = nodes.map((node, index2) => ({ ...node, x: width / 2 + Math.cos(index2) * 80, y: height / 2 + Math.sin(index2) * 80 }));
      const simulation2 = simulation(next).force("charge", manyBody().strength(-90)).force("center", center(width / 2, height / 2)).force("collision", collide().radius((node) => node.size + 13)).force("link", link(links.map((item) => ({ ...item }))).id((node) => node.id).distance(70).strength(0.2)).stop();
      for (let index2 = 0; index2 < Math.min(240, 40 + nodes.length * 2); index2 += 1) simulation2.tick();
      setLayout(next.map((node) => ({ ...node })));
      return () => simulation2.stop();
    }, [nodes.map((item) => item.id).join("|"), links.map((item) => item.id).join("|")]);
    return nodes.length > 200 ? /* @__PURE__ */ React.createElement(CanvasGraph, { nodes: layout, links, selected, path, currentReadingId, onSelect }) : /* @__PURE__ */ React.createElement(SvgGraph, { nodes: layout, links, selected, path, currentReadingId, onSelect });
  }
  function SvgGraph({ nodes, links, selected, path, currentReadingId, onSelect }) {
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [positions, setPositions] = useState(nodes);
    const [hovered, setHovered] = useState("");
    const pan = useRef(null);
    useEffect(() => setPositions(nodes), [nodes]);
    const nodeMap = new Map(positions.map((item) => [item.id, item]));
    const selectedNode = selected?.kind === "chapter" || selected?.kind === "concept" ? selected.id : null;
    const neighbors = connectedNodeIds(links, hovered);
    const pathNodes = new Set(path.nodeIds);
    const pathEdges = new Set(path.edgeIds);
    const pathActive = pathNodes.size > 0;
    useEffect(() => {
      const target = nodeMap.get(selectedNode);
      if (target) setTransform((current) => ({ ...current, x: 450 - target.x * current.scale, y: 310 - target.y * current.scale }));
    }, [selectedNode]);
    return /* @__PURE__ */ React.createElement("svg", { className: "bl-graph", viewBox: "0 0 900 620", tabIndex: "0", "aria-label": "\u4E92\u52A8\u56FE\u8C31", onWheel: (event) => {
      const scale = Math.max(0.45, Math.min(2.5, transform.scale * (event.deltaY > 0 ? 0.9 : 1.1)));
      setTransform({ ...transform, scale });
    }, onPointerDown: (event) => {
      if (event.target !== event.currentTarget) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      pan.current = { x: event.clientX, y: event.clientY, tx: transform.x, ty: transform.y };
    }, onPointerMove: (event) => {
      if (!pan.current) return;
      setTransform((current) => ({ ...current, x: pan.current.tx + event.clientX - pan.current.x, y: pan.current.ty + event.clientY - pan.current.y }));
    }, onPointerUp: () => {
      pan.current = null;
    } }, /* @__PURE__ */ React.createElement("g", { transform: `translate(${transform.x} ${transform.y}) scale(${transform.scale})` }, links.map((link2) => {
      const sourceId = typeof link2.source === "object" ? link2.source.id : link2.source;
      const targetId = typeof link2.target === "object" ? link2.target.id : link2.target;
      const source = nodeMap.get(sourceId);
      const target = nodeMap.get(targetId);
      if (!source || !target) return null;
      const dimmed = hovered && sourceId !== hovered && targetId !== hovered || pathActive && !pathEdges.has(link2.id);
      return /* @__PURE__ */ React.createElement("line", { key: link2.id, className: `bl-edge ${link2.type} ${selected?.id === link2.id ? "selected" : ""} ${pathEdges.has(link2.id) ? "path" : ""} ${dimmed ? "dimmed" : ""}`, x1: source.x, y1: source.y, x2: target.x, y2: target.y, onClick: () => onSelect(link2) });
    }), positions.map((node) => {
      const dimmed = hovered && node.id !== hovered && !neighbors.has(node.id) || pathActive && !pathNodes.has(node.id);
      return /* @__PURE__ */ React.createElement("g", { key: node.id, className: `bl-node group-${Math.abs(node.group || 0) % 6} ${selectedNode === node.id ? "selected" : ""} ${currentReadingId === node.id ? "reading" : ""} ${pathNodes.has(node.id) ? "path" : ""} ${dimmed ? "dimmed" : ""}`, transform: `translate(${node.x} ${node.y})`, role: "button", tabIndex: "0", onPointerEnter: () => setHovered(node.id), onPointerLeave: () => setHovered(""), onPointerDown: (event) => {
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        pan.current = { nodeId: node.id, x: event.clientX, y: event.clientY, ox: node.x, oy: node.y, moved: false };
      }, onPointerMove: (event) => {
        if (pan.current?.nodeId !== node.id) return;
        const rect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
        const dx = (event.clientX - pan.current.x) * 900 / rect.width / transform.scale;
        const dy = (event.clientY - pan.current.y) * 620 / rect.height / transform.scale;
        if (Math.abs(dx) + Math.abs(dy) > 2) pan.current.moved = true;
        setPositions((current) => current.map((item) => item.id === node.id ? { ...item, x: pan.current.ox + dx, y: pan.current.oy + dy } : item));
      }, onPointerUp: () => {
        if (!pan.current?.moved) onSelect(node);
        pan.current = null;
      }, onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") onSelect(node);
      } }, /* @__PURE__ */ React.createElement("circle", { r: node.size }), /* @__PURE__ */ React.createElement("text", { y: node.size + 15 }, node.label));
    })));
  }
  function CanvasGraph({ nodes, links, selected, path, currentReadingId, onSelect }) {
    const canvas = useRef(null);
    const transform = useRef({ x: 0, y: 0, scale: 1 });
    const positions = useRef(nodes);
    const interaction = useRef(null);
    const hovered = useRef("");
    useEffect(() => {
      positions.current = nodes;
      draw();
    }, [nodes]);
    const draw = useCallback(() => {
      const element = canvas.current;
      if (!element) return;
      const ratio = window.devicePixelRatio || 1;
      const rect = element.getBoundingClientRect();
      element.width = Math.max(1, rect.width * ratio);
      element.height = Math.max(1, rect.height * ratio);
      const context = element.getContext("2d");
      context.scale(ratio, ratio);
      context.clearRect(0, 0, rect.width, rect.height);
      const sx = rect.width / 900;
      const sy = rect.height / 620;
      const nodeMap = new Map(positions.current.map((item) => [item.id, item]));
      const pathNodes = new Set(path.nodeIds);
      const pathEdges = new Set(path.edgeIds);
      const pathActive = pathNodes.size > 0;
      const neighbors = connectedNodeIds(links, hovered.current);
      context.save();
      context.translate(transform.current.x, transform.current.y);
      context.scale(transform.current.scale * sx, transform.current.scale * sy);
      context.strokeStyle = cssToken("--dsw-alias-border-secondary", element);
      for (const link2 of links) {
        const sourceId = typeof link2.source === "object" ? link2.source.id : link2.source;
        const targetId = typeof link2.target === "object" ? link2.target.id : link2.target;
        const source = nodeMap.get(sourceId);
        const target = nodeMap.get(targetId);
        if (!source || !target) continue;
        context.globalAlpha = hovered.current && sourceId !== hovered.current && targetId !== hovered.current || pathActive && !pathEdges.has(link2.id) ? 0.08 : pathEdges.has(link2.id) ? 1 : 0.42;
        context.lineWidth = pathEdges.has(link2.id) ? 3 : 1;
        context.beginPath();
        context.moveTo(source.x, source.y);
        context.lineTo(target.x, target.y);
        context.stroke();
      }
      context.globalAlpha = 1;
      for (const node of positions.current) {
        const dimmed = hovered.current && node.id !== hovered.current && !neighbors.has(node.id) || pathActive && !pathNodes.has(node.id);
        context.globalAlpha = dimmed ? 0.14 : 1;
        context.beginPath();
        context.fillStyle = node.id === selected?.id || node.id === currentReadingId || pathNodes.has(node.id) ? cssToken("--dsw-alias-bg-brand", element) : cssToken("--dsw-alias-bg-elevated", element);
        context.strokeStyle = cssToken("--dsw-alias-border-primary", element);
        context.lineWidth = pathNodes.has(node.id) ? 3 : 1;
        context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        if (transform.current.scale >= 1.15) {
          context.fillStyle = cssToken("--dsw-alias-label-primary", element);
          context.font = "11px system-ui";
          context.fillText(node.label.slice(0, 32), node.x + node.size + 4, node.y + 4);
        }
      }
      context.restore();
    }, [links, selected, path, currentReadingId]);
    useEffect(() => {
      draw();
      const observer = new ResizeObserver(draw);
      if (canvas.current) observer.observe(canvas.current);
      return () => observer.disconnect();
    }, [draw]);
    function point(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      return { rect, x: (event.clientX - rect.left - transform.current.x) / (rect.width / 900 * transform.current.scale), y: (event.clientY - rect.top - transform.current.y) / (rect.height / 620 * transform.current.scale) };
    }
    return /* @__PURE__ */ React.createElement("canvas", { ref: canvas, className: "bl-graph bl-canvas-graph", "aria-label": "\u5927\u578B\u4E92\u52A8\u56FE\u8C31", onWheel: (event) => {
      transform.current.scale = Math.max(0.4, Math.min(2.5, transform.current.scale * (event.deltaY > 0 ? 0.9 : 1.1)));
      draw();
    }, onPointerDown: (event) => {
      const location = point(event);
      const node = positions.current.find((item) => Math.hypot(item.x - location.x, item.y - location.y) <= item.size + 5);
      event.currentTarget.setPointerCapture(event.pointerId);
      interaction.current = node ? { type: "node", node, x: location.x, y: location.y, ox: node.x, oy: node.y, moved: false } : { type: "pan", x: event.clientX, y: event.clientY, tx: transform.current.x, ty: transform.current.y };
    }, onPointerMove: (event) => {
      const location = point(event);
      if (!interaction.current) {
        hovered.current = positions.current.find((item) => Math.hypot(item.x - location.x, item.y - location.y) <= item.size + 5)?.id || "";
        draw();
        return;
      }
      if (interaction.current.type === "pan") {
        transform.current.x = interaction.current.tx + event.clientX - interaction.current.x;
        transform.current.y = interaction.current.ty + event.clientY - interaction.current.y;
      } else {
        const dx = location.x - interaction.current.x;
        const dy = location.y - interaction.current.y;
        interaction.current.node.x = interaction.current.ox + dx;
        interaction.current.node.y = interaction.current.oy + dy;
        interaction.current.moved ||= Math.abs(dx) + Math.abs(dy) > 2;
      }
      draw();
    }, onPointerUp: () => {
      if (interaction.current?.type === "node" && !interaction.current.moved) onSelect(interaction.current.node);
      interaction.current = null;
    }, onPointerLeave: () => {
      hovered.current = "";
      draw();
    } });
  }
  function RadialView({ book, chapters, selected, path, currentReadingId, onSelect }) {
    const [mode, setMode] = useState("order");
    const radius = 220;
    const center2 = 310;
    const pathNodes = new Set(path?.nodeIds || []);
    return /* @__PURE__ */ React.createElement("div", { className: "bl-radial-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "bl-radial-modes", role: "tablist" }, [["order", "\u9605\u8BFB\u987A\u5E8F"], ["theme", "\u4E3B\u9898\u5F27\u7EBF"], ["concept", "\u6982\u5FF5\u5BC6\u5EA6"]].map(([key, label]) => /* @__PURE__ */ React.createElement("button", { key, className: mode === key ? "active" : "", onClick: () => setMode(key) }, label))), /* @__PURE__ */ React.createElement("svg", { className: "bl-radial", viewBox: "0 0 620 620", "aria-label": "\u5F84\u5411\u8109\u7EDC\u56FE" }, /* @__PURE__ */ React.createElement("circle", { className: "bl-radial-track", cx: center2, cy: center2, r: radius }), chapters.map((chapter, index2) => {
      const angle = Math.PI * 2 * index2 / Math.max(1, chapters.length) - Math.PI / 2;
      const conceptCount = book.concepts.filter((concept) => concept.occurrences.some((item) => item.chapterId === chapter.id)).length;
      const themeStrength = (chapter.keywords || []).slice(0, 8).reduce((total, item) => total + item.weight, 0);
      const offset = mode === "theme" ? Math.min(55, themeStrength * 2) : mode === "concept" ? Math.min(55, conceptCount * 3) : 0;
      const nodeRadius = radius - offset;
      const x = center2 + Math.cos(angle) * nodeRadius;
      const y = center2 + Math.sin(angle) * nodeRadius;
      const dimmed = pathNodes.size > 0 && !pathNodes.has(chapter.id);
      return /* @__PURE__ */ React.createElement("g", { key: chapter.id, className: `bl-node ${selected?.id === chapter.id ? "selected" : ""} ${currentReadingId === chapter.id ? "reading" : ""} ${pathNodes.has(chapter.id) ? "path" : ""} ${dimmed ? "dimmed" : ""}`, transform: `translate(${x} ${y})`, role: "button", tabIndex: "0", onClick: () => onSelect({ kind: "chapter", id: chapter.id }), onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") onSelect({ kind: "chapter", id: chapter.id });
      } }, /* @__PURE__ */ React.createElement("circle", { r: mode === "concept" ? 8 + Math.min(16, conceptCount) : 9 + Math.min(12, (chapter.keywords?.length || 0) / 2) }), /* @__PURE__ */ React.createElement("text", { textAnchor: x < center2 ? "end" : "start", x: x < center2 ? -16 : 16, y: "4" }, chapter.title));
    }), /* @__PURE__ */ React.createElement("text", { className: "bl-radial-center", x: center2, y: center2 - 6, textAnchor: "middle" }, book.title), /* @__PURE__ */ React.createElement("text", { className: "bl-radial-sub", x: center2, y: center2 + 18, textAnchor: "middle" }, chapters.length, " \u4E2A\u53EF\u89C1\u7AE0\u8282")));
  }
  function WordCloud({ book, selected, onSelect }) {
    const [chapterIds, setChapterIds] = useState(() => selected?.kind === "chapter" ? [selected.id] : []);
    useEffect(() => {
      if (selected?.kind === "chapter") setChapterIds((current) => current.includes(selected.id) ? current : [...current.slice(-2), selected.id]);
    }, [selected?.kind, selected?.id]);
    const { selected: compared, shared } = compareKeywordSets(book.chapters, chapterIds);
    const groups = compared.length > 0 ? compared.map((chapter) => ({ id: chapter.id, title: chapter.title, words: chapter.keywords || [] })) : [{ id: "all", title: "\u5168\u4E66", words: aggregateKeywords(book.chapters) }];
    function toggle(id) {
      setChapterIds((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 3 ? [...current, id] : [...current.slice(1), id]);
    }
    return /* @__PURE__ */ React.createElement("div", { className: "bl-word-workspace" }, /* @__PURE__ */ React.createElement("div", { className: "bl-word-select" }, book.chapters.map((chapter) => /* @__PURE__ */ React.createElement("label", { key: chapter.id, className: chapterIds.includes(chapter.id) ? "active" : "" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: chapterIds.includes(chapter.id), onChange: () => toggle(chapter.id) }), /* @__PURE__ */ React.createElement("span", null, chapter.title)))), /* @__PURE__ */ React.createElement("div", { className: `bl-word-columns columns-${groups.length}` }, groups.map((group) => /* @__PURE__ */ React.createElement("section", { key: group.id }, /* @__PURE__ */ React.createElement("h2", null, group.title), /* @__PURE__ */ React.createElement("div", { className: "bl-word-cloud", "aria-label": `${group.title}\u5173\u952E\u8BCD\u4E91` }, group.words.slice(0, 70).map((word, index2) => /* @__PURE__ */ React.createElement("button", { key: word.term, className: shared.has(word.term) ? "shared" : "", style: { "--bl-weight": Math.min(2.1, 0.82 + word.weight / Math.max(group.words[0]?.weight || 1, 1) * 1.28), "--bl-row": index2 % 6 }, onClick: () => {
      const concept = book.concepts.find((item) => item.label === word.term);
      if (concept) onSelect({ kind: "concept", id: concept.id });
    } }, word.term)))))));
  }
  function RelationLegend({ filters, setFilters }) {
    return /* @__PURE__ */ React.createElement("div", { className: "bl-legend" }, Object.entries(RELATION_LABELS).map(([key, label]) => /* @__PURE__ */ React.createElement("button", { key, className: `${key} ${filters.has(key) ? "active" : ""}`, onClick: () => setFilters((current) => {
      const next = new Set(current);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    }) }, /* @__PURE__ */ React.createElement("i", null), label)));
  }
  function DetailPanel({ book, selection, onSelect }) {
    if (!selection) return /* @__PURE__ */ React.createElement("aside", { className: "bl-detail" }, /* @__PURE__ */ React.createElement("h2", null, "\u672C\u4E66\u6982\u89C8"), /* @__PURE__ */ React.createElement("div", { className: "bl-stats" }, /* @__PURE__ */ React.createElement("strong", null, book.chapters.length, /* @__PURE__ */ React.createElement("span", null, "\u7AE0\u8282")), /* @__PURE__ */ React.createElement("strong", null, book.concepts.length, /* @__PURE__ */ React.createElement("span", null, "\u6982\u5FF5")), /* @__PURE__ */ React.createElement("strong", null, book.relations.length, /* @__PURE__ */ React.createElement("span", null, "\u5173\u7CFB"))), /* @__PURE__ */ React.createElement("p", { className: "bl-muted" }, "\u9009\u62E9\u4E00\u4E2A\u7AE0\u8282\u3001\u6982\u5FF5\u6216\u5173\u7CFB\uFF0C\u67E5\u770B\u5B83\u5728\u539F\u6587\u4E2D\u7684\u4F9D\u636E\u3002"));
    if (selection.kind === "chapter") return /* @__PURE__ */ React.createElement("aside", { className: "bl-detail" }, /* @__PURE__ */ React.createElement("span", { className: "bl-eyebrow" }, "\u7B2C ", selection.value.index + 1, " \u7AE0"), /* @__PURE__ */ React.createElement("h2", null, selection.value.title), /* @__PURE__ */ React.createElement("p", null, selection.value.summary || "\u672C\u7AE0\u6682\u65E0\u53EF\u7528\u7684\u62BD\u53D6\u5F0F\u6458\u8981\u3002"), /* @__PURE__ */ React.createElement("h3", null, "\u5173\u952E\u8BCD"), /* @__PURE__ */ React.createElement("div", { className: "bl-chips" }, selection.value.keywords.slice(0, 10).map((word) => /* @__PURE__ */ React.createElement("span", { key: word.term }, word.term))), /* @__PURE__ */ React.createElement("h3", null, "\u5173\u8054\u7AE0\u8282"), /* @__PURE__ */ React.createElement("div", { className: "bl-relations" }, book.relations.filter((item) => item.source === selection.value.id || item.target === selection.value.id).slice(0, 12).map((item) => {
      const otherId = item.source === selection.value.id ? item.target : item.source;
      const other = book.chapters.find((chapter) => chapter.id === otherId);
      return /* @__PURE__ */ React.createElement("button", { key: item.id, onClick: () => onSelect({ kind: "relation", id: item.id }) }, /* @__PURE__ */ React.createElement("i", { className: item.type }), /* @__PURE__ */ React.createElement("span", null, other?.title), /* @__PURE__ */ React.createElement("small", null, RELATION_LABELS[item.type], item.inferred ? " \xB7 \u63A8\u65AD" : ""));
    })), /* @__PURE__ */ React.createElement("button", { className: "bl-primary", onClick: () => onSelect({ kind: "chapter", id: selection.value.id }) }, /* @__PURE__ */ React.createElement(BookOpen, { size: 16 }), "\u56DE\u5230\u539F\u6587"));
    if (selection.kind === "concept") return /* @__PURE__ */ React.createElement("aside", { className: "bl-detail" }, /* @__PURE__ */ React.createElement("span", { className: "bl-eyebrow" }, "\u6982\u5FF5"), /* @__PURE__ */ React.createElement("h2", null, selection.value.label), /* @__PURE__ */ React.createElement("div", { className: "bl-stats" }, /* @__PURE__ */ React.createElement("strong", null, selection.value.frequency, /* @__PURE__ */ React.createElement("span", null, "\u51FA\u73B0")), /* @__PURE__ */ React.createElement("strong", null, selection.value.chapterCount, /* @__PURE__ */ React.createElement("span", null, "\u7AE0\u8282"))), /* @__PURE__ */ React.createElement("h3", null, "\u51FA\u73B0\u7D22\u5F15"), /* @__PURE__ */ React.createElement("div", { className: "bl-occurrences" }, selection.value.occurrences.slice(0, 20).map((item, index2) => /* @__PURE__ */ React.createElement("button", { key: `${item.paragraphId}-${index2}`, onClick: () => onSelect({ kind: "occurrence", id: selection.value.id, occurrence: item }) }, /* @__PURE__ */ React.createElement("span", null, book.chapters.find((chapter) => chapter.id === item.chapterId)?.title), /* @__PURE__ */ React.createElement("small", null, item.excerpt)))));
    const relation = selection.value;
    const source = book.chapters.find((item) => item.id === relation.source);
    const target = book.chapters.find((item) => item.id === relation.target);
    return /* @__PURE__ */ React.createElement("aside", { className: "bl-detail" }, /* @__PURE__ */ React.createElement("span", { className: "bl-eyebrow" }, RELATION_LABELS[relation.type], relation.inferred ? " \xB7 \u63A8\u65AD\u5173\u7CFB" : ""), /* @__PURE__ */ React.createElement("h2", null, source?.title, " \u2192 ", target?.title), /* @__PURE__ */ React.createElement("h3", null, "\u5173\u7CFB\u4F9D\u636E"), /* @__PURE__ */ React.createElement("div", { className: "bl-chips" }, relation.evidence.map((item) => /* @__PURE__ */ React.createElement("span", { key: item }, item))), /* @__PURE__ */ React.createElement("p", { className: "bl-muted" }, "\u5F3A\u5EA6 ", Math.round(relation.weight * 100), "%"), /* @__PURE__ */ React.createElement("button", { className: "bl-primary", onClick: () => onSelect({ kind: "comparison", id: relation.id }) }, /* @__PURE__ */ React.createElement(Columns3, { size: 16 }), "\u5E76\u6392\u5BF9\u6BD4\u539F\u6587"));
  }
  function Reader({ book, selection, open, onOpen, onBook, onSelect, onVisibleChapter, annotationColors }) {
    const chapterIds = selectionChapterIds(selection);
    const chapters = chapterIds.map((id) => book.chapters.find((item) => item.id === id)).filter(Boolean);
    const shown = chapters.length ? chapters : [book.chapters[0]].filter(Boolean);
    const [selectionRange, setSelectionRange] = useState(null);
    useEffect(() => {
      setSelectionRange(null);
    }, [selection?.kind, selection?.id]);
    useEffect(() => {
      if (open && shown[0]) onVisibleChapter(shown[0].id);
    }, [open, shown[0]?.id]);
    async function annotate(kind) {
      if (!selectionRange) return;
      try {
        const annotation = await api(`/books/${book.id}/annotations`, { method: "POST", body: { ...selectionRange, kind, color: annotationColors[kind], note: kind === "comment" ? window.prompt("\u6279\u6CE8\u5185\u5BB9") || "" : "" } });
        onBook((current) => ({ ...current, annotations: [...current.annotations || [], annotation], concepts: kind === "concept" ? [...current.concepts, userConceptFromAnnotation(annotation)] : current.concepts }));
        window.getSelection()?.removeAllRanges();
        setSelectionRange(null);
      } catch (reason) {
        window.alert(messageOf(reason));
      }
    }
    return /* @__PURE__ */ React.createElement("section", { className: `bl-reader ${open ? "open" : ""}` }, /* @__PURE__ */ React.createElement("button", { className: "bl-reader-handle", onClick: () => onOpen(!open) }, /* @__PURE__ */ React.createElement(PanelBottomOpen, { size: 17 }), /* @__PURE__ */ React.createElement("span", null, shown[0]?.title || "\u539F\u6587\u9605\u8BFB\u5668"), /* @__PURE__ */ React.createElement("small", null, open ? "\u6536\u8D77" : "\u5C55\u5F00")), open && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "bl-reader-tools" }, /* @__PURE__ */ React.createElement("strong", null, "\u539F\u6587\u9605\u8BFB\u5668"), selectionRange && /* @__PURE__ */ React.createElement("div", { className: "bl-selection-tools" }, /* @__PURE__ */ React.createElement("button", { onClick: () => annotate("highlight"), title: "\u9AD8\u4EAE" }, /* @__PURE__ */ React.createElement(Highlighter, { size: 16 })), /* @__PURE__ */ React.createElement("button", { onClick: () => annotate("underline"), title: "\u5212\u7EBF" }, /* @__PURE__ */ React.createElement(Underline, { size: 16 })), /* @__PURE__ */ React.createElement("button", { onClick: () => annotate("comment"), title: "\u6279\u6CE8" }, /* @__PURE__ */ React.createElement(AlignLeft, { size: 16 })), /* @__PURE__ */ React.createElement("button", { onClick: () => annotate("concept"), title: "\u6807\u8BB0\u4E3A\u6982\u5FF5" }, /* @__PURE__ */ React.createElement(Sparkles, { size: 16 }))), /* @__PURE__ */ React.createElement("button", { onClick: () => onOpen(false), title: "\u5173\u95ED" }, /* @__PURE__ */ React.createElement(X, { size: 16 }))), /* @__PURE__ */ React.createElement("div", { className: `bl-reader-content ${shown.length > 1 ? "compare" : ""}`, onScroll: (event) => {
      const containerTop = event.currentTarget.getBoundingClientRect().top;
      const articles = [...event.currentTarget.querySelectorAll("article[data-chapter-id]")];
      const nearest = articles.sort((left, right) => Math.abs(left.getBoundingClientRect().top - containerTop) - Math.abs(right.getBoundingClientRect().top - containerTop))[0];
      if (nearest) onVisibleChapter(nearest.dataset.chapterId);
    } }, shown.map((chapter) => /* @__PURE__ */ React.createElement("article", { key: chapter.id, "data-chapter-id": chapter.id }, /* @__PURE__ */ React.createElement("h2", null, chapter.title), chapter.paragraphs.map((paragraph) => /* @__PURE__ */ React.createElement(Paragraph, { key: paragraph.id, paragraph, chapter, concepts: book.concepts, annotations: book.annotations || [], focus: focusParagraph(selection) === paragraph.id, onRange: setSelectionRange, onConcept: (id) => onSelect({ kind: "concept", id }) })))))));
  }
  function Paragraph({ paragraph, chapter, concepts, annotations, focus, onRange, onConcept }) {
    const ref = useRef(null);
    const conceptMatches = concepts.flatMap((concept) => concept.occurrences.filter((item) => item.paragraphId === paragraph.id).map((item) => ({ ...item, conceptId: concept.id }))).sort((a2, b) => a2.offset - b.offset);
    const paragraphAnnotations = annotations.filter((item) => item.paragraphId === paragraph.id);
    const boundaries = /* @__PURE__ */ new Set([0, paragraph.text.length]);
    for (const item of conceptMatches) {
      boundaries.add(item.offset);
      boundaries.add(Math.min(paragraph.text.length, item.offset + item.length));
    }
    for (const item of paragraphAnnotations) {
      boundaries.add(item.start);
      boundaries.add(Math.min(paragraph.text.length, item.end));
    }
    const points = [...boundaries].filter((value) => value >= 0 && value <= paragraph.text.length).sort((a2, b) => a2 - b);
    const parts = [];
    for (let index2 = 0; index2 < points.length - 1; index2 += 1) {
      const start = points[index2];
      const end = points[index2 + 1];
      if (end <= start) continue;
      const text = paragraph.text.slice(start, end);
      const concept = conceptMatches.find((item) => item.offset <= start && item.offset + item.length >= end);
      const annotation = paragraphAnnotations.find((item) => item.start <= start && item.end >= end);
      const annotationProps = annotation ? { className: `bl-annotation ${annotation.kind}`, "data-color": annotation.color || "brand", title: annotation.note || annotation.kind } : {};
      if (concept) parts.push(/* @__PURE__ */ React.createElement("button", { ...annotationProps, className: `bl-concept-anchor ${annotationProps.className || ""}`, key: `${start}-${end}`, "aria-label": `\u6982\u5FF5\uFF1A${text}`, onClick: () => onConcept(concept.conceptId) }, text));
      else if (annotation) parts.push(/* @__PURE__ */ React.createElement("mark", { ...annotationProps, key: `${start}-${end}` }, text));
      else parts.push(text);
    }
    return /* @__PURE__ */ React.createElement("p", { ref, id: paragraph.id, className: focus ? "focus" : "", onMouseUp: () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !ref.current?.contains(selection.anchorNode) || !ref.current.contains(selection.focusNode)) return;
      const range = selection.getRangeAt(0);
      const before = document.createRange();
      before.selectNodeContents(ref.current);
      before.setEnd(range.startContainer, range.startOffset);
      const start = before.toString().length;
      const length = range.toString().length;
      if (length > 0) onRange({ chapterId: chapter.id, paragraphId: paragraph.id, start, end: start + length });
    } }, parts, paragraphAnnotations.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "bl-annotation-count" }, paragraphAnnotations.length));
  }
  function SearchResults({ results, onSelect }) {
    return /* @__PURE__ */ React.createElement("div", { className: "bl-search-results" }, results.length ? results.slice(0, 18).map((item) => /* @__PURE__ */ React.createElement("button", { key: `${item.kind}-${item.id}-${item.paragraphId || ""}`, onClick: () => onSelect(item) }, /* @__PURE__ */ React.createElement("span", null, item.kind === "chapter" ? "\u7AE0\u8282" : item.kind === "concept" ? "\u6982\u5FF5" : "\u539F\u6587"), /* @__PURE__ */ React.createElement("strong", null, item.label), /* @__PURE__ */ React.createElement("small", null, item.excerpt))) : /* @__PURE__ */ React.createElement("p", null, "\u6CA1\u6709\u5339\u914D\u7ED3\u679C"));
  }
  function visibleChapters(book) {
    if (book.userState?.progressiveReveal === false) return book.chapters;
    const count = Math.max(1, Math.ceil(book.chapters.length * (book.userState?.progress || 0)));
    return book.chapters.slice(0, count);
  }
  function resolveSelection(book, selected) {
    if (!selected) return null;
    if (selected.kind === "chapter") return { kind: "chapter", value: book.chapters.find((item) => item.id === selected.id) };
    if (selected.kind === "concept" || selected.kind === "occurrence") return { kind: "concept", value: book.concepts.find((item) => item.id === selected.id), occurrence: selected.occurrence };
    if (selected.kind === "relation" || selected.kind === "comparison") return { kind: "relation", value: book.relations.find((item) => item.id === selected.id), comparison: selected.kind === "comparison" };
    if (selected.kind === "text") return { kind: "chapter", value: book.chapters.find((item) => item.id === selected.chapterId), paragraphId: selected.paragraphId };
    return null;
  }
  function selectionChapterIds(selection) {
    if (!selection?.value) return [];
    if (selection.kind === "chapter") return [selection.value.id];
    if (selection.kind === "concept") return [selection.occurrence?.chapterId || selection.value.firstChapterId];
    return selection.comparison ? [selection.value.source, selection.value.target] : [selection.value.source];
  }
  function focusParagraph(selection) {
    return selection?.occurrence?.paragraphId || selection?.paragraphId || selection?.value?.anchors?.[0]?.paragraphId;
  }
  function searchBook(book, query) {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    const results = [];
    for (const chapter of book.chapters) {
      if (chapter.title.toLowerCase().includes(needle)) results.push({ kind: "chapter", id: chapter.id, label: chapter.title, excerpt: chapter.summary });
      for (const paragraph of chapter.paragraphs) {
        const index2 = paragraph.text.toLowerCase().indexOf(needle);
        if (index2 >= 0) results.push({ kind: "text", id: paragraph.id, chapterId: chapter.id, paragraphId: paragraph.id, label: chapter.title, excerpt: paragraph.text.slice(Math.max(0, index2 - 36), index2 + needle.length + 60) });
      }
    }
    for (const concept of book.concepts) if (concept.label.toLowerCase().includes(needle)) results.unshift({ kind: "concept", id: concept.id, label: concept.label, excerpt: `${concept.frequency} \u6B21\u51FA\u73B0` });
    return results;
  }
  function aggregateKeywords(chapters) {
    const map = /* @__PURE__ */ new Map();
    for (const chapter of chapters) for (const item of chapter.keywords || []) map.set(item.term, (map.get(item.term) || 0) + item.weight);
    return [...map].map(([term, weight]) => ({ term, weight })).sort((a2, b) => b.weight - a2.weight);
  }
  function connectedNodeIds(links, nodeId) {
    const result = /* @__PURE__ */ new Set();
    if (!nodeId) return result;
    for (const link2 of links) {
      const source = typeof link2.source === "object" ? link2.source.id : link2.source;
      const target = typeof link2.target === "object" ? link2.target.id : link2.target;
      if (source === nodeId) result.add(target);
      if (target === nodeId) result.add(source);
    }
    return result;
  }
  function confidenceLabel(value) {
    return value === "high" || value === "user-confirmed" ? "\u9AD8\u7F6E\u4FE1" : value === "medium" ? "\u4E2D\u7F6E\u4FE1" : "\u5F85\u6821\u6B63";
  }
  function userConceptFromAnnotation(annotation) {
    return { id: `concept-user-${annotation.id}`, label: annotation.text, frequency: 1, chapterCount: 1, firstChapterId: annotation.chapterId, source: "user", occurrences: [{ chapterId: annotation.chapterId, paragraphId: annotation.paragraphId, offset: annotation.start, length: annotation.end - annotation.start, excerpt: annotation.text }] };
  }
  function viewIcon(key) {
    return key === "chapters" ? /* @__PURE__ */ React.createElement(Network, { size: 17 }) : key === "radial" ? /* @__PURE__ */ React.createElement(Waypoints, { size: 17 }) : key === "concepts" ? /* @__PURE__ */ React.createElement(GitFork, { size: 17 }) : /* @__PURE__ */ React.createElement(Cloud, { size: 17 });
  }
  function cssToken(name, element = document.documentElement) {
    const style = getComputedStyle(element);
    return style.getPropertyValue(name).trim() || style.color;
  }
  function messageOf(reason) {
    return reason?.message || String(reason || "\u672A\u77E5\u9519\u8BEF");
  }
  async function api(path, options = {}) {
    const init = { method: options.method || "GET", headers: {} };
    if (options.raw) {
      init.body = options.raw;
      init.headers["content-type"] = options.contentType || "application/octet-stream";
    } else if (options.body !== void 0) {
      init.body = JSON.stringify(options.body);
      init.headers["content-type"] = "application/json";
    }
    const response = await fetch(`${API}${path}`, init);
    const payload = await response.json().catch(() => ({ success: false, code: "INVALID_RESPONSE", message: `HTTP ${response.status}` }));
    if (!response.ok || !payload.success) {
      const error = new Error(payload.message || `HTTP ${response.status}`);
      error.code = payload.code;
      error.data = payload.data;
      throw error;
    }
    return payload.data;
  }
  function installStyles(ctx) {
    const style = document.createElement("style");
    style.dataset.bookLoom = "true";
    style.textContent = STYLES;
    document.head.append(style);
    ctx.effect(() => () => style.remove(), "dsh-book-loom: styles");
  }
  var React, useCallback, useEffect, useMemo, useRef, useState, API, RELATION_LABELS, VIEW_LABELS, DEFAULT_ANNOTATION_COLORS, BUILD_MARK, BookLoomBoundary;
  var init_client_app = __esm({
    "src/client-app.jsx"() {
      init_lucide_react();
      init_d3_force();
      init_graph_utils();
      init_styles();
      React = require_react_shim();
      ({ useCallback, useEffect, useMemo, useRef, useState } = React);
      API = "/api/dsh-book-loom";
      RELATION_LABELS = { structure: "\u7ED3\u6784", theme: "\u4E3B\u9898\u76F8\u4F3C", concept: "\u6982\u5FF5\u5171\u4EAB", argument: "\u8BBA\u8BC1\u627F\u63A5" };
      VIEW_LABELS = { chapters: "\u7AE0\u8282\u56FE", radial: "\u8109\u7EDC", concepts: "\u6982\u5FF5", words: "\u8BCD\u4E91" };
      DEFAULT_ANNOTATION_COLORS = { highlight: "brand", underline: "success", comment: "warning", concept: "error" };
      BUILD_MARK = "0.2.4";
      BookLoomBoundary = class extends React.Component {
        constructor(props) {
          super(props);
          this.state = { error: null };
        }
        static getDerivedStateFromError(error) {
          return { error };
        }
        componentDidCatch(error) {
          console.error("BookLoom panel failed", error);
        }
        render() {
          if (this.state.error) return /* @__PURE__ */ React.createElement("div", { className: "bl-fatal", role: "alert" }, /* @__PURE__ */ React.createElement(CircleAlert, { size: 28 }), /* @__PURE__ */ React.createElement("h2", null, "\u4E66\u8109\u6682\u65F6\u65E0\u6CD5\u663E\u793A"), /* @__PURE__ */ React.createElement("p", null, messageOf(this.state.error)), /* @__PURE__ */ React.createElement("button", { onClick: () => this.setState({ error: null }) }, "\u91CD\u8BD5"));
          return /* @__PURE__ */ React.createElement(BookLoomApp, null);
        }
      };
    }
  });

  // src/client-entry.js
  window.__ModuleLoader__.load({
    id: "@local/dsh-book-loom",
    factory(hostRequire) {
      globalThis.__BOOK_LOOM_REACT__ = hostRequire("react");
      const { createBookLoomPlugin: createBookLoomPlugin2 } = (init_client_app(), __toCommonJS(client_app_exports));
      return createBookLoomPlugin2();
    }
  });
})();
