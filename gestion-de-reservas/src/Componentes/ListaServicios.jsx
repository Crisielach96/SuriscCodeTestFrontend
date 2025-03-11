import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 12px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const ListaServicios = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    axios.get("https://localhost:7211/api/servicios").then((res) => {
      setServicios(res.data);
    });
  }, []);

  return (
    <div />
  );
};

export default ListaServicios;
