import { AllTableHeaders } from "../../../../data/superAdmin";
import { useGetByRoleQuery } from "../../../app/services/userApi";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import ShowError from "../../../ui/ShowError/ShowError";
import Table from "../../../ui/Table/Table";

function Admins() {
  const { data: admins, isLoading, isError } = useGetByRoleQuery("ADMIN");
  if (isLoading) return <FirstLoader />;
  if (isError) return <ShowError>Something went wrong !</ShowError>;

  return (
    <div>
      <h1>ADMINS</h1>

      <Table headers={AllTableHeaders} data={admins} />
    </div>
  );
}
export default Admins;
