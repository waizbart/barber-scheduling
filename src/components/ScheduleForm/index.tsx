import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Select,
    useToast
} from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { createSchedule } from "@/firebase/functions";

function phoneMask(value: string) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
        .replace(/(-\d{4})\d+?$/, '$1');
}

export default function ScheduleForm({
    isOpen,
    onClose,
    date
}: any) {
    const [formValues, setFormValues] = useState({
        name: '',
        phone: '',
        date: date,
        time: '',
        service: ''
    })

    const toast = useToast()

    useEffect(() => {
        setFormValues({
            name: '',
            phone: '',
            date: date,
            time: '',
            service: ''
        })
    }, [date])


    const submitForm = (e: any) => {
        e.preventDefault();

        createSchedule(formValues.date, formValues.time, formValues).then(() => {
            toast({
                title: 'Agendamento criado com sucesso',
                status: 'success',
                duration: 3000,
                isClosable: true
            })
            onClose()
        }
        ).catch((err) => {
            toast({
                title: 'Erro ao criar agendamento',
                description: err.message,
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        }
        )
    }

    const handleChange = (key: string, value: any) => {
        setFormValues({
            ...formValues,
            [key]: value
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={submitForm}>
                    <ModalHeader>Agendamento</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            placeholder='Nome do cliente'
                            mb={3}
                            required
                            value={formValues.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <Input
                            placeholder='Telefone do cliente'
                            mb={3}
                            required
                            value={formValues.phone}
                            onChange={(e) => handleChange('phone', phoneMask(e.target.value))}
                        />
                        <Input
                            type="date"
                            placeholder='Data'
                            mb={3}
                            required
                            value={formValues.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                        />
                        <Input
                            type="time"
                            placeholder='Horário'
                            mb={3}
                            required
                            value={formValues.time}
                            onChange={(e) => handleChange('time', e.target.value)}
                        />
                        <Select
                            placeholder='Tipo de serviço'
                            required value={formValues.service}
                            onChange={(e) => handleChange('service', e.target.value)}
                        >
                            <option value="Cabelo">Cabelo</option>
                            <option value="Barba">Barba</option>
                            <option value="Cabelo e barba">Cabelo e barba</option>
                        </Select>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' type="submit">
                            Criar agendamento
                        </Button>
                        <Button variant='ghost' onClick={onClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}