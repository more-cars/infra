import fs from "node:fs"
import {getHostname} from "./getHostname"
import {getGatewayClassName} from "./getGatewayClassName"

createGatewayPatchFile()
    .then((data) => {
        const path = __dirname + '/../k8s/more-cars/'
        const filename = 'gateway.patch.json'
        fs.writeFileSync(path + filename, JSON.stringify(data, null, 2))
    })

async function createGatewayPatchFile() {
    const targetEnvironment = process.env.TARGET_ENVIRONMENT || 'prod'
    const targetCluster = process.env.TARGET_CLUSTER || 'gke'

    return [
        {
            "op": "replace",
            "path": "/spec/gatewayClassName",
            "value": getGatewayClassName(targetCluster)
        }, {
            "op": "replace",
            "path": "/spec/listeners/0/hostname",
            "value": getHostname(targetCluster, targetEnvironment),
        }, {
            "op": "replace",
            "path": "/spec/listeners/1/hostname",
            "value": getHostname(targetCluster, targetEnvironment),
        },
    ]
}
