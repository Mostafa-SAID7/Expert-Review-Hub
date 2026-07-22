import { useLang } from "@/contexts/lang-context";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="w-full border-t border-border/40 bg-muted/20 py-8 mt-auto">
      <div className="container px-4 md:px-8 max-w-screen-2xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
        <h3 className="font-serif text-lg font-bold text-primary">{t("appName")}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{t("footer_tagline")}</p>
        <div className="bg-primary/5 border border-primary/20 text-primary/80 rounded-md p-3 text-xs w-full max-w-lg mt-4">
          <strong>{t("footer_disclaimer_title")}:</strong> {t("footer_disclaimer")}
        </div>
      </div>
    </footer>
  );
}
