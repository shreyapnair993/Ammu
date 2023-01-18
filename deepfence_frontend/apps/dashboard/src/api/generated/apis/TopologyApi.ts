/* tslint:disable */
/* eslint-disable */
/**
 * Deepfence ThreatMapper
 * Deepfence Runtime API provides programmatic control over Deepfence microservice securing your container, kubernetes and cloud deployments. The API abstracts away underlying infrastructure details like cloud provider,  container distros, container orchestrator and type of deployment. This is one uniform API to manage and control security alerts, policies and response to alerts for microservices running anywhere i.e. managed pure greenfield container deployments or a mix of containers, VMs and serverless paradigms like AWS Fargate.
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: community@deepfence.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  ApiDocsBadRequestResponse,
  ApiDocsFailureResponse,
  ApiDocsGraphResult,
  ModelRawReport,
  ReportersTopologyFilters,
} from '../models';
import {
    ApiDocsBadRequestResponseFromJSON,
    ApiDocsBadRequestResponseToJSON,
    ApiDocsFailureResponseFromJSON,
    ApiDocsFailureResponseToJSON,
    ApiDocsGraphResultFromJSON,
    ApiDocsGraphResultToJSON,
    ModelRawReportFromJSON,
    ModelRawReportToJSON,
    ReportersTopologyFiltersFromJSON,
    ReportersTopologyFiltersToJSON,
} from '../models';

export interface GetContainersTopologyGraphRequest {
    reportersTopologyFilters?: ReportersTopologyFilters;
}

export interface GetHostsTopologyGraphRequest {
    reportersTopologyFilters?: ReportersTopologyFilters;
}

export interface GetKubernetesTopologyGraphRequest {
    reportersTopologyFilters?: ReportersTopologyFilters;
}

export interface GetPodsTopologyGraphRequest {
    reportersTopologyFilters?: ReportersTopologyFilters;
}

export interface GetTopologyGraphRequest {
    reportersTopologyFilters?: ReportersTopologyFilters;
}

export interface IngestAgentReportRequest {
    modelRawReport?: ModelRawReport;
}

/**
 * TopologyApi - interface
 * 
 * @export
 * @interface TopologyApiInterface
 */
