export default function ReportTable({ rows }: { rows: any[] }) {
  return (
    <div className="report-table-wrapper overflow-auto rounded-xl border">
      <table className="report-table w-full min-w-[1300px] text-sm">
        <thead>
          <tr>
            <th>Модуль</th>
            <th>Гарчиг</th>
            <th>Төрөл</th>
            <th>Ангилал</th>
            <th>Эрсдэлийн түвшин</th>
            <th>Төлөв</th>
            <th>Хариуцагч</th>
            <th>Алба</th>
            <th>Эх үүсвэр</th>
            <th>Огноо</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((x, index) => (
            <tr key={`report-row-${index}`}>
              <td>{x.module || "-"}</td>
              <td>{x.title || "-"}</td>
              <td>{x.type || "-"}</td>
              <td>{x.category || "-"}</td>
              <td>{x.riskLevel || "-"}</td>
              <td>{x.status || "-"}</td>
              <td>{x.owner || "-"}</td>
              <td>{x.department || "-"}</td>
              <td>{x.source || "-"}</td>
              <td>{x.date || "-"}</td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center">
                Сонгосон нөхцөлөөр мэдээлэл олдсонгүй.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}