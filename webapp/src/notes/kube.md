*Cluster metrics*

* kube_node_status_condition ( Availability ):  Current health status of the node. Returns a set of node conditions (listed below) and true, false, or unknown for each 
* kube_deployment_spec_replicas or kube_daemonset_status_desired_number_scheduled ( Other):  Number of pods specified for a Deployment or DaemonSet 
* kube_deployment_status_replicas or kube_daemonset_status_current_number_scheduled ( Other ):  Number of pods currently running in a Deployment or DaemonSet 
* kube_deployment_status_replicas_available or kube_daemonset_status_number_available ( Availability ):  Number of pods currently available for a Deployment or DaemonSet 
* kube_deployment_status_replicas_unavailable or kube_daemonset_status_number_unavailable ( Availability ) :  Number of pods currently not available for a Deployment or DaemonSet 


*Metric to alert on*: 

* Node status:

    * OutOfDisk

    * Ready (node is ready to accept pods)

    * MemoryPressure (node memory is too low)

    * PIDPressure (too many running processes)

    * DiskPressure (remaining disk capacity is too low)

    * NetworkUnavailable

* Desired vs. current pods:
    * kube_deployment_spec_replicas
    * kube_deployment_status_replicas


*Metrics to watch:* 

* Available and unavailable pods



*Resource metrics from Kubernetes nodes and pods*

* kube_pod_container_resource_requests_memory_bytes ( Utilization ):  Total memory requests (bytes) of a pod 
* kube_pod_container_resource_limits_memory_bytes ( Utilization ):  Total memory limits (bytes) of a pod 
* kube_node_status_allocatable_memory_bytes ( Utilization ):  Total allocatable memory (bytes) of the node 
* memory usage (no kube-state-metric name) ( Utilization ): Total memory in use on a node or pod 
* kube_pod_container_resource_requests_cpu_cores ( Utilization ):  Total CPU requests (cores) of a pod 
* kube_pod_container_resource_limits_cpu_cores ( Utilization ):  Total CPU limits (cores) of a pod 
* kube_node_status_allocatable_cpu_cores ( Utilization ):  Total allocatable CPU (cores) of the node 
* CPU utilization  (no kube-state-metric name) ( Utilization ):  Total CPU in use on a node or pod 
* Disk utiization (no kube-state-metric name) ( Utilization ):  Total disk space used on a node 


*Metric to alert on*: 

* Memory limits per pod vs. memory utilization per pod
* Memory utilization
* Disk utilization

*Metrics to watch:* 

* Memory requests per node vs. allocatable memory per node
* CPU requests per node vs. allocatable CPU per node
* CPU limits per pod vs. CPU utilization per pod
* CPU utilization

*Work metrics from the Kubernetes Control Plane*



* etcd_server_has_leader ( Availability ):  Indicates whether the member of the cluster has a leader (1 if a leader exists, 0 if not) 
* etcd_server_leader_changes_seen_total ( Other ):  Counter of leader changes seen by the cluster member 
* apiserver_request_latencies_count ( Throughput ):  Count of requests to the API server for a specific resource and verb 
* apiserver_request_latencies_sum ( Performance ):  Sum of request duration to the API server for a specific resource and verb, in microseconds 
* workqueue_queue_duration_seconds ( Performance ):  Total number of seconds that items spent waiting in a specific work queue 
* workqueue_work_duration_seconds ( Performance ):  Total number of seconds spent processing items in a specific work queue 
* scheduler_schedule_attempts_total ( Throughput ):  Count of attempts to schedule a pod, broken out by result 
* scheduler_e2e_scheduling_latency_microseconds  (pre-v1.14) or  scheduler_e2e_scheduling_duration_seconds ( Performance ):  Total elapsed latency in scheduling workload pods on worker nodes 

*Metric to alert on*: 

* etcd_server_has_leader

*Metrics to watch:* 

* etcd_server_leader_changes_seen_total
* apiserver_request_latencies_count and apiserver_request_latencies_sum
* workqueue_queue_duration_seconds and workqueue_work_duration_seconds
* scheduler_schedule_attempts_total 





monitoring kubernetes

*Tags and labels become essential*

* labels are now the only way we have to interact with pods and containers.
* all metrics and events will be sliced and diced using labels across the different layers of your infrastructure.
* Defining your labels with a logical and easy-to-understand schema is essential so your metrics will be as useful as possible.

*Applications are constantly moving*

* using a monitoring system or tool with service discovery is a must.

