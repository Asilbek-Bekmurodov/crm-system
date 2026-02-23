import { AllTableHeaders } from "../../../../data/superAdmin";
import { useGetByRoleQuery } from "../../../app/services/userApi";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import ShowError from "../../../ui/ShowError/ShowError";
import Table from "../../../ui/Table/Table";

function Students() {
  const { data: students, isLoading, isError } = useGetByRoleQuery("STUDENT");

  if (isLoading) return <FirstLoader />;
  if (isError) return <ShowError>Something went wrong !</ShowError>;
  return (
    <div>
      <h1>STUDENTS</h1>

      <Table headers={AllTableHeaders} data={students} />
    </div>
  );
}
export default Students;
