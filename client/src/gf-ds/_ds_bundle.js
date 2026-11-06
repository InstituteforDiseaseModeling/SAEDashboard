/* @ds-bundle: {"format":4,"namespace":"GatesFoundationDesignSystem_a11bc3","components":[{"name":"Gate","sourcePath":"components/brand/Gate.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Callout","sourcePath":"components/core/Callout.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"}],"sourceHashes":{"components/brand/Gate.jsx":"f361bfd65377","components/core/Badge.jsx":"5616f9a5e106","components/core/Button.jsx":"5c5c57f484d7","components/core/Callout.jsx":"aa56dc4c5fcc","components/core/Card.jsx":"d9ae4c1f6fab","components/icons/Icon.jsx":"5e074345af06","slides/slides.jsx":"fc9314af8441"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GatesFoundationDesignSystem_a11bc3 = window.GatesFoundationDesignSystem_a11bc3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Gate.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * The Gate — Gates Foundation's signature framing device. A full-bleed color
 * field with an inset, rounded content panel, acting as a visual invitation to
 * potential and an instantly recognizable brand frame — reducing the need for
 * the logo to anchor every layout.
 *
 * Construction (from the PPTX guidelines): margin X drives everything — the
 * gate color fills the page, the content panel is inset by X on all sides with
 * a corner radius of X, and content sits in a safe zone (padding 2X) inside it.
 */
function Gate({
  color = "var(--saffron)",
  // Gate field color (a palette color)
  surface = "var(--parchment)",
  // content panel fill ("transparent" over imagery)
  x = "5%",
  // margin variable X (5% of width = 0.5in on a 10in slide)
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      background: color,
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      padding: x,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      background: surface,
      borderRadius: x,
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      padding: `calc(2 * ${x})`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, children));
}
Object.assign(__ds_scope, { Gate });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Gate.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Gates Foundation badge / tag — a small pill or square label for
 * status, category, or metadata. Solid or soft (tinted) style.
 */
function Badge({
  children,
  color = "slate",
  soft = false,
  style,
  ...rest
}) {
  const palette = {
    slate: "var(--slate)",
    saffron: "var(--saffron)",
    blue: "var(--data-blue)",
    teal: "var(--data-teal)",
    red: "var(--data-red)"
  };
  const base = palette[color] || palette.slate;
  const isSaffron = color === "saffron";
  const styleSolid = {
    background: base,
    color: isSaffron ? "var(--slate)" : "var(--white)"
  };
  const styleSoft = {
    background: `color-mix(in srgb, ${base} 14%, white)`,
    color: base
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-caption)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      lineHeight: 1,
      padding: "5px 10px",
      borderRadius: "var(--radius-sm)",
      ...(soft ? styleSoft : styleSolid),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Gates Foundation button.
 * Sharp-cornered, weight-700 label. Orange = primary emphasis/CTA,
 * blue = secondary/interactive, outline = low-emphasis, ghost = quiet.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: "var(--text-body-sm)"
    },
    md: {
      padding: "12px 24px",
      fontSize: "var(--text-body-sm)"
    },
    lg: {
      padding: "14px 32px",
      fontSize: "var(--text-body)"
    }
  };
  const variants = {
    primary: {
      background: "var(--saffron)",
      color: "var(--text-on-saffron)",
      border: "var(--border-width-bold) solid var(--saffron)"
    },
    secondary: {
      background: "var(--slate)",
      color: "var(--text-on-slate)",
      border: "var(--border-width-bold) solid var(--slate)"
    },
    outline: {
      background: "transparent",
      color: "var(--slate)",
      border: "var(--border-width-bold) solid var(--slate)"
    },
    ghost: {
      background: "transparent",
      color: "var(--slate)",
      border: "var(--border-width-bold) solid transparent"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontFamily: "var(--font-body)",
      fontWeight: "var(--weight-bold)",
      lineHeight: 1,
      borderRadius: "var(--radius-sm)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background var(--duration-base) var(--ease), box-shadow var(--duration-base) var(--ease)",
      ...sizes[size],
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Gates Foundation callout — a highlighted note block with a left rule.
 * Default gold; warning (red) and success (teal) carry a soft tint fill.
 */
function Callout({
  children,
  tone = "default",
  title,
  style,
  ...rest
}) {
  const tones = {
    default: {
      rule: "var(--saffron)",
      fill: "var(--saffron-tint)"
    },
    warning: {
      rule: "var(--data-red)",
      fill: "#FDEFED"
    },
    success: {
      rule: "var(--data-teal)",
      fill: "#E8F8F5"
    },
    info: {
      rule: "var(--data-blue)",
      fill: "#EAF3FE"
    }
  };
  const t = tones[tone] || tones.default;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderLeft: `var(--divider-width) solid ${t.rule}`,
      background: t.fill,
      padding: "var(--space-4) var(--space-5)",
      fontFamily: "var(--font-body)",
      color: "var(--text-body)",
      ...style
    }
  }, rest), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: "var(--weight-bold)",
      fontSize: "var(--text-body)",
      marginBottom: "var(--space-1)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-body-sm)",
      lineHeight: "var(--leading-body)"
    }
  }, children));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Callout.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Gates Foundation content card. White surface, subtle elevation,
 * near-sharp corners. Optional top accent bar for categorization.
 */
