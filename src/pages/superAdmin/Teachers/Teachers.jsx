import { AllTableHeaders } from "../../../../data/superAdmin";
import { useGetByRoleQuery } from "../../../app/services/userApi";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import ShowError from "../../../ui/ShowError/ShowError";
import Table from "../../../ui/Table/Table";

function Teachers() {
  const { data: teachers, isLoading, isError } = useGetByRoleQuery("TEACHER");

  if (isLoading) return <FirstLoader />;
  if (isError) return <ShowError>Something went wrong !</ShowError>;

  return (
    <div>
      <h1>TEACHERS</h1>

      <Table headers={AllTableHeaders} data={teachers} />
    </div>
  );
}
export default Teachers;
