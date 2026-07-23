export function ThemeInjector({ themeCss }: { themeCss: string }) {
  if (!themeCss) return null;
  return <style dangerouslySetInnerHTML={{ __html: themeCss }} />;
}
