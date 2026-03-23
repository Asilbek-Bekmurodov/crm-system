import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import styles from "./Table.module.css";

function Table({
  headers,
  data,
  onDelete,
  onEdit,
  onNavigate,
  renderRow,
  username,
}) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>{headers && headers.map((th) => <th key={th}>{th}</th>)}</tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id || index}>
                <td className={styles.index}>{index + 1}</td>

                {renderRow(item)}

                <td
                  className={styles.actionCell}
                  onClick={() => onEdit(item.id)}
                >
                  <FaEdit className={styles.editIcon} />
                </td>
                {username !== "superadmin" && (
                  <td
                    className={styles.actionCell}
                    onClick={() => onDelete(item.id)}
                  >
                    <MdDelete className={styles.deleteIcon} />
                  </td>
                )}

                {onNavigate && (
                  <td
                    className={styles.actionCell}
                    onClick={() => onNavigate(item)}
                  >
                    <button className={styles.openBtn}>Open</button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers?.length + 2 || 10}
                style={{ textAlign: "center", padding: "20px" }}
              >
                Ma'lumot mavjud emas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
