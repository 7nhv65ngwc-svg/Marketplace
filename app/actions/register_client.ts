"use server"

import { success, z } from "zod"
import { LoginSchema } from "../schemas/login.schema"
import { Step01Schema } from "../schemas/register_client.schema"

export type CustumerRegistationStep01Error = {
    email?: string[]

}

export async function validatedFields(prev: FormSate<CustumerRegistationStep01Error> formData: formData): Promise<FormState<CustumerRegistationStep01Error>>> {

    const validatedFields = Step01Schema.safeParce(
        Object.fromEntries(formData.entries())
    )

if(!validatedFields.success) {
    const { properties } = z.treeifyError(validatedFields.error)
    return {
        success: false,
        errors: {
            email: properties?.email.errors,
        }
    }
}

const { email } = validatedFields.data

try {
    return { success: true }
} catch (err) {
    console.error(err)
    return { success: false, message: "Erro interno do Servidor" }
}

}