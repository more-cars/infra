export function getHostname(cluster: string, environment: string) {
    const domain = cluster === 'gke' ? 'fast-cars.info' : 'more-cars.internal'

    return `*.${environment}.${domain}`
}
