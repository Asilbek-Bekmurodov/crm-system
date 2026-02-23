import { useGetUserQuery } from "../../../app/services/userApi";
import Table from "../../../ui/Table/Table";
import styles from "./All.module.css";
import { AllTableHeaders } from "../../../../data/superAdmin";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";

function All() {
  const { data: users, isLoading, isError } = useGetUserQuery();

  if (isLoading) return <FirstLoader />;
  if (isError) return <ShowError>Something went wrong !</ShowError>;
  return (
    <div className={styles.wrapper}>
      <h1>All Users</h1>

      <Table headers={AllTableHeaders} data={users} />
    </div>
  );
}

export default All;
