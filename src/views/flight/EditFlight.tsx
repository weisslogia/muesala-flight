import styles from "../../styles/create_flight.module.scss";
import { FlightForm } from "../../components/flight/FlightForm";
import { useNavigate, useParams } from "react-router-dom";
import { getFlight } from "../../services/flight";
import { handleRequestErrors } from "../../helpers/request.helper";
import { ResponseError } from "../../types/Error";
import { useEffect, useState } from "react";
import { Flight } from "../../types/Flight";
import { showMsg } from "../../helpers/toast.helper";

export const EditFlight = () => {
  const { id } = useParams();
  const router = useNavigate();
  const [refresh, setRefresh] = useState<number>(0);
  const [flight, setFlight] = useState<Flight | null>(null);

  const loadFlights = async () => {
    const response = await getFlight(String(id));
    if ("errors" in response) {
      const error_data = response as ResponseError;
      const result = await handleRequestErrors(error_data, router);
      if (result && result.refresh && refresh < 10) {
        setRefresh(refresh + 1);
      } else {
        showMsg(error_data.message, { type: "error", theme: "colored" });
      }
    } else {
      const flight = response as Flight;
      setFlight(flight);
    }
  };

  useEffect(() => {
    loadFlights();
  }, [refresh]);

  return (
    <div className={styles.container}>
      <FlightForm id={id} data={flight}/>
    </div>
  );
};
