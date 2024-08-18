import React, { useState, useEffect, useMemo } from "react";
import PersonelTable from "../../components/PersonelTable";
import PersonelAccountPage from "./PersonelAccountPage";
import PersonelService from "./PersonelService";

const PersonelOpsPage = () => {
  const [chosenPersonel, setChosenPersonel] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await PersonelService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const head = [
    { name: "Adı", key: "firstName", sortable: true },
    { name: "Soyadı", key: "lastName", sortable: true },
    { name: "TCKN", key: "tckn", sortable: true },
    { name: "Kullanıcı adı", key: "userName", sortable: true },
    { name: "Personel No", key: "personelNumber", sortable: true },
  ];

  const sortedBody = useMemo(() => {
    let sortableItems = [...users];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems.map((user) => [
      user.firstName,
      user.lastName,
      user.tckn,
      user.userName,
      user.personelNumber,
    ]);
  }, [users, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (row) => {
    const firstName = typeof row[0] === "string" ? row[0] : "";
    const lastName = typeof row[1] === "string" ? row[1] : "";

    setChosenPersonel({
      firstName: firstName,
      lastName: lastName,
      tckn: row[2],
      userName: row[3],
    });
  };

  return (
      <>
        {chosenPersonel === null ? (
            <PersonelTable
                searchable={true}
                head={head}
                body={sortedBody}
                handleRowClick={handleRowClick}
                handleSort={(index) => handleSort(head[index].key)}
                sortConfig={sortConfig}
            />
        ) : (
            <PersonelAccountPage personelData={chosenPersonel} />
        )}
      </>
  );
};

export default PersonelOpsPage;
