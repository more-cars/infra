import {select} from "@inquirer/prompts"

export async function getTargetEnvironment(override: string | undefined, cluster: string) {
    if (override && override !== "") {
        return override
    }

    return promptUser(cluster)
}

async function promptUser(cluster: string) {
    const choices = [
        {
            value: 'testing',
        },
        {
            value: 'prod',
        },
    ]

    if (cluster === 'minikube') {
        choices.push({
            value: 'dev',
        })
    }

    return select({
        message: 'In which environment should the infrastructure be deployed?',
        default: 'testing',
        choices,
    })
}
