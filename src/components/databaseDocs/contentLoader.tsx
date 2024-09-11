import React from 'react';
import { useLocation } from '@docusaurus/router';
import PostgreSqlConnect from '@site/docs/getting-started/build/03-connect-to-data/_databaseDocs/_postgreSQL/_01-connect-a-source.mdx';
import MongoDBConnect from '@site/docs/getting-started/build/03-connect-to-data/_databaseDocs/_mongoDB/_01-connect-a-source.mdx';
import ClickHouseConnect from '@site/docs/getting-started/build/03-connect-to-data/_databaseDocs/_clickHouse/_01-connect-a-source.mdx';
import OpenAPIConnect from '@site/docs/getting-started/build/03-connect-to-data/_databaseDocs/_openAPI/_01-connect-a-source.mdx';
import GraphQLConnect from '@site/docs/getting-started/build/03-connect-to-data/_databaseDocs/_graphql/_01-connect-a-source.mdx';

import PostgreSqlMutate from '@site/docs/getting-started/build/_databaseDocs/_postgreSQL/_08-mutate-data.mdx';
import MongoDBMutate from '@site/docs/getting-started/build/_databaseDocs/_mongoDB/_08-mutate-data.mdx';
import ClickHouseMutate from '@site/docs/getting-started/build/_databaseDocs/_clickHouse/_08-mutate-data.mdx';
import OpenAPIMutate from '@site/docs/getting-started/build/_databaseDocs/_openAPI/_08-mutate-data.mdx';
import GraphQlMutate from '@site/docs/getting-started/build/_databaseDocs/_graphql/_08-mutate-data.mdx';

import PostgreSqlDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_postgreSQL/_03-deploy-a-connector.mdx';
import MongoDBDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_mongoDB/_03-deploy-a-connector.mdx';
import TypeScriptDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_typeScript/_03-deploy-a-connector.mdx';
import ClickHouseDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_clickHouse/_03-deploy-a-connector.mdx';
import OpenAPIDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_openAPI/_03-deploy-a-connector.mdx';
import GraphQlDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_graphql/_03-deploy-a-connector.mdx';
import PythonDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_python/_03-deploy-a-connector.mdx';
import GoDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_go/_03-deploy-a-connector.mdx';

import TypeScriptBusinessLogic from '@site/docs/getting-started/build/_databaseDocs/_typescript/_06-add-business-logic.mdx';
import PythonBusinessLogic from '@site/docs/getting-started/build/_databaseDocs/_python/_06-add-business-logic.mdx';
import GoBusinessLogic from '@site/docs/getting-started/build/_databaseDocs/_go/_06-add-business-logic.mdx';

export const getContent = (connectorPreference: string | null, dataSources: any) => {
  const location = useLocation();
  const isBusinessLogicExcluded =
    location.pathname.includes('connect-to-data') || location.pathname.includes('mutate-data');

  if (
    isBusinessLogicExcluded &&
    connectorPreference &&
    dataSources[connectorPreference].connectorType === 'businessLogic'
  ) {
    return <div>Content not available for this selection</div>;
  }

  let pathParts = location.pathname.split('/').filter(Boolean);
  let route = pathParts.pop();

  switch (route) {
    case 'connect-a-source':
      switch (connectorPreference) {
        case 'PostgreSQL':
          return <PostgreSqlConnect />;
        case 'MongoDB':
          return <MongoDBConnect />;
        case 'ClickHouse':
          return <ClickHouseConnect />;
        case 'OpenAPI':
          return <OpenAPIConnect />;
        case 'GraphQL':
          return <GraphQLConnect />;
        default:
          return <div />;
      }
    case 'add-business-logic':
      switch (connectorPreference) {
        case 'TypeScript':
          return <TypeScriptBusinessLogic />;
        case 'Python':
          return <PythonBusinessLogic />;
        case 'Go':
          return <GoBusinessLogic />;
        default:
          return <div />;
      }
    case 'mutate-data':
      switch (connectorPreference) {
        case 'PostgreSQL':
          return <PostgreSqlMutate />;
        case 'MongoDB':
          return <MongoDBMutate />;
        case 'ClickHouse':
          return <ClickHouseMutate />;
        case 'GraphQL':
          return <GraphQlMutate />;
        case 'OpenAPI':
          return <OpenAPIMutate />;
        default:
          return <div />;
      }
    case 'deploy-a-connector':
      switch (connectorPreference) {
        case 'PostgreSQL':
          return <PostgreSqlDeploy />;
        case 'MongoDB':
          return <MongoDBDeploy />;
        case 'ClickHouse':
          return <ClickHouseDeploy />;
        case 'TypeScript':
          return <TypeScriptDeploy />;
        case 'Python':
          return <PythonDeploy />;
        case 'Go':
          return <GoDeploy />;
        case 'OpenAPI':
          return <OpenAPIDeploy />;
        case 'GraphQL':
          return <GraphQlDeploy />;
        default:
          return <div />;
      }
    default:
      return <div>Content not found...</div>;
  }
};
