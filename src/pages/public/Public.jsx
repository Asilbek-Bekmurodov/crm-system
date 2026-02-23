import { NavLink } from "react-router-dom";

function Public() {
  return (
    <div>
      Public
      <NavLink to={"/auth"}>Auth</NavLink>
    </div>
  );
}
export default Public;
