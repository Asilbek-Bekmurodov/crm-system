import { useParams } from "react-router-dom";
import { useGetOrganizationByIdQuery } from "../../../app/services/organizationApi";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import { useGetPermissionsQuery } from "../../../app/services/permissionsApi";
import React, { useState } from "react";

function OrganizationDetail() {
  const { id } = useParams("id");
  console.log(id);
  const { data: org, isLoading: isOrgLoading } =
    useGetOrganizationByIdQuery(id);
  const { data: permissions, isLoading: isPerLoading } =
    useGetPermissionsQuery();

  const [setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    role: "",
    organizationId: id,
    permissions: [],
  });

  function handleChange(e) {
    setFormData((state) => [...state, e.target.value]);
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  if (isOrgLoading || isPerLoading) return <FirstLoader />;
  return (
    <div>
      <h1>{org.name}</h1>

      <form onSubmit={handleSubmit} action="">
        <input type="text" placeholder="" />

        <h2>Huquqlar</h2>

        {permissions.map((el) => (
          <React.Fragment key={el}>
            <label htmlFor={el}>{el}</label>
            <input
              onChange={handleChange}
              type="checkbox"
              name="permissions"
              value={el}
              id={el}
            />
            <br />
          </React.Fragment>
        ))}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
export default OrganizationDetail;
