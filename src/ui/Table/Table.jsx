import styles from "./Table.module.css";

function Table({ headers, data }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>{headers && headers.map((th) => <th>{th}</th>)}</tr>
        </thead>
        <tbody>
          {data &&
            data.map(
              (
                { id, firstname, lastname, age, gender, username, role },
                index,
              ) => (
                <tr key={id}>
                  <td className={styles.index}>{index + 1}</td>
                  <td>{firstname}</td>
                  <td>{lastname}</td>
                  <td>{age}</td>
                  <td>{gender}</td>
                  <td>{username}</td>
                  {/* <td>{password}</td> */}
                  <td>{role}</td>
                </tr>
              ),
            )}
        </tbody>
      </table>
    </div>
  );
}
export default Table;
