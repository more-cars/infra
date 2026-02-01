export function getGatewayClassName(cluster: string) {
    if (cluster === 'gke') {
        return "gke-l7-global-external-managed"
    } else {
        return "nginx"
    }
}