function Card({
  children,
  accent,
  elevation = "sm",
  padded = true,
  style,
  ...rest
}) {
  const shadows = {
    none: "none",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)"
  };
  const accentColors = {
    saffron: "var(--saffron)",
    slate: "var(--slate)",
    blue: "var(--data-blue)",
    teal: "var(--data-teal)",
    red: "var(--data-red)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface-card)",
      borderRadius: "var(--radius-md)",
      boxShadow: shadows[elevation],
      borderTop: accent ? `var(--divider-width) solid ${accentColors[accent] || accent}` : "1px solid var(--border-subtle)",
      padding: padded ? "var(--space-6)" : 0,
      color: "var(--text-body)",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Gates Foundation icon. Renders an approved brand glyph (functional UI
 * icon or metaphorical theme icon) as a recolorable mask, so a single
 * asset can paint in any brand color via `color`.
 *
 * Glyph shape is identical across colorways, so the mask source uses the
 * slate file; `color` decides the actual rendered color.
 */
function Icon({
  name,
  set = "functional",
  color = "currentColor",
  size = 24,
  base = "assets/icons",
  title,
  style,
  ...rest
}) {
  const src = `${base}/${set}/${name}-slate.svg`;
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "img",
    "aria-label": title || name,
    style: {
      display: "inline-block",
      width: size,
      height: size,
      backgroundColor: color,
      WebkitMaskImage: `url("${src}")`,
      maskImage: `url("${src}")`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskSize: "contain",
      maskSize: "contain",
      flex: "none",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// slides/slides.jsx
try { (() => {
/* Gates Foundation slide system — all 71 "BMGF Layouts" template layouts.
   Fixed 1280×720 (13.333×7.5in @96dpi). 0.585in (56px) margins.
   Parchment / White / Slate grounds; Blooming Saffron as fills (never text).
   Noto Serif / condensed headlines, Noto Sans Light body.

   Families are parameterized by color + variant; the LAYOUTS registry maps each
   of the 71 catalog layouts to a family + props, and <GFLayout id={n}/> renders
   the one requested (used by the per-layout cards). */

const W = 1280,
  H = 720,
  M = 56;
const SERIF = "var(--font-display)";
const HEAD = "var(--font-headline-serif)";
const HEADSANS = "var(--font-headline)";
const SANS = "var(--font-body)";

/* color key -> [background, foreground] */
const C = {
  saffron: ["var(--saffron)", "var(--slate)"],
  slate: ["var(--slate)", "var(--parchment)"],
  parchment: ["var(--parchment)", "var(--slate)"],
  white: ["var(--white)", "var(--slate)"],
  cream: ["var(--parchment)", "var(--slate)"],
  gold: ["#E7C700", "var(--slate)"],
  turquoise: ["var(--turquoise-light)", "var(--slate)"],
  orange: ["var(--orange-medium)", "var(--parchment)"],
  darkblue: ["var(--blue-dark)", "var(--parchment)"]
};
const PHOTOS = ["../assets/imagery/classroom-community.png", "../assets/imagery/vaccine-delivery.jpeg", "../assets/imagery/solar-installation.jpeg", "../assets/imagery/health-worker-checklist.jpeg"];
const photo = i => PHOTOS[i % PHOTOS.length];
const METAS = ["vaccine", "community", "education", "healthcare"];
function Shell({
  bg = "white",
  footer = true,
  children
}) {
  const [bgc, fg] = C[bg] || C.white;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: W,
      height: H,
      background: bgc,
      position: "relative",
      fontFamily: SANS,
      fontWeight: 300,
      color: fg,
      overflow: "hidden",
      boxSizing: "border-box"
    }
  }, children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      bottom: 26,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 12,
      color: fg,
      opacity: 0.55
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800
    }
  }, "Gates Foundation"), /*#__PURE__*/React.createElement("span", null, "Foundation Overview \xB7 2025")));
}
const LogoFrame = ({
  opacity = 0.3,
  corner = "bottom-right"
}) => {
  const pos = {
    "bottom-right": {
      right: "-6%",
      bottom: "-14%"
    },
    "top-right": {
      right: "-6%",
      top: "-14%"
    },
    "bottom-left": {
      left: "-6%",
      bottom: "-14%"
    }
  }[corner];
  return /*#__PURE__*/React.createElement("img", {
    src: "../assets/logos/primary-parchment.svg",
    alt: "",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      width: "78%",
      ...pos,
      opacity,
      filter: "brightness(0) invert(1)",
      pointerEvents: "none"
    }
  });
};
const Title = ({
  children,
  fg = "var(--slate)",
  size = 40
}) => /*#__PURE__*/React.createElement("h2", {
  style: {
    fontFamily: SERIF,
    fontSize: size,
    fontWeight: 600,
    color: fg,
    margin: 0
  }
}, children);
const Rule = () => /*#__PURE__*/React.createElement("div", {
  style: {
    width: 72,
    height: 4,
    background: "var(--saffron)",
    margin: "18px 0"
  }
});
const Desc = ({
  children,
  fg
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 17,
    lineHeight: 1.5,
    color: fg,
    opacity: 0.85,
    margin: "0 0 4px",
    maxWidth: 960
  }
}, children);
const LOREM = "We work with partners in communities to create solutions so people can take charge of their futures.";

/* muted placeholder for a chart / object / graphic */
const GraphicSlot = ({
  label = "Chart",
  h = "100%"
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    width: "100%",
    height: h,
    background: "color-mix(in srgb, var(--slate) 8%, transparent)",
    border: "1px dashed color-mix(in srgb, var(--slate) 30%, transparent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--slate)",
    opacity: 0.5,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  }
}, label);
const ImgSlot = ({
  src,
  h = "100%"
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    width: "100%",
    height: h,
    overflow: "hidden",
    background: "var(--slate)"
  }
}, /*#__PURE__*/React.createElement("img", {
  src: src,
  alt: "",
  style: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
}));
const MiniBars = () => {
  const d = [42, 58, 71, 86];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 40,
      height: "100%",
      paddingTop: 10
    }
  }, d.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100%",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 20,
      fontWeight: 700,
      color: "var(--slate)",
      marginBottom: 6
    }
  }, v, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 90,
      height: `${v}%`,
      background: i === d.length - 1 ? "var(--saffron)" : "var(--slate)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginTop: 8,
      color: "var(--slate)",
      opacity: 0.7
    }
  }, 2021 + i))));
};

