import fs from "node:fs"
import {getHostname} from "./getHostname"
import {getGatewayClassName} from "./getGatewayClassName"

createGatewayPatchFile()
    .then((data) => {
        const path = __dirname + '/../k8s/more-cars/'
        const filename = 'gateway.patch.json'
        fs.writeFileSync(path + filename, JSON.stringify(data, null, 2))
    })

createAnalyticsPatchFile()
    .then(data => {
        if (process.env.TARGET_ENVIRONMENT !== 'prod') {
            return
        }

        const path = __dirname + '/../k8s/overlays/prod/'
        const filename = 'analytics.patch.json'
        fs.writeFileSync(path + filename, JSON.stringify(data, null, 2))
    })

createPocketIdDeploymentPatchFile()
    .then(data => {
        const path = __dirname + '/../k8s/more-cars/'
        const filename = 'pocket-id-deployment.patch.json'
        fs.writeFileSync(path + filename, JSON.stringify(data, null, 2))
    })

createPocketIdHttpsRoutePatchFile()
    .then(data => {
        const path = __dirname + '/../k8s/more-cars/'
        const filename = 'pocket-id-route.patch.json'
        fs.writeFileSync(path + filename, JSON.stringify(data, null, 2))
    })

createOauth2ProxyDeploymentPatchFile()
    .then(data => {
        const path = __dirname + '/../k8s/more-cars/'
        const filename = 'oauth2-proxy-deployment.patch.json'
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

async function createAnalyticsPatchFile() {
    const targetEnvironment = process.env.TARGET_ENVIRONMENT || 'prod'
    const targetCluster = process.env.TARGET_CLUSTER || 'gke'

    return [
        {
            "op": "replace",
            "path": "/spec/hostnames/0",
            "value": getHostname(targetCluster, targetEnvironment).replace('*', 'analytics'),
        },
    ]
}

async function createPocketIdDeploymentPatchFile() {
    const targetEnvironment = process.env.TARGET_ENVIRONMENT || 'prod'
    const targetCluster = process.env.TARGET_CLUSTER || 'gke'

    return [
        {
            "op": "replace",
            "path": "/spec/template/spec/containers/0/env/0",
            "value": {
                "name": "APP_URL",
                "value": "https://" + getHostname(targetCluster, targetEnvironment).replace('*', 'pocket-id'),
            },
        },
    ]
}

async function createPocketIdHttpsRoutePatchFile() {
    const targetEnvironment = process.env.TARGET_ENVIRONMENT || 'prod'
    const targetCluster = process.env.TARGET_CLUSTER || 'gke'

    return [
        {
            "op": "replace",
            "path": "/spec/hostnames/0",
            "value": getHostname(targetCluster, targetEnvironment).replace('*', 'pocket-id'),
        },
    ]
}

async function createOauth2ProxyDeploymentPatchFile() {
    const targetEnvironment = process.env.TARGET_ENVIRONMENT || 'prod'
    const targetCluster = process.env.TARGET_CLUSTER || 'gke'

    return [
        {
            "op": "replace",
            "path": "/spec/template/spec/containers/0/env/0",
            "value": {
                "name": "ISSUER_URL",
                "value": "https://" + getHostname(targetCluster, targetEnvironment).replace('*', 'pocket-id'),
            },
        },
        {
            "op": "replace",
            "path": "/spec/template/spec/containers/0/env/1",
            "value": {
                "name": "REDIRECT_URL",
                "value": "https://multimedia-manager.testing.more-cars.net/oauth2/callback",
            },
        },
        {
            "op": "replace",
            "path": "/spec/template/spec/containers/0/env/2",
            "value": {
                "name": "UPSTREAM_URL",
                "value": "http://multimedia-manager.testing.svc.cluster.local:80",
            },
        },
    ]
}
