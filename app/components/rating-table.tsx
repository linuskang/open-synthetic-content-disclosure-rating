interface RatingTableProps {
  title: string;
  rows: { code: string; name: string; meaning: string }[];
}

export function RatingTable({ title, rows }: RatingTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <h3 className="px-4 pt-4 text-lg font-semibold text-neutral-900">
        {title}
      </h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-neutral-500">
            <th className="w-16 px-4 py-2 font-medium">Code</th>
            <th className="w-32 px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Meaning</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((row) => (
            <tr key={row.code} className="border-t border-neutral-200">
              <td className="px-4 py-2 font-mono font-medium text-neutral-900">
                {row.code}
              </td>
              <td className="px-4 py-2 text-neutral-700">{row.name}</td>
              <td className="px-4 py-2 text-neutral-700">{row.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
