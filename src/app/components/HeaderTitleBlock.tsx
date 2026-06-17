type HeaderTitleBlockProps = {
  reference: string;
  subtitle: string;
  title: string;
};

/**
 * Displays the current page or passage title area in the app header.
 */
export function HeaderTitleBlock({ reference, subtitle, title }: HeaderTitleBlockProps) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold uppercase text-slate-500">{subtitle}</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-950">{title}</h2>
      {reference && (
        <p className="mt-2 w-fit rounded-md bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-800 ring-1 ring-blue-100">
          {reference}
        </p>
      )}
    </div>
  );
}
