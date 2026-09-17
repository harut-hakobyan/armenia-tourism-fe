interface ImageCompressionCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ImageCompressionCheckbox({ checked, onChange }: ImageCompressionCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink/55">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-forest"
      />
      Compress image
    </label>
  );
}
