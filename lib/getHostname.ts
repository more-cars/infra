export function getHostname(cluster: string, environment: string) {
    const domain = cluster === 'gke' ? 'more-cars.net' : 'more-cars.internal'

    return `*.${environment}.${domain}`
}
