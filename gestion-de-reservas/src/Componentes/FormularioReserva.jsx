import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const ErrorText = styled.p`
  color: red;
`;

const FormularioReserva = ({ onReservaCreada }) => {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("");
  const [servicios, setServicios] = useState([]);
  const [minHora, setMinHora] = useState("00:00");
  const today = new Date().toISOString().split("T")[0];

  const handleFechaChange = (event) => {
    const selectedDate = event.target.value;
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, "0");
    const currentMinute = now.getMinutes().toString().padStart(2, "0");

    if (selectedDate === today) {
      setMinHora(`${currentHour}:${currentMinute}`);
    } else {
      setMinHora("00:00");
    }
  };

  // Obtengo los servicios desde la api
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7211/api/servicios"
        );
        setServicios(response.data);
      } catch (err) {
        console.error("Error al obtener los servicios:", err);
      }
    };

    fetchServicios();
  }, []);

  const onSubmit = async (data) => {
    if (!data.cliente || !data.servicio || !data.fecha || !data.hora) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7211/api/reservas",
        data
      );
      onReservaCreada(response.data);
      reset();
      setError("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al registrar la reserva. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <Container>
      <Title>Realizar una Reserva</Title>
      {error && <ErrorText>{error}</ErrorText>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Nombre del Cliente"
          {...register("cliente", {
            required: "El nombre es obligatorio",
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          })}
          onInput={(e) =>
            (e.target.value = e.target.value.replace(
              /[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,
              ""
            ))
          }
        />

        <Select {...register("servicio")}>
          <option value="">Seleccione un servicio</option>
          {servicios.map((servicio, index) => (
            <option key={index} value={servicio}>
              {servicio}
            </option>
          ))}
        </Select>

        <Input
          type="date"
          {...register("fecha")}
          min={today}
          onChange={handleFechaChange}
        />
        <Input type="time" {...register("hora")} min={minHora} />
        <Button type="submit">Reservar</Button>
      </Form>
    </Container>
  );
};

export default FormularioReserva;
