# More Cars - Infrastructure

In general, all More Cars apps (Frontend, REST API, Editor, etc.) are self-contained.
They are designed, so that they can be developed, tested and deployed independently.
When they need to communicate with each other (like the Frontend with the API)
then interfaces make sure that they
A) stay compatible with each other and
B) can create mocks of the other side.
The supporting tools aim for the same goal.
Matomo (traffic analysis) and the SwaggerUI (REST API documentation) for example can be updated, disabled or replaced
without breaking the apps.

This high level of autonomy has advantages, but also introduces some complexity and higher operating cost.
Here comes the _infra_ tool into play.
Instead of each app running their own traffic analysis tool they can all use the one that is provided by _infra_.
This frees them from dealing with stuff that is not their core competency.
It also reduces the required resources in the cluster (like CPU, memory, load balancers, IP addresses).
HTTPS and TLS certificates are also a time-consuming topic.
The apps don't need to deal with this individually.
They can use the _infra_-managed gateway.
This reduces configuration complexity significantly.
The apps don't need to be able to run in HTTPS mode, a simple HTTP configuration is enough.
_Infra_ deals with TLS termination, HTTP to HTTPS redirects and updating expiring certificates.

## Quickstart

This infra tool only works in a Kubernetes environment (Minikube, GKE).
Local dev environments are not supported.

### Requirements

* A running Kubernetes cluster
* Node.js v24 (or higher)

### Installation

Run the npm start script via `npm start`.
This will start a wizard which asks in which cluster and which namespace the infra tool should be installed.
In Minikube, it will automatically create a dummy TLS certificate.
In GKE a valid one has to be created manually (see next section).

## TLS Certificate

A dummy certificate is automatically added when deploying the infra service.
This is true for all environments and all clusters.
For Minikube there are no more steps necessary
because it is not possible to create valid certificates for local environments anyway.
For GKE the recommended way to replace the dummy certificate is via `headlamp`.
