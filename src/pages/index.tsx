import {
  Box,
  Text,
  Input,
  IconButton,
  Button,
  useDisclosure
} from "@chakra-ui/react"
import { Inter } from 'next/font/google'
import { useState, useEffect } from "react"
import { db } from "../firebase/connection"
import { ref, onValue } from "firebase/database";
import { DeleteIcon } from '@chakra-ui/icons'
import { deleteSchedule } from "@/firebase/functions";
import ScheduleForm from "@/components/ScheduleForm";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [schedules, setSchedules] = useState<any>()
  const [confirmDeletion, setConfirmDeletion] = useState('')

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const formattedDate = date.split('-').reverse().join('-')

    const starCountRef = ref(db, 'horarios/' + formattedDate);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setSchedules(data)
      console.log(data)
    });
  }, [date])


  return (
    <>
      <Box
        w="100%"
        h="100vh"
        p={4}
        display="flex"
        alignItems="center"
        flexDirection={'column'}
        className={inter.className}
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
        >
          Sistema de Agendamento
        </Text>
        <Box
          m={4}
          p={10}
          borderRadius={10}
          boxShadow={'0px 0px 10px 2px rgba(0, 0, 0, 0.2)'}
          w={'100%'}
        >
          <Box
            display={'flex'}

          >
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Button
              colorScheme="blue"
              ml={3}
              width={'30%'}
              onClick={onOpen}
            >
              Adicionar
            </Button>
          </Box>
          <Box>
            {schedules && Object.keys(schedules).map((key) => (
              <Box
                key={key}
                p={2}
                mt={5}
                borderRadius={10}
                boxShadow={'0px 0px 10px 2px rgba(0, 0, 0, 0.2)'}
                w={'100%'}
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                flexDirection={['column', 'row']}
              >
                <Box>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                  >
                    {key}
                  </Text>
                  <Box>
                    <Text
                      fontSize="md"
                    >
                      <b>Nome:</b> {schedules[key].nome}
                      <br />
                      <b>Serviço:</b> {schedules[key].servico}
                      <br />
                      <b>Telefone:</b> {schedules[key].telefone}
                    </Text>
                  </Box>
                </Box>
                <Box>
                  {confirmDeletion === key ?
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                    >
                      <Button
                        colorScheme="red"
                        size={'sm'}
                        onClick={() => deleteSchedule(date, key)}
                      >
                        <DeleteIcon color='white' mr={1} />
                        Confirmar
                      </Button>
                      <Button size='sm' onClick={() => setConfirmDeletion('')}>
                        Cancelar
                      </Button>
                    </Box>
                    :
                    <IconButton
                      icon={<DeleteIcon color='red' />}
                      aria-label="delete"
                      size="lg"
                      onClick={() => setConfirmDeletion(key)}
                    />
                  }
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <ScheduleForm
        isOpen={isOpen}
        onClose={onClose}
        date={date}
      />
    </>
  )
}
