export type GetTemplateIdArgs = {
  merchantName?: string;
  templateName?: string;
  variant?: string;
  staticTemplateId?: string;
};

function normalize(value?: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function buildDynamicTemplateId(
  merchantName: string,
  templateName: string,
  variant: string
): string {
  return `${normalize(merchantName)}_${normalize(templateName)}_${normalize(
    variant
  )}`;
}

export function buildStaticTemplateId(staticTemplateId: string): string {
  return `${normalize(staticTemplateId)}`;
}

export function getTemplateId(args: GetTemplateIdArgs): string {
  const merchantName = normalize(args.merchantName);
  const templateName = normalize(args?.templateName);

  if (templateName) {
    const variant = normalize(args.variant || "default");
    return buildDynamicTemplateId(merchantName, templateName, variant);
  }

  if (args.staticTemplateId) {
    return buildStaticTemplateId(args.staticTemplateId);
  }

  return "common";
}