/* ============ FAMILIES ============ */

function TitleSlide({
  variant = "frame",
  bg = "saffron"
}) {
  const BG = {
    saffron: "#E7C700",
    slate: "#303A44",
    parchment: "#F5F3ED"
  }[bg] || "#E7C700";
  const isSlate = bg === "slate";
  const frame = variant === "frame";
  const ink = isSlate ? "#F5F3ED" : "#303A44"; /* title/subtitle/presenter */
  const dateFg = bg === "parchment" ? "#303A44" : "#FFFFFF"; /* white on saffron/slate */
  const logo = isSlate ? "../assets/logos/wordmark-gold.png" : "../assets/logos/primary-slate.svg";
  const wm = bg === "parchment" ? {
    src: "../assets/logos/title-watermark-white.png",
    op: 1
  } : {
    src: "../assets/logos/title-watermark-parchment.png",
    op: isSlate ? 0.10 : 0.32
  };
  const presenters = /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 224,
      top: frame ? 452 : 388,
      fontSize: 15,
      fontWeight: 800,
      lineHeight: 1.7,
      color: ink
    }
  }, /*#__PURE__*/React.createElement("div", null, "Presenter Name 1"), /*#__PURE__*/React.createElement("div", null, "Presenter Name 2"), /*#__PURE__*/React.createElement("div", null, "Presenter Name 3"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: W,
      height: H,
      background: BG,
      position: "relative",
      overflow: "hidden",
      fontFamily: SANS,
      fontWeight: 300,
      boxSizing: "border-box"
    }
  }, frame && /*#__PURE__*/React.createElement("img", {
    src: wm.src,
    alt: "",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: wm.op,
      pointerEvents: "none"
    }
  }), frame ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    style: {
      position: "absolute",
      left: 224,
      right: M,
      top: 188,
      margin: 0,
      fontFamily: HEAD,
      fontSize: 52,
      fontWeight: 400,
      lineHeight: 1.08,
      letterSpacing: "-0.01em",
      maxWidth: 700,
      color: ink
    }
  }, "Click to add presentation title (limit 2 lines)"), /*#__PURE__*/React.createElement("p", {
    style: {
      position: "absolute",
      left: 224,
      top: 340,
      margin: 0,
      fontSize: 22,
      color: ink
    }
  }, "Subtitle or descriptive text"), presenters, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 224,
      top: 566,
      fontSize: 14,
      fontWeight: 800,
      color: dateFg
    }
  }, "10 July 2026"), /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "Gates Foundation",
    style: {
      position: "absolute",
      left: 224,
      top: 636,
      width: 256
    }
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    style: {
      position: "absolute",
      left: 224,
      right: M,
      top: 150,
      margin: 0,
      fontFamily: HEAD,
      fontSize: 52,
      fontWeight: 400,
      lineHeight: 1.08,
      letterSpacing: "-0.01em",
      maxWidth: 840,
      color: ink
    }
  }, "Click to add presentation title (limit 2 lines)"), /*#__PURE__*/React.createElement("p", {
    style: {
      position: "absolute",
      left: 224,
      top: 300,
      margin: 0,
      fontSize: 24,
      color: ink
    }
  }, "Subtitle or descriptive text"), presenters, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: M,
      top: 29,
      fontSize: 14,
      fontWeight: 800,
      color: ink,
      textAlign: "right"
    }
  }, "10 July 2026"), /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "Gates Foundation",
    style: {
      position: "absolute",
      left: 34,
      top: 560,
      width: 1213
    }
  })));
}
function Divider({
  bg = "saffron",
  n = "01",
  label = "Global Health & Development"
}) {
  const bgKey = bg === "saffron" ? "gold" : bg;
  const [, fg] = C[bgKey];
  const light = bgKey === "gold" || bgKey === "parchment" || bgKey === "turquoise";
  return /*#__PURE__*/React.createElement(Shell, {
    bg: bgKey,
    footer: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: M,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 54,
      lineHeight: 1,
      maxWidth: 1040
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: bgKey === "gold" ? "var(--parchment)" : "var(--saffron)",
      fontWeight: 400
    }
  }, "Divider Slide: "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: fg,
      fontWeight: 300
    }
  }, "Section Name"))));
}
function Quote({
  bg = "slate"
}) {
  const bgKey = bg === "saffron" ? "gold" : bg;
  const [, fg] = C[bgKey];
  const gold = bgKey === "gold" ? "var(--parchment)" : "var(--saffron)";
  return /*#__PURE__*/React.createElement(Shell, {
    bg: bgKey,
    footer: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: 192,
      fontFamily: "var(--font-display)",
      fontSize: 54,
      fontWeight: 400,
      lineHeight: 1,
      color: fg,
      maxWidth: 900
    }
  }, "Quote or key fact."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: 336,
      fontFamily: "var(--font-display)",
      fontSize: 54,
      fontWeight: 400,
      lineHeight: 1.05,
      color: gold,
      maxWidth: 900
    }
  }, "May be used as", /*#__PURE__*/React.createElement("br", null), "a divider slide."));
}
function Standard({
  bg = "white",
  desc = true,
  title = "What we accomplished"
}) {
  const [, fg] = C[bg];
  return /*#__PURE__*/React.createElement(Shell, {
    bg: bg
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M,
      bottom: 70
    }
  }, /*#__PURE__*/React.createElement(Title, {
    fg: fg
  }, title), desc && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.5,
      color: fg,
      opacity: 0.85,
      margin: "10px 0 0",
      maxWidth: 900
    }
  }, "A short narrative line introduces the content and frames why it matters."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: "6px 0 0",
      paddingLeft: 20,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      maxWidth: 940
    }
  }, /*#__PURE__*/React.createElement("li", {
    style: {
      fontSize: 17,
      lineHeight: 1.5,
      color: fg
    }
  }, "Vaccine access extended to 2M additional households across four regions."), /*#__PURE__*/React.createElement("li", {
    style: {
      fontSize: 17,
      lineHeight: 1.5,
      color: fg
    }
  }, "Childhood mortality reduced 15% in priority districts year over year."), /*#__PURE__*/React.createElement("li", {
    style: {
      fontSize: 17,
      lineHeight: 1.5,
      color: fg
    }
  }, "Trained 4,500 community health workers to sustain local delivery."))));
}
function BasicText({
  bg = "slate"
}) {
  const [, fg] = C[bg];
  return /*#__PURE__*/React.createElement(Shell, {
    bg: bg,
    footer: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M,
      bottom: M,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: HEAD,
      fontSize: 40,
      fontWeight: 400,
      color: fg,
      margin: 0,
      maxWidth: 1000,
      lineHeight: 1.22
    }
  }, "Complex problems require collaboration and partnership, innovation, and long-term investment.")));
}
function Blank({
  bg = "white"
}) {
  const [, fg] = C[bg];
  return /*#__PURE__*/React.createElement(Shell, {
    bg: bg,
    footer: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      top: M,
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: fg,
      opacity: 0.3
    }
  }, "Blank"));
}
function Columns({
  cols = 3,
  headers = true,
  photos = false,
  title = "Our approach"
}) {
  const arr = Array.from({
    length: cols
  });
  return /*#__PURE__*/React.createElement(Shell, {
    bg: "white"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M,
      bottom: 70
    }
  }, /*#__PURE__*/React.createElement(Title, null, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${cols},1fr)`,
      gap: 22,
      marginTop: 22
    }
  }, arr.map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, photos && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 150,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(ImgSlot, {
    src: photo(i)
  })), headers && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 19,
      fontWeight: 600,
      color: "var(--slate)",
      borderTop: "4px solid var(--saffron)",
      paddingTop: 10,
      marginBottom: 8
    }
  }, "Focus area ", i + 1), !headers && !photos && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: "var(--saffron)",
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      lineHeight: 1.5,
      color: "var(--slate)",
      opacity: 0.85,
      margin: 0
    }
  }, LOREM))))));
}
function FullImage({
  withTitle = true
}) {
  return /*#__PURE__*/React.createElement(Shell, {
    footer: false
  }, /*#__PURE__*/React.createElement(ImgSlot, {
    src: photo(0)
  }), withTitle && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, rgba(49,58,68,0.9) 0%, rgba(49,58,68,0.6) 42%, rgba(49,58,68,0) 74%)"
    }
  }), withTitle && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: HEAD,
      fontSize: 52,
      fontWeight: 400,
      color: "var(--parchment)",
      margin: 0,
      lineHeight: 1.08
    }
  }, "Delivering care to the last mile"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.5,
      color: "var(--parchment)",
      opacity: 0.9,
      marginTop: 16
    }
  }, "Community health workers extend immunization to families far from the nearest clinic.")));
}
function FullGraphic({
  withTitle = true
}) {
  return /*#__PURE__*/React.createElement(Shell, {
    bg: "parchment",
    footer: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: withTitle ? 150 : M,
      bottom: M
    }
  }, /*#__PURE__*/React.createElement(MiniBars, null)), withTitle && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M
    }
  }, /*#__PURE__*/React.createElement(Title, null, "Coverage growth"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: "var(--slate)",
      opacity: 0.8,
      margin: "8px 0 0"
    }
  }, "Priority districts, 2021\u20132024")));
}
function TextVisual({
  kind = "image",
  large = false
}) {
  return /*#__PURE__*/React.createElement(Shell, {
    bg: "white"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M,
      bottom: 70,
      display: "flex",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: large ? 1.4 : 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Title, {
    size: large ? 44 : 36
  }, "Framing progress through human stories"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: large ? 20 : 17,
      lineHeight: 1.5,
      color: "var(--slate)",
      opacity: 0.88,
      margin: "18px 0 0",
      maxWidth: 560
    }
  }, LOREM, " We measure our progress and share results openly, no matter the outcome.")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex"
    }
  }, kind === "image" ? /*#__PURE__*/React.createElement(ImgSlot, {
    src: photo(1)
  }) : /*#__PURE__*/React.createElement(GraphicSlot, {
    label: "Table / chart"
  }))));
}
function Split() {
  return /*#__PURE__*/React.createElement(Shell, {
    bg: "white"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M,
      bottom: 70,
      display: "flex",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(GraphicSlot, {
    label: "Object"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 3
    }
  }, /*#__PURE__*/React.createElement(ImgSlot, {
    src: photo(2)
  }))));
}
function Sidebar({
  media = "image",
  bg = "parchment",
  side = "left"
}) {
  const bgKey = bg === "saffron" ? "gold" : bg;
  const barBg = C[bgKey][0],
    barFg = C[bgKey][1];
  const bar = /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      background: barBg,
      color: barFg,
      padding: 40,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HEAD,
      fontSize: 30,
      fontWeight: 400,
      lineHeight: 1.1
    }
  }, "A note on our approach"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      lineHeight: 1.5,
      opacity: 0.85,
      marginTop: 12
    }
  }, LOREM));
  const main = /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, media === "image" ? /*#__PURE__*/React.createElement(ImgSlot, {
    src: photo(3)
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      padding: 40,
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(MiniBars, null)));
  return /*#__PURE__*/React.createElement(Shell, {
    footer: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      width: "100%",
      height: "100%"
    }
  }, side === "left" ? /*#__PURE__*/React.createElement(React.Fragment, null, bar, main) : /*#__PURE__*/React.createElement(React.Fragment, null, main, bar)));
}
function PhotoGrid({
  rows = 2,
  cols = 2,
  withText = false,
  headings = false,
  title = "In the field"
}) {
  const n = rows * cols;
  const top = withText || headings || title ? 132 : M;
  return /*#__PURE__*/React.createElement(Shell, {
    bg: "white",
    footer: false
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M
    }
  }, /*#__PURE__*/React.createElement(Title, {
    size: 34
  }, title), withText && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: "var(--slate)",
      opacity: 0.8,
      margin: "8px 0 0",
      maxWidth: 900
    }
  }, LOREM)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top,
      bottom: M,
      display: "grid",
      gridTemplateColumns: `repeat(${cols},1fr)`,
      gridTemplateRows: `repeat(${rows},1fr)`,
      gap: 14
    }
  }, Array.from({
    length: n
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(ImgSlot, {
    src: photo(i)
  })), headings && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: "var(--slate)",
      marginTop: 6
    }
  }, "Caption ", i + 1)))));
}
function KeyFigures() {
  const figs = [["2M", "households reached"], ["15%", "lower child mortality"], ["4,500", "health workers trained"], ["130+", "countries"], ["$8.6B", "annual budget"], ["1.2B", "people by 2030"]];
  return /*#__PURE__*/React.createElement(Shell, {
    bg: "parchment"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M
    }
  }, /*#__PURE__*/React.createElement(Title, null, "Key figures"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "34px 40px",
      marginTop: 26
    }
  }, figs.map(([v, l], i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HEADSANS,
      fontWeight: 900,
      fontSize: 60,
      color: "var(--slate)",
      lineHeight: 0.95,
      letterSpacing: "-1px"
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 88,
      height: 4,
      background: "var(--saffron)",
      margin: "10px 0"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: "var(--slate)",
      opacity: 0.85
    }
  }, l))))));
}
function Boxes({
  n = 5,
  bg = "slate",
  headers = false
}) {
  const [boxBg, boxFg] = bg === "cream" ? [C.white[0], C.slate[1]] : [C.slate[0], C.slate[1] === "var(--parchment)" ? "var(--parchment)" : "var(--parchment)"];
  const pageBg = bg === "cream" ? "parchment" : "white";
  const fill = bg === "cream" ? "var(--parchment)" : "var(--slate)";
  const fg = bg === "cream" ? "var(--slate)" : "var(--parchment)";
  return /*#__PURE__*/React.createElement(Shell, {
    bg: pageBg
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M,
      bottom: 70
    }
  }, /*#__PURE__*/React.createElement(Title, null, "Focus areas"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${n},1fr)`,
      gap: 16,
      marginTop: 26
    }
  }, Array.from({
    length: n
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: fill,
      color: fg,
      padding: 22,
      minHeight: 300,
      borderTop: "4px solid var(--saffron)"
    }
  }, headers && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 10
    }
  }, "Area ", i + 1), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.5,
      opacity: 0.88,
      margin: 0
    }
  }, LOREM))))));
}
function Topics({
  n = 3,
  bg = "slate"
}) {
  const fill = bg === "cream" ? "var(--parchment)" : "var(--slate)";
  const fg = bg === "cream" ? "var(--slate)" : "var(--parchment)";
  const pageBg = bg === "cream" ? "white" : "parchment";
  return /*#__PURE__*/React.createElement(Shell, {
    bg: pageBg
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M,
      bottom: 70
    }
  }, /*#__PURE__*/React.createElement(Title, null, n, " priorities"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${n},1fr)`,
      gap: 20,
      marginTop: 26
    }
  }, Array.from({
    length: n
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: fill,
      color: fg,
      padding: 30,
      minHeight: 320
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HEADSANS,
      fontWeight: 900,
      fontSize: 40,
      color: "var(--saffron)",
      lineHeight: 1
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      fontWeight: 600,
      margin: "14px 0 10px"
    }
  }, "Topic ", i + 1), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.5,
      opacity: 0.88,
      margin: 0
    }
  }, LOREM))))));
}
function CircleIcons() {
  return /*#__PURE__*/React.createElement(Shell, {
    bg: "white"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M,
      bottom: 70
    }
  }, /*#__PURE__*/React.createElement(Title, null, "How we work"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 24,
      marginTop: 26
    }
  }, METAS.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 108,
      height: 108,
      borderRadius: "50%",
      background: "var(--saffron)",
      margin: "0 auto 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `../assets/icons/metaphorical/${m}-slate.svg`,
    alt: "",
    style: {
      width: 60,
      height: 60
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 18,
      fontWeight: 600,
      color: "var(--slate)",
      marginBottom: 8,
      textTransform: "capitalize"
    }
  }, m), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: "var(--slate)",
      opacity: 0.85,
      margin: 0
    }
  }, LOREM))))));
}
function Headshots({
  count = 12
}) {
  const cols = count <= 5 ? count : count <= 12 ? 6 : count <= 16 ? 8 : count <= 24 ? 8 : 10;
  return /*#__PURE__*/React.createElement(Shell, {
    bg: "parchment",
    footer: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: M,
      right: M,
      top: M
    }
  }, /*#__PURE__*/React.createElement(Title, {
    size: 34
  }, "Our leadership"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${cols},1fr)`,
      gap: "22px 16px",
      marginTop: 18
    }
  }, Array.from({
    length: count
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      aspectRatio: "1",
      borderRadius: "50%",
      background: "var(--slate)",
      opacity: 0.12,
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 800,
      color: "var(--slate)"
    }
  }, "Name ", i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--slate)",
      opacity: 0.7
    }
  }, "Title"))))));
}
function EndSlide({
  bg = "saffron"
}) {
  const bgKey = bg === "saffron" ? "gold" : bg;
  const [, fg] = C[bgKey];
  const light = bgKey === "gold";
  return /*#__PURE__*/React.createElement(Shell, {
    bg: bgKey,
    footer: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 30,
      top: 30,
      fontFamily: HEAD,
      fontSize: 40,
      fontWeight: 400,
      color: fg
    }
  }, "gatesfoundation.org"), /*#__PURE__*/React.createElement("img", {
    src: light ? "../assets/logos/primary-slate.svg" : "../assets/logos/primary-parchment.svg",
    alt: "Gates Foundation",
    style: {
      position: "absolute",
      left: M,
      bottom: 42,
      width: 1099
    }
  }));
}

