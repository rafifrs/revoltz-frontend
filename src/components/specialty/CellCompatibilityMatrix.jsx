function CellCompatibilityMatrix({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-[#AAAAAA]">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-light-gray border-b border-[#AAAAAA]">
            <th className="text-left px-4 py-3 text-xs font-semibold text-deep-blue uppercase tracking-wide">Cell ID</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-deep-blue uppercase tracking-wide">IR (mΩ)</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-deep-blue uppercase tracking-wide">OCV (V)</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-deep-blue uppercase tracking-wide">Cluster</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-deep-blue uppercase tracking-wide">Outlier</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-deep-blue uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-deep-blue uppercase tracking-wide">Compatible With</th>
          </tr>
        </thead>
        <tbody>
          {results.map((cell, idx) => (
            <tr
              key={cell.cell_id}
              className={[
                'border-b border-[#AAAAAA] last:border-0 transition-colors',
                cell.is_outlier ? 'bg-red-50' : idx % 2 === 0 ? 'bg-white' : 'bg-light-gray',
              ].join(' ')}
            >
              <td className="px-4 py-3 font-mono text-[#222222] font-medium">{cell.cell_id}</td>
              <td className="px-4 py-3 text-right text-[#222222]">
                {(cell.IR_ohm * 1000).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right text-[#222222]">{cell.OCV_V.toFixed(3)}</td>
              <td className="px-4 py-3 text-center">
                {cell.cluster !== null && cell.cluster !== undefined ? (
                  <span className="inline-block px-2 py-0.5 rounded-full bg-soft-mint text-deep-blue text-xs font-semibold">
                    C{cell.cluster}
                  </span>
                ) : (
                  <span className="text-[#AAAAAA]">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {cell.is_outlier ? (
                  <span className="text-red-500 font-bold text-base" aria-label="outlier">✗</span>
                ) : (
                  <span className="text-bright-green font-bold text-base" aria-label="valid">✓</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={[
                    'inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize',
                    cell.status === 'compatible'
                      ? 'bg-green-100 text-bright-green'
                      : cell.status === 'outlier'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-50 text-yellow-700',
                  ].join(' ')}
                >
                  {cell.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {cell.compatible_with && cell.compatible_with.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {cell.compatible_with.slice(0, 4).map((id) => (
                      <span key={id} className="font-mono text-xs bg-soft-mint bg-opacity-40 text-deep-blue px-1.5 py-0.5 rounded">
                        {id}
                      </span>
                    ))}
                    {cell.compatible_with.length > 4 && (
                      <span className="text-xs text-[#AAAAAA]">+{cell.compatible_with.length - 4}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-[#AAAAAA]">None</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CellCompatibilityMatrix;
