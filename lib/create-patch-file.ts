import fs from "node:fs"

createGatewayPatchFile()
    .then((data) => {
        const path = __dirname + '/../k8s/more-cars/'
        const filename = 'gateway.patch.json'
        fs.writeFileSync(path + filename, JSON.stringify(data, null, 2))
    })

async function createGatewayPatchFile() {
    return [
        {
            "op": "replace",
            "path": "/spec/gatewayClassName",
            "value": "nginx"
        },
        {
            "op": "replace",
            "path": "/spec/listeners/0/hostname",
            "value": "*.more-cars.internal"
        },
    ]
}