export interface TopologyApiInterface {
    /**
     * Retrieve the full topology graph associated with the account from Containers
     * @summary Get Containers Topology Graph
     * @param {ReportersTopologyFilters} [reportersTopologyFilters] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TopologyApiInterface
     */
    getContainersTopologyGraphRaw(requestParameters: GetContainersTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiDocsGraphResult>>;

    /**
     * Retrieve the full topology graph associated with the account from Containers
     * Get Containers Topology Graph
     */
    getContainersTopologyGraph(requestParameters: GetContainersTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiDocsGraphResult>;

    /**
     * Retrieve the full topology graph associated with the account from Hosts
     * @summary Get Hosts Topology Graph
     * @param {ReportersTopologyFilters} [reportersTopologyFilters] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TopologyApiInterface
     */
    getHostsTopologyGraphRaw(requestParameters: GetHostsTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiDocsGraphResult>>;

    /**
     * Retrieve the full topology graph associated with the account from Hosts
     * Get Hosts Topology Graph
     */
    getHostsTopologyGraph(requestParameters: GetHostsTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiDocsGraphResult>;

    /**
     * Retrieve the full topology graph associated with the account from Kubernetes
     * @summary Get Kubernetes Topology Graph
     * @param {ReportersTopologyFilters} [reportersTopologyFilters] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TopologyApiInterface
     */
    getKubernetesTopologyGraphRaw(requestParameters: GetKubernetesTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiDocsGraphResult>>;

    /**
     * Retrieve the full topology graph associated with the account from Kubernetes
     * Get Kubernetes Topology Graph
     */
    getKubernetesTopologyGraph(requestParameters: GetKubernetesTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiDocsGraphResult>;

    /**
     * Retrieve the full topology graph associated with the account from Pods
     * @summary Get Pods Topology Graph
     * @param {ReportersTopologyFilters} [reportersTopologyFilters] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TopologyApiInterface
     */
    getPodsTopologyGraphRaw(requestParameters: GetPodsTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiDocsGraphResult>>;

    /**
     * Retrieve the full topology graph associated with the account from Pods
     * Get Pods Topology Graph
     */
    getPodsTopologyGraph(requestParameters: GetPodsTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiDocsGraphResult>;

    /**
     * Retrieve the full topology graph associated with the account
     * @summary Get Topology Graph
     * @param {ReportersTopologyFilters} [reportersTopologyFilters] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TopologyApiInterface
     */
    getTopologyGraphRaw(requestParameters: GetTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiDocsGraphResult>>;

    /**
     * Retrieve the full topology graph associated with the account
     * Get Topology Graph
     */
    getTopologyGraph(requestParameters: GetTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiDocsGraphResult>;

    /**
     * Ingest data reported by one Agent
     * @summary Ingest Topology Data
     * @param {ModelRawReport} [modelRawReport] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TopologyApiInterface
     */
    ingestAgentReportRaw(requestParameters: IngestAgentReportRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Ingest data reported by one Agent
     * Ingest Topology Data
     */
    ingestAgentReport(requestParameters: IngestAgentReportRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

}

/**
 * 
 */
export class TopologyApi extends runtime.BaseAPI implements TopologyApiInterface {

    /**
     * Retrieve the full topology graph associated with the account from Containers
     * Get Containers Topology Graph
     */
    async getContainersTopologyGraphRaw(requestParameters: GetContainersTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiDocsGraphResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/graph/topology/containers`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ReportersTopologyFiltersToJSON(requestParameters.reportersTopologyFilters),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiDocsGraphResultFromJSON(jsonValue));
    }

    /**
     * Retrieve the full topology graph associated with the account from Containers
     * Get Containers Topology Graph
     */
    async getContainersTopologyGraph(requestParameters: GetContainersTopologyGraphRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiDocsGraphResult> {
        const response = await this.getContainersTopologyGraphRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve the full topology graph associated with the account from Hosts
     * Get Hosts Topology Graph
     */
    async getHostsTopologyGraphRaw(requestParameters: GetHostsTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiDocsGraphResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/graph/topology/hosts`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ReportersTopologyFiltersToJSON(requestParameters.reportersTopologyFilters),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiDocsGraphResultFromJSON(jsonValue));
    }

    /**
     * Retrieve the full topology graph associated with the account from Hosts
     * Get Hosts Topology Graph
     */
    async getHostsTopologyGraph(requestParameters: GetHostsTopologyGraphRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiDocsGraphResult> {
        const response = await this.getHostsTopologyGraphRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve the full topology graph associated with the account from Kubernetes
     * Get Kubernetes Topology Graph
     */
    async getKubernetesTopologyGraphRaw(requestParameters: GetKubernetesTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiDocsGraphResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/graph/topology/kubernetes`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ReportersTopologyFiltersToJSON(requestParameters.reportersTopologyFilters),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiDocsGraphResultFromJSON(jsonValue));
    }

    /**
     * Retrieve the full topology graph associated with the account from Kubernetes
     * Get Kubernetes Topology Graph
     */
    async getKubernetesTopologyGraph(requestParameters: GetKubernetesTopologyGraphRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiDocsGraphResult> {
        const response = await this.getKubernetesTopologyGraphRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve the full topology graph associated with the account from Pods
     * Get Pods Topology Graph
     */
    async getPodsTopologyGraphRaw(requestParameters: GetPodsTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiDocsGraphResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/graph/topology/pods`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ReportersTopologyFiltersToJSON(requestParameters.reportersTopologyFilters),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiDocsGraphResultFromJSON(jsonValue));
    }

    /**
     * Retrieve the full topology graph associated with the account from Pods
     * Get Pods Topology Graph
     */
    async getPodsTopologyGraph(requestParameters: GetPodsTopologyGraphRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiDocsGraphResult> {
        const response = await this.getPodsTopologyGraphRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve the full topology graph associated with the account
     * Get Topology Graph
     */
    async getTopologyGraphRaw(requestParameters: GetTopologyGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiDocsGraphResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/graph/topology/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ReportersTopologyFiltersToJSON(requestParameters.reportersTopologyFilters),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiDocsGraphResultFromJSON(jsonValue));
    }

    /**
     * Retrieve the full topology graph associated with the account
     * Get Topology Graph
     */
    async getTopologyGraph(requestParameters: GetTopologyGraphRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiDocsGraphResult> {
        const response = await this.getTopologyGraphRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Ingest data reported by one Agent
     * Ingest Topology Data
     */
    async ingestAgentReportRaw(requestParameters: IngestAgentReportRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/ingest/report`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModelRawReportToJSON(requestParameters.modelRawReport),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Ingest data reported by one Agent
     * Ingest Topology Data
     */
    async ingestAgentReport(requestParameters: IngestAgentReportRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.ingestAgentReportRaw(requestParameters, initOverrides);
    }

}
