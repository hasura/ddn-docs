import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import './styles.css';
import Icon from '@site/static/icons/event-triggers.svg';
import PostgreSqlLogo from '@site/static/img/databases/logos/postgresql.png';
import MongoDbLogo from '@site/static/img/databases/logos/mongodb.webp';
import TypeScriptLogo from '@site/static/img/databases/logos/ts.png';
import ClickHouseLogo from '@site/static/img/databases/logos/clickhouse-glyph.png';
import OpenAPILogo from '@site/static/img/databases/logos/openapi.png';
import PythonLogo from '@site/static/img/databases/logos/python.png';
import GraphQlLogo from '@site/static/img/databases/logos/gql.png';

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

import TypeScriptBusinessLogic from '@site/docs/getting-started/build/_databaseDocs/_typescript/_06-add-business-logic.mdx';
import PythonBusinessLogic from '@site/docs/getting-started/build/_databaseDocs/_python/_06-add-business-logic.mdx';

const dataSources = {
  PostgreSQL: {
    name: 'PostgreSQL',
    image: PostgreSqlLogo,
    connectorType: 'datasource',
  },
  MongoDB: {
    name: 'MongoDB',
    image: MongoDbLogo,
    connectorType: 'datasource',
  },
  ClickHouse: {
    name: 'ClickHouse',
    image: ClickHouseLogo,
    connectorType: 'datasource',
  },
  TypeScript: {
    name: 'TypeScript',
    image: TypeScriptLogo,
    connectorType: 'businessLogic',
  },
  Python: {
    name: 'Python',
    image: PythonLogo,
    connectorType: 'businessLogic',
  },
  OpenAPI: {
    name: 'OpenAPI',
    image: OpenAPILogo,
    connectorType: 'datasource',
  },
  GraphQL: {
    name: 'GraphQL',
    image: GraphQlLogo,
    connectorType: 'datasource',
  },
};

export const DatabaseContentLoader = () => {
  const location = useLocation();
  const [connectorPreference, setConnectorPreference] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dbParam = params.get('db');
    const savedPreference = localStorage.getItem('hasuraV3ConnectorPreference');
    const isBusinessLogicExcluded =
      location.pathname.includes('connect-to-data') || location.pathname.includes('mutate-data');

    if (dbParam && dataSources[dbParam]) {
      savePreference(dbParam);
    } else if (savedPreference) {
      if (dataSources[savedPreference]) {
        setConnectorPreference(savedPreference);
      } else {
        localStorage.removeItem('hasuraV3ConnectorPreference');
      }

      if (isBusinessLogicExcluded && (savedPreference === 'TypeScript' || savedPreference === 'Python')) {
        setConnectorPreference(null);
      } else {
        setConnectorPreference(savedPreference);
      }
    }
  }, [location.search, location.pathname]);

  const savePreference = (preference: string) => {
    const connectorObject = dataSources[preference];

    localStorage.setItem('hasuraV3ConnectorPreference', preference);

    history.push({
      search: `db=${preference}`,
    });

    setConnectorPreference(preference);
  };

  const getContent = () => {
    const isBusinessLogicExcluded =
      location.pathname.includes('connect-to-data') || location.pathname.includes('mutate-data');
    const isAddBusinessLogicPage = location.pathname.includes('add-business-logic');

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

  const isBusinessLogicExcluded =
    location.pathname.includes('connect-to-data') || location.pathname.includes('mutate-data');
  const isAddBusinessLogicPage = location.pathname.includes('add-business-logic');

  return (
    <div>
      <div className="picker-wrapper">
        <small>
          {connectorPreference &&
          (!isBusinessLogicExcluded || (connectorPreference !== 'TypeScript' && connectorPreference !== 'Python'))
            ? `You are now reading ${dataSources[connectorPreference].name}'s documentation`
            : "Select a data source's documentation"}
        </small>
        <div className="button-wrapper">
          {Object.keys(dataSources).map(key =>
            isAddBusinessLogicPage ? (
              (key === 'TypeScript' || key === 'Python') && (
                <div
                  key={key}
                  onClick={() => savePreference(key)}
                  className={`data-source ${connectorPreference === key ? 'selected' : ''}`}
                >
                  {dataSources[key].image ? (
                    <>
                      <img src={dataSources[key].image} alt={dataSources[key].name} />
                      <p>{dataSources[key].name}</p>
                    </>
                  ) : (
                    <button>{dataSources[key].name}</button>
                  )}
                </div>
              )
            ) : !isBusinessLogicExcluded || (key !== 'TypeScript' && key !== 'Python') ? (
              <div
                key={key}
                onClick={() => savePreference(key)}
                className={`data-source ${connectorPreference === key ? 'selected' : ''}`}
              >
                {dataSources[key].image ? (
                  <>
                    <img src={dataSources[key].image} alt={dataSources[key].name} />
                    <p>{dataSources[key].name}</p>
                  </>
                ) : (
                  <button>{dataSources[key].name}</button>
                )}
              </div>
            ) : null
          )}
          <Link to="/connectors/overview#supported-sources" className="data-source">
            <Icon />
            <p>Other connectors</p>
          </Link>
        </div>
      </div>
      {connectorPreference && (!isBusinessLogicExcluded || connectorPreference !== 'TypeScript') ? (
        getContent()
      ) : (
        <div>Please select your source preference.</div>
      )}
    </div>
  );
};
