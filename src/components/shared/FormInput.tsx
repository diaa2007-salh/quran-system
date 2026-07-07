export function FormInput({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  dir,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        dir={dir}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/60 focus:border-primary"
      />
    </div>
  );
}