/* ============ 71-LAYOUT REGISTRY ============ */
const G = {
  title: "Slides · Title",
  div: "Slides · Dividers",
  quote: "Slides · Quotes",
  text: "Slides · Text",
  col: "Slides · Columns",
  img: "Slides · Imagery",
  side: "Slides · Sidebar",
  grid: "Slides · Grids",
  stat: "Slides · Stats",
  head: "Slides · Headshots",
  end: "Slides · End"
};
const LAYOUTS = {
  1: {
    g: G.title,
    name: "Title — Logo Frame, Saffron",
    r: () => /*#__PURE__*/React.createElement(TitleSlide, {
      variant: "frame",
      bg: "saffron"
    })
  },
  2: {
    g: G.title,
    name: "Title — Logo Frame, Slate",
    r: () => /*#__PURE__*/React.createElement(TitleSlide, {
      variant: "frame",
      bg: "slate"
    })
  },
  3: {
    g: G.title,
    name: "Title — Logo Frame, Parchment",
    r: () => /*#__PURE__*/React.createElement(TitleSlide, {
      variant: "frame",
      bg: "parchment"
    })
  },
  4: {
    g: G.title,
    name: "Title — Text Only, Saffron",
    r: () => /*#__PURE__*/React.createElement(TitleSlide, {
      variant: "text",
      bg: "saffron"
    })
  },
  5: {
    g: G.title,
    name: "Title — Text Only, Slate",
    r: () => /*#__PURE__*/React.createElement(TitleSlide, {
      variant: "text",
      bg: "slate"
    })
  },
  6: {
    g: G.title,
    name: "Title — Text Only, Parchment",
    r: () => /*#__PURE__*/React.createElement(TitleSlide, {
      variant: "text",
      bg: "parchment"
    })
  },
  7: {
    g: G.div,
    name: "Section Divider — Slate",
    r: () => /*#__PURE__*/React.createElement(Divider, {
      bg: "slate"
    })
  },
  8: {
    g: G.div,
    name: "Section Divider — Parchment",
    r: () => /*#__PURE__*/React.createElement(Divider, {
      bg: "parchment"
    })
  },
  9: {
    g: G.div,
    name: "Section Divider — Saffron",
    r: () => /*#__PURE__*/React.createElement(Divider, {
      bg: "saffron"
    })
  },
  10: {
    g: G.div,
    name: "Section Divider — Light Turquoise",
    r: () => /*#__PURE__*/React.createElement(Divider, {
      bg: "turquoise"
    })
  },
  11: {
    g: G.div,
    name: "Section Divider — Orange",
    r: () => /*#__PURE__*/React.createElement(Divider, {
      bg: "orange"
    })
  },
  12: {
    g: G.div,
    name: "Section Divider — Dark Blue",
    r: () => /*#__PURE__*/React.createElement(Divider, {
      bg: "darkblue"
    })
  },
  13: {
    g: G.quote,
    name: "Quote — Slate",
    r: () => /*#__PURE__*/React.createElement(Quote, {
      bg: "slate"
    })
  },
  14: {
    g: G.quote,
    name: "Quote — Saffron",
    r: () => /*#__PURE__*/React.createElement(Quote, {
      bg: "saffron"
    })
  },
  15: {
    g: G.quote,
    name: "Quote — Parchment",
    r: () => /*#__PURE__*/React.createElement(Quote, {
      bg: "parchment"
    })
  },
  16: {
    g: G.text,
    name: "Standard Slide — White",
    r: () => /*#__PURE__*/React.createElement(Standard, {
      bg: "white"
    })
  },
  17: {
    g: G.text,
    name: "Standard Slide — Parchment",
    r: () => /*#__PURE__*/React.createElement(Standard, {
      bg: "parchment"
    })
  },
  18: {
    g: G.text,
    name: "Basic Text — Slate",
    r: () => /*#__PURE__*/React.createElement(BasicText, {
      bg: "slate"
    })
  },
  19: {
    g: G.text,
    name: "Basic Text — Parchment",
    r: () => /*#__PURE__*/React.createElement(BasicText, {
      bg: "parchment"
    })
  },
  20: {
    g: G.text,
    name: "Basic Text — White",
    r: () => /*#__PURE__*/React.createElement(BasicText, {
      bg: "white"
    })
  },
  21: {
    g: G.text,
    name: "Blank — White",
    r: () => /*#__PURE__*/React.createElement(Blank, {
      bg: "white"
    })
  },
  22: {
    g: G.text,
    name: "Blank — Parchment",
    r: () => /*#__PURE__*/React.createElement(Blank, {
      bg: "parchment"
    })
  },
  23: {
    g: G.col,
    name: "2 Columns + headers",
    r: () => /*#__PURE__*/React.createElement(Columns, {
      cols: 2,
      headers: true
    })
  },
  24: {
    g: G.col,
    name: "2 Columns, no headers",
    r: () => /*#__PURE__*/React.createElement(Columns, {
      cols: 2,
      headers: false
    })
  },
  25: {
    g: G.col,
    name: "3 Columns + headers",
    r: () => /*#__PURE__*/React.createElement(Columns, {
      cols: 3,
      headers: true
    })
  },
  26: {
    g: G.col,
    name: "4 Columns + headers",
    r: () => /*#__PURE__*/React.createElement(Columns, {
      cols: 4,
      headers: true
    })
  },
  27: {
    g: G.col,
    name: "4 Columns + photos",
    r: () => /*#__PURE__*/React.createElement(Columns, {
      cols: 4,
      headers: true,
      photos: true
    })
  },
  71: {
    g: G.col,
    name: "3 Columns, no headers",
    r: () => /*#__PURE__*/React.createElement(Columns, {
      cols: 3,
      headers: false
    })
  },
  28: {
    g: G.img,
    name: "Image + title & subhead",
    r: () => /*#__PURE__*/React.createElement(FullImage, {
      withTitle: true
    })
  },
  29: {
    g: G.img,
    name: "Graphic + title & subhead",
    r: () => /*#__PURE__*/React.createElement(FullGraphic, {
      withTitle: true
    })
  },
  30: {
    g: G.img,
    name: "Graphic, no title",
    r: () => /*#__PURE__*/React.createElement(FullGraphic, {
      withTitle: false
    })
  },
  31: {
    g: G.img,
    name: "Large text + image",
    r: () => /*#__PURE__*/React.createElement(TextVisual, {
      kind: "image",
      large: true
    })
  },
  32: {
    g: G.img,
    name: "Large text + table/chart",
    r: () => /*#__PURE__*/React.createElement(TextVisual, {
      kind: "object",
      large: true
    })
  },
  33: {
    g: G.img,
    name: "Text + image",
    r: () => /*#__PURE__*/React.createElement(TextVisual, {
      kind: "image"
    })
  },
  34: {
    g: G.img,
    name: "Text + table/chart",
    r: () => /*#__PURE__*/React.createElement(TextVisual, {
      kind: "object"
    })
  },
  35: {
    g: G.img,
    name: "Split — 2 objects 1:3",
    r: () => /*#__PURE__*/React.createElement(Split, null)
  },
  36: {
    g: G.side,
    name: "Sidebar — image, Parchment",
    r: () => /*#__PURE__*/React.createElement(Sidebar, {
      media: "image",
      bg: "parchment"
    })
  },
  37: {
    g: G.side,
    name: "Sidebar — graphic, Parchment",
    r: () => /*#__PURE__*/React.createElement(Sidebar, {
      media: "graphic",
      bg: "parchment"
    })
  },
  38: {
    g: G.side,
    name: "Sidebar — image, Slate",
    r: () => /*#__PURE__*/React.createElement(Sidebar, {
      media: "image",
      bg: "slate"
    })
  },
  39: {
    g: G.side,
    name: "Sidebar — image, Saffron",
    r: () => /*#__PURE__*/React.createElement(Sidebar, {
      media: "image",
      bg: "saffron"
    })
  },
  40: {
    g: G.side,
    name: "Sidebar — graphic, Slate",
    r: () => /*#__PURE__*/React.createElement(Sidebar, {
      media: "graphic",
      bg: "slate",
      side: "right"
    })
  },
  41: {
    g: G.side,
    name: "Sidebar — graphic, Saffron",
    r: () => /*#__PURE__*/React.createElement(Sidebar, {
      media: "graphic",
      bg: "saffron",
      side: "right"
    })
  },
  42: {
    g: G.grid,
    name: "4-col text + images + headers",
    r: () => /*#__PURE__*/React.createElement(PhotoGrid, {
      rows: 1,
      cols: 4,
      headings: true,
      withText: true
    })
  },
  43: {
    g: G.grid,
    name: "4-col images + headings",
    r: () => /*#__PURE__*/React.createElement(PhotoGrid, {
      rows: 1,
      cols: 4,
      headings: true
    })
  },
  44: {
    g: G.grid,
    name: "2×2 grid + text",
    r: () => /*#__PURE__*/React.createElement(PhotoGrid, {
      rows: 2,
      cols: 2,
      withText: true
    })
  },
  45: {
    g: G.grid,
    name: "3 photos + text",
    r: () => /*#__PURE__*/React.createElement(PhotoGrid, {
      rows: 1,
      cols: 3,
      withText: true
    })
  },
  46: {
    g: G.grid,
    name: "5 images + headings",
    r: () => /*#__PURE__*/React.createElement(PhotoGrid, {
      rows: 1,
      cols: 5,
      headings: true
    })
  },
  47: {
    g: G.grid,
    name: "2×1 grid",
    r: () => /*#__PURE__*/React.createElement(PhotoGrid, {
      rows: 1,
      cols: 2,
      title: ""
    })
  },
  48: {
    g: G.grid,
    name: "2×2 grid",
    r: () => /*#__PURE__*/React.createElement(PhotoGrid, {
      rows: 2,
      cols: 2,
      title: ""
    })
  },
  49: {
    g: G.grid,
    name: "2×3 grid",
    r: () => /*#__PURE__*/React.createElement(PhotoGrid, {
      rows: 2,
      cols: 3,
      title: ""
    })
  },
  50: {
    g: G.stat,
    name: "Key Figures Grid",
    r: () => /*#__PURE__*/React.createElement(KeyFigures, null)
  },
  51: {
    g: G.stat,
    name: "5-col boxes — Slate",
    r: () => /*#__PURE__*/React.createElement(Boxes, {
      n: 5,
      bg: "slate"
    })
  },
  52: {
    g: G.stat,
    name: "5-col boxes — Cream",
    r: () => /*#__PURE__*/React.createElement(Boxes, {
      n: 5,
      bg: "cream"
    })
  },
  53: {
    g: G.stat,
    name: "5-col boxes + headers",
    r: () => /*#__PURE__*/React.createElement(Boxes, {
      n: 5,
      bg: "slate",
      headers: true
    })
  },
  54: {
    g: G.stat,
    name: "2-topic — Slate",
    r: () => /*#__PURE__*/React.createElement(Topics, {
      n: 2,
      bg: "slate"
    })
  },
  55: {
    g: G.stat,
    name: "2-topic — Saffron/Cream",
    r: () => /*#__PURE__*/React.createElement(Topics, {
      n: 2,
      bg: "cream"
    })
  },
  56: {
    g: G.stat,
    name: "3-topic — Slate",
    r: () => /*#__PURE__*/React.createElement(Topics, {
      n: 3,
      bg: "slate"
    })
  },
  57: {
    g: G.stat,
    name: "3-topic — Cream",
    r: () => /*#__PURE__*/React.createElement(Topics, {
      n: 3,
      bg: "cream"
    })
  },
  58: {
    g: G.stat,
    name: "4-topic — Slate",
    r: () => /*#__PURE__*/React.createElement(Topics, {
      n: 4,
      bg: "slate"
    })
  },
  59: {
    g: G.stat,
    name: "4-topic — Cream",
    r: () => /*#__PURE__*/React.createElement(Topics, {
      n: 4,
      bg: "cream"
    })
  },
  60: {
    g: G.stat,
    name: "4 boxes + circle icons",
    r: () => /*#__PURE__*/React.createElement(CircleIcons, null)
  },
  61: {
    g: G.head,
    name: "Headshots — up to 5",
    r: () => /*#__PURE__*/React.createElement(Headshots, {
      count: 5
    })
  },
  62: {
    g: G.head,
    name: "Headshots — up to 10",
    r: () => /*#__PURE__*/React.createElement(Headshots, {
      count: 10
    })
  },
  63: {
    g: G.head,
    name: "Headshots — up to 12",
    r: () => /*#__PURE__*/React.createElement(Headshots, {
      count: 12
    })
  },
  64: {
    g: G.head,
    name: "Headshots — up to 14",
    r: () => /*#__PURE__*/React.createElement(Headshots, {
      count: 14
    })
  },
  65: {
    g: G.head,
    name: "Headshots — up to 16",
    r: () => /*#__PURE__*/React.createElement(Headshots, {
      count: 16
    })
  },
  66: {
    g: G.head,
    name: "Headshots — up to 20",
    r: () => /*#__PURE__*/React.createElement(Headshots, {
      count: 20
    })
  },
  67: {
    g: G.head,
    name: "Headshots — up to 24",
    r: () => /*#__PURE__*/React.createElement(Headshots, {
      count: 24
    })
  },
  68: {
    g: G.head,
    name: "Headshots — up to 30",
    r: () => /*#__PURE__*/React.createElement(Headshots, {
      count: 30
    })
  },
  69: {
    g: G.end,
    name: "End Slide — Saffron",
    r: () => /*#__PURE__*/React.createElement(EndSlide, {
      bg: "saffron"
    })
  },
  70: {
    g: G.end,
    name: "End Slide — Slate",
    r: () => /*#__PURE__*/React.createElement(EndSlide, {
      bg: "slate"
    })
  }
};
function GFLayout({
  id
}) {
  const entry = LAYOUTS[id];
  return entry ? entry.r() : /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: M
    }
  }, "Unknown layout ", id));
}
Object.assign(window, {
  GFLayout,
  GF_LAYOUTS: LAYOUTS,
  GatesSlide: Shell,
  TitleSlide,
  Divider,
  Quote,
  Standard,
  BasicText,
  Blank,
  Columns,
  FullImage,
  FullGraphic,
  TextVisual,
  Split,
  Sidebar,
  PhotoGrid,
  KeyFigures,
  Boxes,
  Topics,
  CircleIcons,
  Headshots,
  EndSlide,
  // back-compat aliases for the original hand-authored cards
  SectionDivider: () => /*#__PURE__*/React.createElement(Divider, {
    bg: "saffron"
  }),
  TitleBodySlide: () => /*#__PURE__*/React.createElement(Standard, {
    bg: "white"
  }),
  TwoColumnSlide: () => /*#__PURE__*/React.createElement(Columns, {
    cols: 2,
    headers: true
  }),
  DataSlide: () => /*#__PURE__*/React.createElement(FullGraphic, {
    withTitle: true
  }),
  QuoteSlide: () => /*#__PURE__*/React.createElement(Quote, {
    bg: "slate"
  }),
  CalloutSlide: () => /*#__PURE__*/React.createElement(KeyFigures, null),
  PhotoSlide: () => /*#__PURE__*/React.createElement(FullImage, {
    withTitle: true
  })
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/slides.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Gate = __ds_scope.Gate;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

})();
