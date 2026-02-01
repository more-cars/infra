# More Cars - Infrastructure

In general, all More Cars apps (Frontend, REST API, Editor, etc.) are independent of each other.
They are designed, so that they can be developed, tested and deployed independently.
Interfaces (e.g. OpenAPI specification) make sure that they stay compatible with each other.
There are also multiple supporting tools, like the Neo4j database which holds the actual car data, 
Matomo for traffic analysis or the SwaggerUI to document the available REST API routes.
They are independent, too.

This high level of autonomy has many advantages, but also introduces some complexity and higher operating cost.
Here comes this repo into play.
It ties the apps and tools together by providing a central gateway.
One benefit is that only one TLS certificate is needed to cover the whole namespace (e.g. testing.more-cars.net)
instead of one for each app/tool.
Also, the apps don't have to deal with that topic anymore.
This approach also reduces the amount of load balancers resp. IP addresses.
Instead of one for every app/tool, only one for the whole namespace is needed (which reduces cost significantly).

The gateway is not mandatory.
Each app or tool can decide if it wants to use it or not. 
