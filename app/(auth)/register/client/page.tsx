"use client"

import { custumerRegisterStep02, custumerRegisterStep03, CustumerRegistrationStep01Error, CustumerRegistrationStep02Error, CustumerRegistrationStep03Error, validateEmail } from "@/app/actions/register_client";
import { Button } from "@/app/components/button";
import { Input } from "@/app/components/input";
import { Select } from "@/app/components/select";
import { ECustomerRegistrationSteps, TCustomerRegister } from "@/app/interfaces/client";
import { STATES } from "@/app/mocks/states";
import { handleBuildComplete } from "next/dist/build/adapter/build-complete";
import Link from "next/dist/client/link";
import { ChangeEvent, Dispatch, SetStateAction, SubmitEvent, use, useActionState, useEffect, useState } from "react"
import toast from "react-hot-toast";

interface IProps {
    setClient: Dispatch<SetStateAction<Partial<TCustomerRegister>>>
    setStep: Dispatch<SetStateAction<ECustomerRegistrationSteps>>

}

const initialStateStep01: FormState<CustumerRegistrationStep01Error> = { success: false }


function Step01({ setStep, setClient }: IProps) {
    const [state, formAction, isPeding] = useActionState(validateEmail, initialStateStep01)
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        if (!state.success && email !== "") {
            let message: string = "Ocorreu um erro desconhecido"

            if (state.errors && state.errors.email) {
                message = state.errors.email[0]
            } else if (state.message) {
                message = state.message
            }

            toast.error(message)
        } else {
            setClient(prev => ({
                ...prev,
                email: email
            }))
            setStep(ECustomerRegistrationSteps.STEP02)
        }

    }, [state])


    return (
        <form action={formAction} className="flex flex-col gap-2 mt-2">
            <Input
                id="email"
                name="email"
                aria-label="E-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                placeholder="Ex: joão.nascimento@seudominio.com"
            />
            <Button type="submit" disabled={isPeding}>{isPeding ? "Carregando" : "Avançar"} </Button>
        </form>
    )
}

const initialStateStep02: FormState<CustumerRegistrationStep02Error> = { success: false }

function Step02({ setStep, setClient }: IProps) {
    const [state, formAction, isPeding] = useActionState(custumerRegisterStep02, initialStateStep02)
    const [name, setName] = useState<string>("")
    const [document, setDocument] = useState<string>("")
    const [dateOfBirth, setDateOfBirth] = useState<string>("")
    const [phone, setPhone] = useState<string>("")

    useEffect(() => {
        if (!state.success && (name !== "" || document !== "" || dateOfBirth !== "" || phone !== "")) {
            let message: string = "Ocorreu um erro desconhecido"

            if (state.errors && state.errors) {
                if (state.errors.name) message = state.errors.name[0]
                if (state.errors.document) message = state.errors.document[0]
                if (state.errors.dateOfBirth) message = state.errors.dateOfBirth[0]
                if (state.errors.phone) message = state.errors.phone[0]
            } else if (state.message) {
                message = state.message
            }

            toast.error(message)
        } else if (state.success) {
            setClient(prev => ({
                ...prev,
                name,
                document,
                dateofbirth: dateOfBirth !== "" ? new Date(dateOfBirth) : undefined,
                phone
            }))
            setStep(ECustomerRegistrationSteps.STEP03)
        }
    }, [state])

    return (
        <form action={formAction} className="flex flex-col gap-2 mt-2">
            <Input id="name" name="name" value={name} onChange={e => setName(e.currentTarget.value)} required label="Nome Completo" maxLength={150} />
            <Input id="document" name="document" value={document} onChange={e => setDocument(e.currentTarget.value)} required label="CPF" max={11} />
            <Input id="dateOfBirth" name="dateOfBirth" value={dateOfBirth} onChange={e => setDateOfBirth(e.currentTarget.value)} type="Data" label="Data de Nascimento" />
            <Input id="phone" name="phone" value={phone} onChange={e => setPhone(e.currentTarget.value)} type="tel" required label="Telefone" />
            <div className="flex flex-row items-center gap-2">
                <Button type="button" onClick={() => setStep(ECustomerRegistrationSteps.STEP01)}>Voltar</Button>
                <Button type="submit" disabled={isPeding}>{isPeding ? "Carregando" : "avançar"}</Button>
            </div>
        </form>
    )
}

const initialStateStep03: FormState<CustumerRegistrationStep03Error> = { success: false }


