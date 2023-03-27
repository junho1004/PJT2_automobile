import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase-config'

function test () {
    const unsub = onSnapshot(doc(db, "Ego", "Ego_status"), (doc) => {
        console.log("Current data: ", doc.data().current_position_x);
    });
    console.log(unsub)
    return (
        <div>aaa</div>
    )
}

export default test;