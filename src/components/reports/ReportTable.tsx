export default function ReportTable({ rows }: { rows: any[] }) {
  return (
    <div className="report-table-wrapper rounded-xl border">
      <table className="report-table w-full text-sm">
        <thead>
          <tr>
            <th>Модуль</th>
            <th>Нэр</th>
            <th>Төлөв</th>
            <th>Ангилал</th>
            <th>Хариуцагч</th>
            <th>Огноо</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((x, index) => (
            <tr key={`report-row-${index}`}>
              <td>{x.module}</td>
              <td>{x.title || "-"}</td>
              <td>{x.status || "-"}</td>
              <td>{x.category || "-"}</td>
              <td>{x.owner || "-"}</td>
              <td>{x.date || "-"}</td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">
                Сонгосон нөхцөлөөр мэдээлэл олдсонгүй.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}