function Step03({ setStep, setClient }: IProps) {
    const [formState, formAction, isPeding] = useActionState(custumerRegisterStep03, initialStateStep03)

    const [loading, setLoanding] = useState<boolean>(false)
    const [zipcode, setZipcode] = useState<string>("")
    const [publicPlace, setPublicPlace] = useState<string>("")
    const [number, setNumber] = useState<string>("")
    const [neighborhood, setNeighborhood] = useState<string>("")
    const [complement, setComplement] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [state, setState] = useState<string>("")

    const searchZipCode = async (value: string) => {
        setLoanding(true)
        const response = await fetch(`https: //viacep.com.br/ws/${value}/json`)
            .then(data => data.json())
            .then(data => {
                if (data["erro"]) throw new Error()
                return {
                    publicPlace: data["logradouro"] || "",
                    Complement: data["complement"] || "",
                    neighborhood: data["bairro"] || "",
                    city: data["localidade"] || "",
                    state: data["uf"] || ""
                }
            })
            .catch(err => {
                console.log(err)
                toast.error("Não foi possivel obter as informações do CEP")
                return null
            })
            .finally(() => setLoanding(false))

        if (!response) return;

        setPublicPlace(response.publicPlace)
        setComplement(response.Complement)
        setNeighborhood(response.neighborhood)
        setCity(response.city)
        setState(response.state)
    }

    const handleZipCode = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setZipcode(value)

        if (value.length === 8) searchZipCode(value)
    }

    useEffect(() => {
        if (!formState.success && (
            zipcode !== "" ||
            publicPlace !== "" ||
            number !== "" ||
            neighborhood !== "" ||
            city !== "" ||
            state !== ""
        )) {
            let message: string = "Ocorreu um erro desconhecido"

            if (formState.errors && formState.errors) {
                if (formState.errors.zipcode) message = formState.errors.zipcode[0]
                if (formState.errors.publicPlace) message = formState.errors.publicPlace[0]
                if (formState.errors.number) message = formState.errors.number[0]
                if (formState.errors.neighborhood) message = formState.errors.neighborhood[0]
                if (formState.errors.complement) message = formState.errors.complement[0]
                if (formState.errors.city) message = formState.errors.city[0]
                if (formState.errors.state) message = formState.errors.state[0]

            } else if (formState.message) {
                message = formState.message
            }

        } else if (formState.success) {
            setClient(prev => ({
                ...prev,
                address: [{
                    zipcode,
                    publicPlace,
                    number,
                    neighborhood,
                    complement,
                    city,
                    state
                }]
            }))
            setStep(ECustomerRegistrationSteps.STEP04)
        }
    }, [formState])

    return (
        <form action={formAction} className="mt-2 grid grid-cols-4 gap-2 max-w-md">
            <Input id="zipcode" name="zipcode" value={zipcode} onChange={handleZipCode} disabled={loading} required label="CEP" />
            <div className="col-span-1">
                <Input id="publicplace" name="publicplace" value={publicPlace} onChange={(e) => setPublicPlace(e.currentTarget.value)} disabled={loading} required label="Endereço" />
            </div>
            <Input id="number" name="number" value={number} onChange={(e) => setNumber(e.currentTarget.value)} required label="Número" />

            <div className="col-span-2">
                <Input id="complement" name="complement" value={complement} onChange={(e) => setComplement(e.currentTarget.value)} disabled={loading} label="Complemento" />
            </div>

            <div className="col-span-2" >
                <Input id="neighborhhod" name="neighborhhod" value={neighborhood} onChange={(e) => setNeighborhood(e.currentTarget.value)} disabled={loading} required label="Bairro" />
            </div>

            <div className="col-span-3">
                <Input id="city" name="city" value={city} onChange={(e) => setCity(e.currentTarget.value)} disabled={loading} required label="Cidade" />
            </div>

            <Select id="state" name="state" value={state} onChange={(e) => setState(e.currentTarget.value)} label="Estato">
                {
                    STATES
                        .sort((a, b) => a.acronym.localeCompare(b.acronymS))
                        .map(stt => (
                            <option key={`stt-${stt.acronym}`} value={stt.acronym}>{stt.acronym}</option>
                        ))
                }
            </Select>

            <div className="col-span-4 flex flex-row items-center gap-2">
                <Button disabled={loading} type="button" onClick={() => setStep(ECustomerRegistrationSteps.STEP02)} >Voltar</Button>
                <Button disabled={loading} type="submit">
                    {isPeding ? "Carregando" : "Avançar"}
                </Button>
            </div>
        </form>
    )
}


export default function Page() {
    const [step, setStep] = useState<ECustomerRegistrationSteps>(ECustomerRegistrationSteps.STEP01)
    const [client, setClient] = useState<TCustomerRegister>({})

    const render = () => {
        switch (step) {
            case ECustomerRegistrationSteps.STEP01:
                return <Step01 setClient={setClient} setStep={setStep} />
            case ECustomerRegistrationSteps.STEP02:
                return <Step02 setClient={setClient} setStep={setStep} />
            case ECustomerRegistrationSteps.STEP03:
                return <Step03 setClient={setClient} setStep={setStep} />
            case ECustomerRegistrationSteps.STEP04:
            case ECustomerRegistrationSteps.OVERVIEW:

        }

    }

    return (
        <>
            <div>
                <ul className="flex flex-row items-center gap-1.5">
                    {
                        Array.from({ length: 5 })
                            .map((_, i) => (
                                <li key={`step-${i}`} className={`h-2 w-2 ${i <= step ? "bg-[#1c4694]" : "bg-gray-200"} rounded-full`} />
                            ))
                    }
                </ul>
            </div>
            {render()}
            <p className="mt-4 text-sm font-light">Já possui uma conta? <Link href={"/register"} className="text-[#1C4694] font-semibold"></Link>Entrar</p>
        </>
    )
}

