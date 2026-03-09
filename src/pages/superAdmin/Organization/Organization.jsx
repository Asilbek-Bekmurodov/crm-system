import { useState, useMemo } from "react";
import {
  useDeleteOrganizationMutation,
  useGetOrganizationsQuery,
} from "../../../app/services/organizationApi";
import Table from "../../../ui/Table/Table";
import styles from "./Organization.module.css";
import { OrganizationTableHeaders } from "../../../../data/superAdmin";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import Modal from "../../../ui/Modal/Modal";
import CreateOrganizationForm from "../CreateOrganizationForm/CreateOrganizationForm";
import ShowError from "../../../ui/ShowError/ShowError";
import { useNavigate } from "react-router-dom";

function Organization() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const {
    data: organizations = [],
    isLoading,
    isError,
  } = useGetOrganizationsQuery();

  const [deleteOrganization, { isLoading: isDeleting }] =
    useDeleteOrganizationMutation();

  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      return org.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [organizations, searchTerm]);

  if (isLoading || isDeleting) return <FirstLoader />;
  if (isError)
    return <ShowError>Ma'lumotlarni yuklashda xatolik yuz berdi!</ShowError>;

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham ushbu tashkilotni o'chirmoqchimisiz?")) {
      try {
        await deleteOrganization(id).unwrap();
      } catch (e) {
        console.error("O'chirishda xatolik:", e);
      }
    }
  }

  function handleEdit(id) {
    const org = organizations.find((o) => o.id === id);
    if (org) {
      setEditingOrg(org);
      setIsOpen(true);
    }
  }

  function handleClick(item) {
    navigate(`/super-admin/organizations/${item.id}`);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>All Organizations</h1>
        <button className={styles.createBtn} onClick={() => setIsOpen(true)}>
          + Create Organization
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by name..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {filteredOrgs.length > 0 ? (
          <Table
            headers={OrganizationTableHeaders}
            data={filteredOrgs}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onNavigate={handleClick}
            renderRow={(org) => (
              <>
                <td>{org.name}</td>
                <td>{org.description}</td>
                <td>
                  {org.logoUrl && (
                    <img src={org.logoUrl} width={50} height={50} />
                  )}
                </td>

                <td>{org.active ? "Active" : "Inactive"}</td>
              </>
            )}
          />
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Hech qanday tashkilot topilmadi.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        setIsOpen={(value) => {
          setIsOpen(value);
          if (!value) setEditingOrg(null);
        }}
        title={editingOrg ? "Edit Organization" : "Create Organization"}
      >
        <CreateOrganizationForm setIsOpen={setIsOpen} editingOrg={editingOrg} />
      </Modal>
    </div>
  );
}

export default Organization;
