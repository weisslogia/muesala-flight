import styles from '../../styles/create_flight.module.scss'
import { FlightForm } from "../../components/flight/FlightForm"

export const CreateFlight = () => {
    return (
        <div className={styles.container}>
            <FlightForm />
        </div>
    )
}