import { ref, remove, set } from "firebase/database";
import { db } from "./connection";

export const deleteSchedule = async (date: string, hour: string) => {
  const formattedDate = date.split('-').reverse().join('-')

  const scheduleRef = ref(db, `horarios/${formattedDate}/${hour}`);
  await remove(scheduleRef);
};

export const createSchedule = async (date: string, hour: string, values: any) => {
  try {
    const formattedDate = date.split('-').reverse().join('-')

    const scheduleRef = ref(db, `horarios/${formattedDate}/${hour}`);
    await set(scheduleRef, {
      confirmado: true,
      data: formattedDate,
      horario: values.time,
      nome: values.name,
      telefone: values.phone,
      servico: values.service,
    });
  } catch (err) {
    console.log(err);
    throw new Error();
  }
}