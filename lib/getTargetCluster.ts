import {select} from "@inquirer/prompts"

export async function getTargetCluster(override: string | undefined) {
    if (override && override !== "") {
        return override
    }

    return promptUser()
}

async function promptUser() {
    return select({
        message: 'In which cluster should the infrastructure be deployed?',
        default: 'minikube',
        choices: [
            {
                value: 'minikube',
            },
            {
                value: 'gke',
            },
        ],
    })
}
