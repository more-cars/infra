import fs from "node:fs"
import {getTargetCluster} from "./getTargetCluster"
import {getTargetEnvironment} from "./getTargetEnvironment"

collectParams()
    .then((data) => {
        const filename = process.argv[2]
        fs.writeFileSync(__dirname + '/../' + filename, data)
    })

async function collectParams() {
    const targetCluster = await getTargetCluster(process.env.TARGET_CLUSTER)
    const targetEnvironment = await getTargetEnvironment(process.env.TARGET_ENVIRONMENT, targetCluster)

    return assembleEnvFileData({
        targetCluster,
        targetEnvironment,
    })
}

function assembleEnvFileData(params: DeploymentConfig) {
    const data = `
export TARGET_CLUSTER=${params.targetCluster}
export TARGET_ENVIRONMENT=${params.targetEnvironment}
`

    return data
}

type DeploymentConfig = {
    targetCluster: string
    targetEnvironment: string
}
