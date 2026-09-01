import { useQuery } from "@tanstack/react-query";
import { siteContentQueryOptions } from "@/lib/content.functions";

/**
 * Applies AI/admin-editable UI/UX settings (design tokens + raw CSS) to the
 * whole site. Every value comes from the `site_content` table so DOSAAA can
 * change look & feel from a prompt.
 *
 * Supported keys:
 *  ui_accent, ui_text_color, ui_muted_color, ui_bg_color,
 *  ui_heading_font, ui_body_font, ui_font_url,
 *  ui_radius, ui_glass_bg, ui_glass_border, ui_max_width,
 *  ui_heading_weight, ui_letter_spacing, ui_custom_css
 */
export function SiteStyle() {
  const { data } = useQuery(siteContentQueryOptions);
  const get = (key: string) => {
    const v = data?.[key];
    return v && v.trim().length > 0 ? v.trim() : undefined;
  };

  const accent = get("ui_accent");
  const text = get("ui_text_color");
  const muted = get("ui_muted_color");
  const bg = get("ui_bg_color");
  const headingFont = get("ui_heading_font");
  const bodyFont = get("ui_body_font");
  const fontUrl = get("ui_font_url");
  const radius = get("ui_radius");
  const glassBg = get("ui_glass_bg");
  const glassBorder = get("ui_glass_border");
  const maxWidth = get("ui_max_width");
  const headingWeight = get("ui_heading_weight");
  const letterSpacing = get("ui_letter_spacing");
  const customCss = get("ui_custom_css");

  const vars = [
    accent && `--site-accent: ${accent};`,
    text && `--site-text: ${text};`,
    muted && `--site-muted: ${muted};`,
    radius && `--site-radius: ${radius};`,
    glassBg && `--site-glass-bg: ${glassBg};`,
    glassBorder && `--site-glass-border: ${glassBorder};`,
  ]
    .filter(Boolean)
    .join("\n");

  const css = `
:root{
${vars}
}
${bg ? `body{background-color:${bg};}` : ""}
${text ? `body,main{color:${text};}` : ""}
${bodyFont ? `body{font-family:${bodyFont};}` : ""}
${headingFont ? `h1,h2,h3,h4{font-family:${headingFont};}` : ""}
${headingWeight ? `h1,h2,h3{font-weight:${headingWeight};}` : ""}
${letterSpacing ? `h1,h2{letter-spacing:${letterSpacing};}` : ""}
${muted ? `.text-white\\/60,.text-white\\/50,.text-white\\/70{color:${muted};}` : ""}
${radius ? `.rounded-3xl,.rounded-2xl{border-radius:${radius};}` : ""}
${glassBg ? `[data-glass]{background:${glassBg};}` : ""}
${glassBorder ? `[data-glass]{border-color:${glassBorder};}` : ""}
${maxWidth ? `.max-w-7xl,.max-w-6xl,.max-w-5xl{max-width:${maxWidth};}` : ""}
${customCss ?? ""}
`;

  return (
    <>
      {fontUrl ? <link rel="stylesheet" href={fontUrl} /> : null}
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
