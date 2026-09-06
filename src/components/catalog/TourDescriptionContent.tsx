const imageLinePattern = /^!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)$/;

export function TourDescriptionContent({ description }: { description: string | null }) {
  if (!description) return null;

  return (
    <div className="space-y-3 leading-8 text-ink/65">
      {description.split(/\r\n|\r|\n/).map((line, index) => {
        const content = line.trim();
        if (!content)
          return <div key={index} aria-hidden="true" className="h-3" />;

        const image = content.match(imageLinePattern);
        if (image) {
          return (
            <figure key={index} className="py-3">
              <img
                src={image[2]}
                alt={image[1]}
                loading="lazy"
                className="max-h-[640px] w-full rounded-2xl object-cover shadow-sm"
              />
            </figure>
          );
        }

        const heading =
          /^\d+\.\s/.test(content) ||
          /^\p{Extended_Pictographic}/u.test(content);
        return heading ? (
          <h3 key={index} className="text-lg font-bold text-ink">
            {content}
          </h3>
        ) : (
          <p key={index}>{content}</p>
        );
      })}
    </div>
  );
}
