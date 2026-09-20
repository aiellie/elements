"use client"
import { ModelOption, ModelSelector } from "@/registry/aiellie/components/model-selector"
const models: ModelOption[] = [
    {
        id: "gpt-4o",
        name: "GPT-4o",
        vendor: "openai",
    },
    {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        vendor: "openai",
    },
]
const model = models[0]
const onValueChange = (value: string) => {
    console.log(value)
}
export function Chat() {
    return (
        <div>
            <ModelSelector models={models} value={model.id} onValueChange={onValueChange} />
        </div>
    )
}